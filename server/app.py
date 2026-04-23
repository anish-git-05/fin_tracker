from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import psycopg2
import psycopg2.extras
import os
from dotenv import load_dotenv
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import IsolationForest
from sklearn.metrics import r2_score
import datetime
import calendar
from datetime import timedelta
import google.generativeai as genai
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


load_dotenv()
app=Flask(__name__)
CORS(app)
app.config['JWT_SECRET_KEY']=os.getenv('JWT_SECRET_KEY')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
jwt=JWTManager(app)


def db():
    db_url = os.getenv('DATABASE_URL')
    
    if "localhost" in db_url or "127.0.0.1" in db_url:
        return psycopg2.connect(db_url)
    else:
        return psycopg2.connect(db_url, sslmode="require")


#_____________________________________________________________________________________________________________________________________#
#authentication section

#register
@app.route('/register', methods=['POST'])
def register():
    data=request.get_json()
    email = data.get('email')
    username=data.get('username')
    password=data.get('password')
    
    if(not email or not username or not password):
        return jsonify({'message':'Fill the required fields'}),400
    conn=None
    try:
        conn=db()
        cur=conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cur.execute("select * from users where email=%s",(email,))
        if cur.fetchone():
            cur.close()
            return jsonify({'message':'User already exist'}),400
        hp=generate_password_hash(password)
        cur.execute("insert into users (name,email,passhash) values (%s, %s, %s)",(username,email,hp))
        conn.commit()
        cur.close()
        return jsonify({'message': 'User registered successfully!'}), 201
    except Exception as e:
        if conn: conn.rollback()
        print("Error in database :",e)
        return jsonify({'message':'Server error.Sorry for inconvenience caused!'}),500
    finally:
        if conn:conn.close()



#login
@app.route('/login', methods=['POST'])
def login():
    data=request.get_json()
    email = data.get('email')
    password=data.get('password')
    if(not email or not password):
        return jsonify({'message':'Fill the required fields'}),400
    conn=None
    try:
        conn=db()
        cur=conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cur.execute("select user_id, email, passhash from users where email=%s",(email,))
        user=cur.fetchone()
        cur.close()
        if user and check_password_hash(user['passhash'],password):
            access_token=create_access_token(identity=str(user['user_id']))
            return jsonify({'message':'Login successful.','access_token':access_token,'user_id':user['user_id']}),200
        return jsonify({'message':'Invalid credentials.'}),401
    except Exception as e:
        print("Error in database :",e)
        return jsonify({'message':'Server error.Sorry for inconvenience caused!'}),500
    finally:
        if conn:conn.close()

@app.route('/protected',methods=['GET'])
@jwt_required()
def protected():
    u=get_jwt_identity()
    return jsonify({'message':f'Welcome,{u}!'}), 200



#____________________________________________________________________________________________________________________#
#profile section
@app.route('/profile',methods=['GET'])
@jwt_required()
def profile():
    uid = get_jwt_identity()

    if not uid:
        return jsonify({'message': 'user_id is required.'}), 400
    conn=None
    try:
        conn=db()
        cur=conn.cursor()
        
        cur.execute("""
                        select name, email from users where users.user_id=%s
                    """,(uid,))
        
        pro=cur.fetchone()
        if pro:
            return jsonify({'username':pro[0],'email':pro[1]})
        else:
            return jsonify({'message':'User not found'})
    except Exception as e:
        return jsonify({'message':str(e)}),500
    finally:
        if conn:
            cur.close()
            conn.close()
#____________________________________________________________________________________________________________________#
#accounts section

'''
@app.route('/accounts',methods=['POST'])
@jwt_required()
def create_account():
    data=request.get_json()
    uid = get_jwt_identity()
    name=data.get('name')
    bal=data.get('balance',0.00)

    if not uid or not name:
        return jsonify({'message':'user id and name are requireed'}),400
    conn=None
    try:
        conn=db()
        cur=conn.cursor()
        cur.execute("insert into accounts (user_id,name,balance) values (%s,%s,%s) returning account_id",(uid,name,bal))
        acc_id=cur.fetchone()[0]
        conn.commit()
        return jsonify({'message':'Account created successfully','account_id':acc_id,'name':name,'balance':bal}),201
    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({'message':str(e)}),500
    finally:
        if conn:
            cur.close()
            conn.close()

@app.route('/accounts',methods=['GET'])
@jwt_required()
def get_account():
    uid = get_jwt_identity()
    if not uid:
        return jsonify({'message':'user_id is required.'}),400
    conn=None
    try:
        conn=db()
        cur=conn.cursor()
        cur.execute("select account_id,name,balance from accounts where user_id=%s",(uid,))
        acc=cur.fetchall()
        acc_list=[]
        for i in acc:
            acc_list.append({
                "account_id":i[0],"name":i[1],"balance":float(i[2])
            })
        return jsonify({'accounts':acc_list}),200
    except Exception as e:
        return jsonify({'message':str(e)}),500
    finally:
        if(conn):
            cur.close()
            conn.close()






'''
#___________________________________________________________________________________________#
# categories section

