from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
app=Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:123#poster@localhost:5432/fin_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY']='your-super-secret-jwt-key' 
jwt=JWTManager(app)
db=SQLAlchemy(app)

class User(db.Model):
    email=db.Column(db.String(120),primary_key=True)
    username=db.Column(db.String(80), unique=True, nullable=False)
    hp = db.Column(db.String(256), nullable=False) 

with app.app_context():
    db.create_all()


@app.route('/register', methods=['POST'])
def register():
    data=request.get_json()
    email = data.get('email')
    username=data.get('username')
    password=data.get('password')
    if User.query.filter_by(email=email).first():
        return jsonify({'message':'User already exists'}), 400
    hash=generate_password_hash(password)
    u=User(email=email,username=username,hp=hash)
    db.session.add(u)
    db.session.commit()
    return jsonify({'message':'User registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data=request.get_json()
    email = data.get('email')
    password=data.get('password')
    u=User.query.filter_by(email=email).first()
    if u and check_password_hash(u.hp,password):
        return jsonify({'message':'Login successful','access_token':create_access_token(identity=u.email)}), 200
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/protected',methods=['GET'])
@jwt_required()
def protected():
    u=get_jwt_identity()
    return jsonify({'message':f'Welcome,{u}!'}), 200

if __name__=="__main__":
    app.run(debug=True,port=5000)