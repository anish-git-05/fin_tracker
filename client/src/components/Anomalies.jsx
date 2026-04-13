import { useState, useEffect } from "react";
import { API_URL } from "../api.js";
import "../style/Anomalies.css"; 

function Anomalies() {
    const [anomalies, setAnomalies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAnomalies() {
            const token = localStorage.getItem("token");
            try {
                const response = await fetch(`${API_URL}/predict/anomalies`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await response.json();
                
                if (response.ok && data.anomalies) {
                    setAnomalies(data.anomalies);
                }
            } catch (error) {
                console.error("Failed to fetch anomalies:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchAnomalies();
    }, []);

    if (loading) return null; 

    if (anomalies.length === 0) return null; 

    return (
        <div className="anomalies-card">
            <div className="anomalies-header">
                <span className="anomalies-icon">⚠️</span>
                <h3 className="anomalies-title">AI Anomaly Detection</h3>
            </div>
            <p className="anomalies-subtitle">Our ML models flagged these unusual expenses:</p>
            
            <div className="anomalies-list">
                {anomalies.map((a) => (
                    <div key={a.transaction_id} className="anomalies-item">
                        <div className="anomalies-item-left">
                            <strong className="anomalies-cat">{a.category_name}</strong>
                            <span className="anomalies-date">{a.date}</span>
                        </div>
                        <div className="anomalies-amount">
                            ₹{a.amount.toLocaleString()}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Anomalies;