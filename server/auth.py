from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import psycopg2
import psycopg2.extras
import os
from dotenv import load_dotenv

load_dotenv()
print(f"DEBUG: Password found is -> {os.getenv('DB_password')}")
app=Flask(__name__)
CORS(app)
app.config['JWT_SECRET_KEY']='your-super-secret-jwt-key' 
jwt=JWTManager(app)


def db():
    return psycopg2.connect(host="localhost",database="fintrack",user="postgres",password=os.getenv('DB_password'))


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
        cur.execute("select email, passhash from users where email=%s",(email,))
        user=cur.fetchone()
        cur.close()
        if user and check_password_hash(user['passhash'],password):
            access_token=create_access_token(identity=user['email'])
            return jsonify({'message':'Login successful.','access_token':access_token}),200
        return jsonify({'message':'Invalid credentials.'})
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

if __name__=="__main__":
    app.run(debug=True,port=5000)