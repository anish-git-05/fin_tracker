import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def setup_db():
    try:
        db_url = os.getenv('DATABASE_URL')
        
        # 1. Safety check for the .env file
        if db_url is None:
            raise ValueError("DATABASE_URL is missing. Check your .env file!")

        # 2. Smart SSL Toggle
        if "localhost" in db_url or "127.0.0.1" in db_url:
            conn = psycopg2.connect(db_url) # Local: No SSL
        else:
            conn = psycopg2.connect(db_url, sslmode="require") # Live: SSL Required

        cur = conn.cursor()
        cur=conn.cursor()
        categories = [
            ('Food & Dining', True),
            ('Rent/Mortgage', True),
            ('Utilities', True),
            ('Entertainment', False),
            ('Shopping', False),
            ('EMI/Loan', False),
            ('Transportation', True),
            ('Healthcare', True),
            ('Others', False)
        ]

        cur.execute("create table if not exists users(user_id serial primary key,name varchar(50),email varchar(100) unique,passhash text)")
        cur.execute("create table if not exists accounts(account_id serial primary key,user_id int,name varchar(40),balance decimal(15,2),foreign key(user_id) references users(user_id))")
        cur.execute("create table if not exists categories(category_id serial primary key,name varchar(60),is_essential bool)")
        cur.execute("create table if not exists transactions(transaction_id serial primary key,user_id int,account_id int,category_id int,amount decimal(15,2),time_details timestamp default current_timestamp,foreign key(user_id) references users(user_id),foreign key(account_id) references accounts(account_id),foreign key(category_id) references categories(category_id))")
        for i,j in categories:
            cur.execute("insert into categories (name,is_essential) values (%s,%s)",(i,j))
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        print("Error in database proceedings!",e)





if __name__=="__main__":
    setup_db()
