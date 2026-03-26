import React from "react";
import { Link } from "react-router-dom";
import "../style/About.css"; 

function About() {
    return (
        <div className="about-container">
            <div className="about-content">
                <h1 className="about-title">About FinTracker</h1>
                <p className="about-description">
                    FinTracker is a comprehensive personal finance management dashboard designed to help you take absolute control of your spending. Built with a focus on data visualization and predictive analytics, it transforms your raw financial data into actionable insights.
                </p>

                <div className="features-grid">
                    <div className="feature-card">
                        <h3>📊 Visual Analytics</h3>
                        <p>Interactive Pie, Bar, and Line charts powered by Chart.js to help you instantly understand your category-wise spending habits.</p>
                    </div>
                    <div className="feature-card">
                        <h3>🤖 Expense Predictor</h3>
                        <p>Advanced machine learning algorithms to forecast your end-of-month burn rate and automatically categorize your daily transactions.</p>
                    </div>
                    <div className="feature-card">
                        <h3>🔒 Secure & Private</h3>
                        <p>Bank-grade security featuring JWT authentication and isolated PostgreSQL data environments to keep your financial data strictly private.</p>
                    </div>
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
                    <p>Anish | Tharun | Rudra | Ajay</p>
                    <p>IIT Patna Team Project</p>
                </div>

                <div className="footer-section">
                    <h4>Contact Us</h4>
                    <p>Email: support@fintracker.com</p>
                    <p>Phone: +91 93350 58091</p>
                </div>
            </div>
            
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} FinTracker. All rights reserved.</p>
            </div>
        </footer>
    );
}

export { About, Footer };