@app.route('/categories',methods=['GET'])
def get_cat():
    conn=None
    try:
        conn=db()
        cur=conn.cursor()
        cur.execute("select category_id, name from categories")
        cat=cur.fetchall()
        cat_list=[]
        for i in cat:
            cat_list.append({
                'category_id':i[0],
                'name':i[1],
            })
        return jsonify(cat_list),200
    except Exception as e:
        return jsonify({'message':str(e)}),500
    finally:
        if conn:
            cur.close()
            conn.close()


@app.route('/categorywiseSpending',methods=['GET'])
@jwt_required()
def get_categorywise():
    uid = get_jwt_identity()

    if not uid:
        return jsonify({'message': 'user_id is required.'}), 400
    conn=None
    try:
        conn=db()
        cur=conn.cursor()
        
        cur.execute("""
                        select c.name,c.category_id,SUM(t.amount)
                    from transactions t,categories c
                    where t.category_id=c.category_id and t.user_id=%s
                    group by c.name,c.category_id
                    order by SUM(t.amount) desc
                    """,(uid,))
        
        sp=cur.fetchall()

        sp_list=[]
        for i in sp:
            sp_list.append({
                'category_name':i[0],
                'category_id':i[1],
                'spent_money':float(i[2])
            })
        return jsonify(sp_list),200
    except Exception as e:
        return jsonify({'message':str(e)}),500
    finally:
        if conn:
            cur.close()
            conn.close()


#________________________________________________________________________________________________________#
#transaction section

@app.route('/addtransactions',methods=['POST'])
@jwt_required()
def add_transaction():
    data = request.get_json()
    uid = get_jwt_identity()
    cid = data.get('category_id')
    kharcha = data.get('amount')
    
    # Extract the custom time sent from React
    time_details = data.get('time_details') 
    
    if not uid or not cid or kharcha is None:
        return jsonify({'message': 'Missing required fields'}), 400
    
    # Fallback just in case time_details isn't sent
    if not time_details:
        time_details = datetime.datetime.now()
    
    conn=None
    try:
        conn = db()
        cur = conn.cursor()
        
        # Updated SQL query to insert the specific time_details
        cur.execute(
            "insert into transactions (user_id, category_id, amount, time_details) values (%s, %s, %s, %s) returning transaction_id",
            (uid, cid, kharcha, time_details)
        )
        tid = cur.fetchone()[0]

        cur.execute("update accounts set balance=balance-%s where user_id=%s",(kharcha,uid))
        conn.commit()
        return jsonify({'message': 'Transaction added successfully!', 'transaction_id': tid}), 201

    except Exception as e:
        return jsonify({'message':str(e)}),500
    finally:
        if conn:
            cur.close()
            conn.close()

@app.route('/gettransactions',methods=['GET'])
@jwt_required()
def get_transactions():
    uid = int(get_jwt_identity())
    
    if not uid:
        return jsonify({'message': 'user_id is required.'}), 400
    conn = None
    try:
        conn = db()
        cur = conn.cursor()
        cur.execute("""
               select  t.transaction_id,t.amount,t.time_details,c.name
               from transactions t, categories c
               where t.category_id=c.category_id and t.user_id=%s
                order by t.time_details desc
                limit 5       
        """,(uid,))
        t=cur.fetchall()
        t_list=[]
        for i in t:
            t_list.append({
                'transaction_id':i[0],
                'amount':float(i[1]),
                'time_details':i[2].strftime("%Y-%m-%d %H:%M:%S"),
                'category_name':i[3]
            })
        return jsonify(t_list), 200
    except Exception as e:
        return jsonify({'message':str(e)}),500
    finally:
        if conn:
            cur.close()
            conn.close()




