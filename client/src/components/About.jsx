import React from "react";
import { Link } from "react-router-dom";
import "../style/About.css"; 

function About() {
    return (
        <div className="about-container">
      
      {/* HERO SECTION */}
      <div className="about-hero">
        <h1>FinTracker</h1>
        <p className="tagline">
          AI-Powered Personal Finance Dashboard
        </p>
        <p className="description">
          FinTracker is a smart financial management platform that helps users 
          track, analyze, and predict their expenses using Machine Learning and AI.
        </p>
      </div>

      {/* FEATURES */}
      <div className="about-section">
        <h2>✨ What Makes FinTracker Special?</h2>

        <div className="features-grid">
          <div className="feature-card">
            <h3>📊 Smart Tracking</h3>
            <p>
              Easily manage daily expenses with categorized transactions and 
              real-time balance updates.
            </p>
          </div>

          <div className="feature-card">
            <h3>📈 Predictive Analytics</h3>
            <p>
              Uses Linear Regression to forecast your monthly spending based 
              on daily trends.
            </p>
          </div>

          <div className="feature-card">
            <h3>🚨 Anomaly Detection</h3>
            <p>
              Isolation Forest detects unusual transactions like sudden spikes 
              or unexpected high expenses.
            </p>
          </div>

          <div className="feature-card">
            <h3>🤖 AI Financial Assistant</h3>
            <p>
              Integrated AI (Gemini API) provides personalized financial advice 
              based on your real-time data.
            </p>
          </div>
        </div>
      </div>

      {/* ML SECTION */}
      <div className="about-section">
        <h2>🧠 Machine Learning Inside</h2>

        <div className="ml-box">
          <p>
            FinTracker goes beyond basic expense tracking by leveraging 
            powerful Machine Learning techniques:
          </p>

          <ul>
            <li>
              <strong>Linear Regression Modeling:</strong> Daily spending patterns 
              are analyzed to predict future expenses.
            </li>
            <li>
              <strong>Outlier Filtering:</strong> Removes extreme values 
              to improve prediction accuracy.
            </li>
            <li>
              <strong>Isolation Forest:</strong> Identifies abnormal transactions 
              automatically.
            </li>
            <li>
              <strong>RAG-based AI:</strong> Combines database insights with LLM 
              responses for accurate financial advice.
            </li>
          </ul>
        </div>
      </div>

      {/* TECH STACK */}
      <div className="about-section">
        <h2>⚙️ Tech Stack</h2>

        <div className="tech-stack">
          <span>React</span>
          <span>Flask</span>
          <span>PostgreSQL</span>
          <span>Scikit-learn</span>
          <span>Pandas</span>
          <span>Gemini API</span>
        </div>
      </div>


    </div>
    );
}

function Footer() {
    return (
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-section">
                    <h4>FinTracker</h4>
                    <p>Your personal visual finance tool.</p>
                </div>
                
                <div className="footer-section">
                    <h4>Developed By</h4>
                    <p>Anish | Tharun | Rudra | Ajay | Rahul | Vignan</p>
                    <p>IIT Patna Team Project</p>
                </div>

                <div className="footer-section">
                    <h4>Contact Us</h4>
                    <p>Email: support@fintracker.com</p>
                    <p>Phone: +91 8555816349</p>
                </div>
            </div>
            
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} FinTracker. All rights reserved.</p>
            </div>
        </footer>
    );
}

export { About, Footer };
