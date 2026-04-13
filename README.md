📊 FinTracker — AI-Powered Personal Finance Dashboard

FinTracker is a secure, full-stack web application designed to help users track, analyze, and predict their expenses.
It goes beyond traditional finance apps by integrating Machine Learning models for predictive analytics and a Large Language Model (LLM) for personalized financial advice.

🚀 Key Highlights
📈 Predict future spending using ML (burn-rate forecasting)
🚨 Detect unusual expenses using anomaly detection
🤖 AI-powered financial assistant (FinBot)
🔐 Secure authentication with JWT
📊 Interactive dashboards and visualizations
🧠 Machine Learning Features
📈 Predictive Analytics (Burn Rate)
Uses Linear Regression on daily spending data
Forecasts end-of-month expenses
Displays predicted trajectory on charts
🚨 Anomaly Detection
Uses Isolation Forest
Identifies unusual transactions (e.g., spikes, anomalies)
Helps users catch unexpected expenses
🧹 Data Processing
Outlier filtering using IQR (Interquartile Range)
Clean time-based dataset for better predictions
🤖 FinBot — AI Financial Assistant
Built using Google Gemini API (gemini-2.5-flash)
Uses RAG (Retrieval-Augmented Generation):
Fetches real-time user data via SQL
Injects into prompt for personalized advice
Provides:
Spending insights
Budget suggestions
Smart recommendations
🏗️ Tech Stack
Frontend
React.js
React Router DOM
Custom CSS (dark theme + animations)
useState & useEffect
Backend
Python (Flask)
Flask-JWT-Extended (authentication)
Flask-CORS
Database
PostgreSQL
psycopg2 (with DictCursor)
Machine Learning
pandas, numpy
scikit-learn
Deployment
Render
🔐 Security Features
JWT-based authentication
Password hashing (Werkzeug)
Protected routes (Dashboard, Predictions, AI Chat)
Input validation (frontend + backend)
Chronological lock (prevents future transactions)
⚙️ Core Features
1. Secure Authentication
User registration & login
Encrypted passwords
Stateless session handling using JWT
2. Smart Transaction Management
Add expenses with category & timestamp
Real-time balance updates
Strict validation system
3. Predictive Analytics
Aggregates daily spending
Forecasts total monthly spend
Displays results on interactive charts
4. Anomaly Detection
Detects unusual spending patterns
Flags suspicious transactions automatically
5. AI Assistant (FinBot)
Context-aware financial advice
Uses real-time database insights
Includes fallback system for reliability
📊 System Architecture
User → React Frontend → Flask API → PostgreSQL
                              ↓
                      ML Models (Regression + Isolation Forest)
                              ↓
                        Gemini API (FinBot)
📸 Screenshots

(Add your dashboard screenshots here)

📈 Model Evaluation
Evaluated using:
MAE (Mean Absolute Error)
RMSE (Root Mean Squared Error)
R² Score (Model Fit)
Time-based train-test split used:
Train on past data
Test on future data
🚀 Future Improvements
Advanced time-series models (ARIMA / LSTM)
Mobile application
Multi-account integration (bank APIs)
Budget planning module
Enhanced anomaly explanations
💡 Why FinTracker?

Unlike traditional expense trackers, FinTracker:

Predicts future spending
Detects anomalies automatically
Provides AI-driven financial advice

👉 Making it a smart, data-driven finance system

🛠️ Setup Instructions
# Clone repo
git clone <your-repo-url>

# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
pip install -r requirements.txt
python app.py
