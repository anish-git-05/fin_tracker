import { useState, useEffect } from "react";
import { API_URL } from "../api.js";
import "../style/predict.css";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function Predict(){
    const [data, setdata] = useState(null);
    const [load, setload] = useState(true);
    const [err, seterr] = useState(""); 
    const month=new Date().toLocaleString('default',{month:'long'})
    useEffect(() => {
        async function getPrediction() {
            const token = localStorage.getItem("token");
            if (!token) {
                window.location.href = '/login';
                return;
            }
            // const cachedData = sessionStorage.getItem("predictData");
            // if (cachedData) {
            //     setdata(JSON.parse(cachedData));
            //     setload(false);
            //     return; 
            // }
            try {
                const response = await fetch(`${API_URL}/predict/burn-rate`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem("token");
                        window.location.href = "/login";
                        return;
                    }
                    throw new Error("Failed to fetch ML prediction");
                }
                const result = await response.json(); 
                // sessionStorage.setItem("predictData", JSON.stringify(result));
                setdata(result);

            } catch (e) {
                seterr(e.message);
            } finally {
                setload(false);
            }
        }
        
        getPrediction();
    }, []);

    return(
        <div className="predict-container">
            <div className="predict-card">
                <h2>End of Month Forecast ({month})</h2>

                {load ? (
                    <div className="spinner-container">
                        <div className="predict-spinner"></div>
                        <p>Predicting End of Month Spending...</p>
                    </div>
                ) : err ? (
                    <p className="error-text">{err}</p> 
                ) : data ? (
                    <div className="prediction-content">
                        {data.predicted_total > 0 ? (
                            <>
                                <div className="main-prediction">
                                    <p>Projected Spend (Day {data.days_in_month})</p>
                                    <h1 className="danger-text">
                                        ₹{data.predicted_total.toLocaleString()}
                                    </h1>
                                </div>
                        
                                <div className="stats-grid">
                                    <div className="stat-box">
                                        <span>Current Spend</span>
                                        <strong>₹{data.current_spend.toLocaleString()}</strong>
                                    </div>
                                    <div className="stat-box">
                                        <span>Current Day</span>
                                        <strong>{data.current_day}</strong>
                                    </div>
                                    {/* <div className="stat-box">
                                        <span>Confidence</span>
                                        <strong style={{ color: data.confidence_score > 70 ? "#51cf66" : "#fcc419" }}>
                                            {data.confidence_score}%
                                        </strong>
                                    </div> */}
                                </div>
                                <div className="chart-header">
                                    <div className="chart-title-group">
                                        <span className="live-dot"></span>
                                        <h3>Spending Trajectory</h3>
                                    </div>
                                    <span className="chart-badge">
                                        Visualisation
                                    </span>
                                </div>
                                <div style={{ width: '100%', height: 350, marginTop: '30px' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={data.chart_data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                                <XAxis dataKey="day" stroke="#a0aabf" tick={{fontSize: 12}} />
                                                <YAxis stroke="#a0aabf" tick={{fontSize: 12}} />
                                                <Tooltip 
                                                    contentStyle={{ backgroundColor: '#161b22', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                                    itemStyle={{ color: '#e6edf3' }}
                                                />
                                                <Line type="monotone" dataKey="actual" name="Actual Spend" stroke="#4da6ff" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                                <Line type="monotone" dataKey="forecast" name="Predicted" stroke="#ef4444" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                    {data.ai_insight && (
                                                            <div className="ai-insight-box">
                                                                <span className="ai-sparkle">✨ Suggestions</span>
                                                                <p>{data.ai_insight}</p>
                                                            </div>
                                                        )}
                            </>
                        ) : (
                            <div className="empty-state">
                                <p>{data.message}</p>
                            </div>
                        )}
                    </div>
                ) : null}
            </div>
        </div>
    );
}   

export default Predict;