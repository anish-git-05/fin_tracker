# FinTracker

FinTracker is a full-stack personal finance tracking web application that allows users to record expenses, visualize spending patterns, and analyze financial behavior through interactive dashboards and charts.

The application includes authentication, transaction tracking, analytics, and category-based expense visualization.

## Deployed link: 
https://fin-tracker-hazel.vercel.app/

## Features

- User authentication using JWT
- Add and manage expense transactions
- Category-based expense tracking
- Dashboard showing summary statistics
- Interactive visualizations (line chart, bar chart, pie chart)
- Recent transaction history
- Top spending categories

## Tech Stack

Frontend:
- React (Vite)
- Chart.js
- CSS

Backend:
- Flask
- JWT Authentication
- REST API

Database:
- PostgreSQL

Deployment:
- Frontend: Vercel
- Backend: Render
- Database: Render PostgreSQL

## Architecture

User → React Frontend → Flask API → PostgreSQL Database

## Running Locally

Clone the repository:

git clone https://github.com/anish-git-05/fin_tracker.git
cd fin_tracker

cd server
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py

cd client
npm install
npm run dev