#total expences
#avg daily exp
#mode exp
@app.route('/summary',methods=['GET'])
@jwt_required()
def summary():
    uid = get_jwt_identity()

    if not uid:
        return jsonify({'message': 'user_id is required.'}), 400
    conn = None
    try:
        conn = db()
        cur = conn.cursor()
        cur.execute("""
                    select date(time_details) as spend_date, sum(amount) as total
                    from transactions
                    where user_id=%s 
                    and extract(month from time_details)=extract(month from current_date)
                    and extract(year from time_details)=extract(year from current_date)
                    group by date(time_details)
                    order by date(time_details) asc;
                    """,(uid,))
        
        t=cur.fetchall()
        t_list=[]
        for i in t:
            t_list.append({
                'spend_date':i[0].strftime("%Y-%m-%d"),
                'total':float(i[1]),
            })
        return jsonify(t_list), 200
    except Exception as e:
        return jsonify({'message':str(e)}),500
    finally:
        if conn:
            cur.close()
            conn.close()


#______________________________________________________________________________________________________________________________________#
# ML Section

@app.route('/predict/burn-rate',methods=['GET'])
@jwt_required()
def predict():
    uid=get_jwt_identity()
    if not uid:
        return jsonify({'message':'Please login to continue.'}),400
    conn=None
    try:
        conn=db()
        cur=conn.cursor()
        
        cur.execute("""
                select extract(day from time_details) as day, amount
                from transactions
                where user_id=%s and extract(month from time_details)=extract(month from current_date)
                order by day asc;
                    """,(uid,))
        rows=cur.fetchall()
        
        today=datetime.date.today()
        day=today.day
        days=calendar.monthrange(today.year,today.month)[1]
        
        if not rows:
            return jsonify({
                "message": "Not enough data to predict yet.", 
                "predicted_total": 0,
                "current_spend": 0,
                "current_day": day,
                "days_in_month": days
            }), 200
            
        #the suffix f is used to represent filter eg. dailyf->daily filtered data
        df=pd.DataFrame(rows,columns=['day','amount'])
        df['amount'] = pd.to_numeric(df['amount'], downcast='float')

        daily = df.groupby('day')['amount'].sum().reset_index()
        daily['psum'] = daily['amount'].cumsum()
        
        totalamount = float(daily['psum'].iloc[-1])


        if len(df) >= 10:
            iso_model = IsolationForest(contamination=0.15, random_state=10)
            df['flag'] = iso_model.fit_predict(df[['amount']])
            dff = df[df['flag'] == 1]  #-1 means anomaly
        else:
            dff = df
        
        if dff['day'].nunique() < 2:
            dff = df

        dailyf = dff.groupby('day')['amount'].sum().reset_index()
        dailyf['psum_clean'] = dailyf['amount'].cumsum()
        
        xf = dailyf[['day']].values
        yf = dailyf['psum_clean'].values
        
        if len(xf) < 2:
            return jsonify({
                "message": "Not enough data to predict yet.", 
                "predicted_total": 0,
                "current_spend": totalamount,
                "current_day": day,
                "days_in_month": days
            }), 200


        model=LinearRegression()
        model.fit(xf, yf)
        
        daily_rate=model.coef_[0]   # daily rate is the rate of spending without considering anomalies
        rem=days-day
        predicted_total=totalamount+(daily_rate*rem) #imp


        chart_data = []
        for d, s in zip(daily['day'].values, daily['psum'].values):
            chart_data.append({
                "day": int(d), 
                "actual": float(s)
            })
            
        chart_data[-1]["forecast"] = totalamount
        chart_data.append({
            "day": days, 
            "forecast": float(predicted_total)
        })

        #AI insights#
        try:
            cur.execute("""
                select c.name, sum(t.amount) as cat_total
                from transactions t
                join categories c on t.category_id = c.category_id
                where t.user_id = %s 
                and extract(month from t.time_details) = extract(month from current_date)
                group by c.name
                order by cat_total desc
                limit 2;
            """, (uid,))
            top_cats = cur.fetchall()
            
            cat_text = ""
            if top_cats:
                cat_text = " Their top 2 heaviest expenses are " + " and ".join([f"{r[0]} (₹{r[1]})" for r in top_cats]) + "."

            ai_model = genai.GenerativeModel('gemini-2.5-flash')
            prompt = f"""
            You are a helpful and direct financial advisor. 
            The user has spent ₹{totalamount} in {day} days.{cat_text} Their projected spend is ₹{predicted_total:.2f} for the month.
            
            Provide clear, actionable, and encouraging financial advice. 
            Format your response strictly as 2 or 3 bullet points using the '•' symbol. Do NOT use markdown asterisks.
            
            Rules:
            - If the projection is high, suggest practical, simple ways to cut back on their specific top 2 categories.
            - If the spending is well-controlled, offer brief, friendly praise.
            - Keep the tone simple, professional, and easy to read.
            """
            
            # Uncomment below 2 lines when ready to use actual Gemini API(limited acces hi hai isiliye soch samajh ke use krna)
            # ai_response = ai_model.generate_content(prompt)
            # ai_insight = ai_response.text.strip()
            ai_insight = "Our AI Analyst is currently busy. Please check back later!"
            
        except Exception as e:
            print(f"AI Error: {e}")
            ai_insight = "Our AI Analyst is currently busy. Please check back later!"

        return jsonify({
                "message": "Prediction generated successfully.", 
                "predicted_total": float(predicted_total),
                "current_spend": float(totalamount),
                "current_day": day,
                "days_in_month": days,
                "chart_data": chart_data,
                "ai_insight": ai_insight
            }), 200
            
    except Exception as e:
        print("ML Error:", e)
        return jsonify({'message': str(e)}), 500
    finally:
        if conn:
            cur.close()
            conn.close()


