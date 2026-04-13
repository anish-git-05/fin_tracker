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
import datetime
import calendar
from datetime import timedelta

from openai import OpenAI


load_dotenv()
app=Flask(__name__)
CORS(app)
app.config['JWT_SECRET_KEY']=os.getenv('JWT_SECRET_KEY')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
jwt=JWTManager(app)


def db():
    db_url = os.getenv('DATABASE_URL')
    
    # If the URL contains localhost, don't use SSL
    if "localhost" in db_url or "127.0.0.1" in db_url:
        return psycopg2.connect(db_url)
    
    # If it's your deployed live URL, require SSL
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
    data=request.get_json()
    uid = get_jwt_identity()
    # aid=data.get('account_id')
    cid=data.get('category_id')
    kharcha=data.get('amount')
    
    if not uid  or not cid or kharcha is None:
        return jsonify({'message': 'Missing required fields'}), 400
    
    conn=None
    try:
        conn = db()
        cur = conn.cursor()
        cur.execute("insert into transactions (user_id,category_id,amount) values (%s,%s,%s) returning transaction_id",(uid,cid,kharcha))
        tid=cur.fetchone()[0]

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
                select extract(day from time_details) as day,sum(amount)as daily_total
                from transactions
                where user_id=%s and  extract(month from time_details)=extract(month from current_date)
                group by extract(day from time_details)
                order by day asc;
                    """,(uid,))
        row=cur.fetchall()
        today=datetime.date.today()
        day=today.day
        days=calendar.monthrange(today.year,today.month)[1]
        if not row:
            return jsonify({
                "message": "Not enough data to predict yet.", 
                "predicted_total": 0,
                "current_spend": 0,
                "current_day": day,
                "days_in_month": days
            }), 200
        df=pd.DataFrame(row,columns=['day','amount'])
        df['amount'] = pd.to_numeric(df['amount'], downcast='float')
        df['psum']=df['amount'].cumsum()
        x=df[['day']].values
        y=df['psum'].values
        if len(df)<2:
            return jsonify({
                "message": "Not enough data to predict yet.", 
                "predicted_total": 0,
                "current_spend": float(y[-1]),
                "current_day": day,
                "days_in_month": days
            }), 200
        model=LinearRegression()
        model.fit(x,y)
        prediction=model.predict([[days]])

        chart_data = []
        
        for d, s in zip(df['day'].values, df['psum'].values):
            chart_data.append({
                "day": int(d), 
                "actual": float(s)
            })
            
        chart_data[-1]["forecast"] = float(y[-1])
        chart_data.append({
            "day": days, 
            "forecast": float(prediction[0])
        })


       # --- OPENAI INSIGHT CODE ---
        try:
            # 1. Fetch the top 2 categories (Keep your existing SQL query here)
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
                cat_text = " Their top 2 heaviest expenses are " + " and ".join([f"{row[0]} (₹{row[1]})" for row in top_cats]) + "."

            # 2. Verify Key and Call OpenAI
            api_key = os.getenv("OPENAI_API_KEY")
            if not api_key:
                print("🚨 ERROR: OPENAI_API_KEY is missing in .env!")
                ai_insight = "API Key not found in server environment."
            else:
                client = OpenAI(api_key=api_key)
                
                prompt = f"""
                You are a helpful and direct financial advisor. 
                The user has spent ₹{y[-1]} in {day} days.{cat_text} Their projected spend is ₹{prediction[0]:.2f} for the month.
                
                Provide clear, actionable, and encouraging financial advice. 
                Format your response strictly as 2 or 3 bullet points using the '•' symbol. Do NOT use markdown asterisks.
                
                Rules:
                - If the projection is high, suggest practical, simple ways to cut back on their specific top 2 categories.
                - If the spending is well-controlled, offer brief, friendly praise.
                - Keep the tone simple, professional, and easy to read.
                """
                
                response = client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": "You are an expert financial assistant."},
                        {"role": "user", "content": prompt}
                    ],
                    max_tokens=150,
                    temperature=0.7
                )
                
                ai_insight = response.choices[0].message.content.strip()
                print("✨ OpenAI Response successful!")

        except Exception as e:
            print(f"🚨 ACTUAL OPENAI ERROR: {type(e).__name__} - {str(e)}")
            ai_insight = "• Our AI Analyst is taking a quick break. Please try again in a moment!"
        # -----------------------------------
        return jsonify({
                "message": "Dekh bhai thoda kam kharch kr.", 
                "predicted_total": float(prediction[0]),
                "current_spend": float(y[-1]),
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





if __name__=="__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0",port=port,debug=True)



