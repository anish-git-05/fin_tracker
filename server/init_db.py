import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def setup_db():
    try:
        conn=psycopg2.connect(host="localhost",database="fintrack",user="postgres",password=os.getenv('DB_password'))
        cur=conn.cursor()
        cur.execute("drop table if exists transactions")
        cur.execute("drop table if exists users")
        cur.execute("drop table if exists accounts")
        cur.execute("drop table if exists categories")
        cur.execute("create table users(user_id serial primary key,name varchar(50),passhash text)")
        cur.execute("create table accounts(account_id serial primary key,name varchar(40),balance decimal(15,2))")
        cur.execute("create table categories(category_id serial primary key,name varchar(20),is_essential bool)")
        cur.execute("create table transactions(transaction_id serial primary key,user_id int,account_id int,category_id int,amount decimal(15,2),time_details timestamp default current_timestamp,foreign key(user_id) references users(user_id),foreign key(account_id) references accounts(account_id),foreign key(category_id) references categories(category_id))")
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        print("Error in database proceedings!",e)

if __name__=="__main__":
    setup_db()