@app.route('/predict/anomalies', methods=['GET'])
@jwt_required()
def get_anomalies():
    uid = get_jwt_identity()
    if not uid:
        return jsonify({'message': 'Please login to continue.'}), 400
    conn = None
    try:
        conn = db()
        cur = conn.cursor()
        cur.execute("""
            select t.transaction_id, t.amount, c.name, t.time_details, t.category_id
            from transactions t
            join categories c ON t.category_id = c.category_id
            where t.user_id = %s
            order by t.time_details desc;
        """, (uid,))
        rows = cur.fetchall()
        if len(rows) < 10:
            return jsonify({
                "message": "Not enough data. Need at least 10 transactions to detect anomalies.", 
                "anomalies": []
            }), 200
        df = pd.DataFrame(rows, columns=['id', 'amount', 'cat_name', 'date', 'cat_id'])
        df['amount'] = pd.to_numeric(df['amount'], downcast='float')
        model = IsolationForest(contamination=0.15, random_state=10)    
        df['anomaly'] = model.fit_predict(df[['amount', 'cat_id']])
        anomalies_df = df[df['anomaly'] == -1]

        anomaly_list = []
        for _, row in anomalies_df.iterrows():
            anomaly_list.append({
                "transaction_id": row['id'],
                "amount": float(row['amount']),
                "category_name": row['cat_name'],
                "date": row['date'].strftime("%b %d, %Y"),
            })

        return jsonify({
            "message": "Anomaly check complete.", 
            "anomalies": anomaly_list
        }), 200
    except Exception as e:
        print("Anomaly ML Error:", e)
        return jsonify({'message': str(e)}), 500
    finally:
        if conn:
            cur.close()
            conn.close()



@app.route('/chat', methods=['POST'])
@jwt_required()
def chat():
    uid = get_jwt_identity()
    message = request.json.get('message')
    
    if not message:
        return jsonify({'reply': "Please ask a question!"}), 400

    conn = None
    try:
        conn = db()
        cur = conn.cursor()
        cur.execute("""
            select sum(amount) 
            from transactions 
            where user_id=%s and extract(month from time_details)=extract(month from current_date)
        """, (uid,))
        total=cur.fetchone()[0] or 0
        cur.execute("""
            select c.name, sum(t.amount) from transactions t
            join categories c on t.category_id = c.category_id
            where t.user_id = %s and extract(month from t.time_details) = extract(month from current_date)
            group by c.name 
            order by sum(t.amount) DESC 
            limit 3;
        """, (uid,))
        top_catg = cur.fetchall()
        cat_text = ", ".join([f"{r[0]} (₹{r[1]})" for r in top_catg]) if top_catg else "None yet"

        ai_model = genai.GenerativeModel('gemini-2.5-flash')
        prompt = f"""
        You are 'FinBot', a helpful, highly intelligent financial assistant built into the FinTracker app.
        
        The user has asked: "{message}"
        
        Here is the user's real-time data for this month:
        - Total Spent: ₹{total}
        - Top 3 Spending Categories: {cat_text}
        
        Rules for your response:
        - Answer their question directly using the data provided.
        - Be conversational, brief, and friendly. 
        - Do NOT use markdown asterisks or bolding. Keep it clean text.
        - Maximum 2 or 3 short sentences.
        """
        try:
            ai_response = ai_model.generate_content(prompt)
            reply = ai_response.text.strip()
        except Exception as api_error:
            print(f"Gemini API Limit Hit: {api_error}")
            reply = "I'm analyzing a lot of data right now and my circuits are a bit busy! But looking at your profile, your total spend is ₹" + str(total) + "."

        return jsonify({'reply': reply}), 200
    except Exception as e:
        print("Chat Error:", e)
        return jsonify({'reply': "Sorry, I am having trouble connecting to your bank vault right now!"}), 500
    finally:
        if conn:
            cur.close()
            conn.close()



if __name__=="__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0",port=port,debug=True)

