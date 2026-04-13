
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js';
import { useState, useEffect } from "react";
import "../style/Dashboard.css";
import { API_URL } from "../api.js";
import Predict from "./Predict";
import Anomalies from "./Anomalies";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

function authfetch(url) {
    const token = localStorage.getItem("token");
    return fetch(url, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
}

function SummaryCard() {
    const [sumData, setsumData] = useState([]);
    useEffect(() => {
        async function getData() {
            const response = await authfetch(`${API_URL}/summary`);
            const data = await response.json();
            setsumData(data);
        }
        getData();
    }, []);

    let sumExpenses = 0;
    for (let i = 0; i < sumData.length; i++) {
        sumExpenses += sumData[i].total;
    }
    let averageDailyExpenditure = sumData.length ? sumExpenses / sumData.length : 0;
    let highestSingleDayExpenditure = 0;
    for (let i = 0; i < sumData.length; i++) {
        if (sumData[i].total > highestSingleDayExpenditure) {
            highestSingleDayExpenditure = sumData[i].total;
        }
    }
    return (
        <div className="summaryCard">
            <h3>Monthly Spending Insights 📊</h3>
            <div className="grid">
                <div className="box">
                    <p>Total Spent: Rs {sumExpenses.toFixed(2)}</p>
                </div>
                <div className="box">
                    <p>Average Daily Expenditure: Rs {averageDailyExpenditure.toFixed(2)}</p>
                </div>
                <div className="box">
                    <p>Highest Single Day Expenditure: Rs {highestSingleDayExpenditure.toFixed(2)}</p>
                </div>
            </div>
        </div>
    )
}

function RecentTransactions() {
    const [transactions, settransactions] = useState([]);
    useEffect(() => {
        async function getData() {
            const response = await authfetch(`${API_URL}/gettransactions`);
            const data = await response.json();
            settransactions(data);
        }
        getData();
    }, [])
    
    return (
        <div className="recentTransactions">
            <h3>Recent Transactions</h3>
            <div className="t">
                <table className='tabl'>
                    <thead>
                        <tr>
                            <th>Date & Time</th>
                            <th>Category</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((t) => (
                            <tr key={t.transaction_id}>
                                <td>{t.time_details}</td>
                                <td>{t.category_name}</td>
                                <td style={{ fontWeight: "600", color: "#ffffff" }}>{t.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function TopCategories() {
    const [catData, setcatData] = useState([]);
    useEffect(() => {
        async function getData() {
            const response = await authfetch(`${API_URL}/categorywiseSpending`);
            const data = await response.json();
            setcatData(data);
        }
        getData();
    }, []);

    let catList = [];
    for (let i = 0; i < catData.length; i++) {
        catList.push({
            category_id: catData[i].category_id,
            category_name: catData[i].category_name,
            spent_money: catData[i].spent_money
        })
    }
    catList.sort((a, b) => b.spent_money - a.spent_money);
    catList = catList.slice(0, 5);

    return (
        <div className="topCategories">
            <h3>Top Spending Categories</h3>
            <div style={{ height: "250px", width: "100%", marginTop: "10px" }}>
                <Bar
                    data={{
                        labels: catList.map((c) => c.category_name),
                        datasets: [{
                            data: catList.map((c) => c.spent_money),
                            backgroundColor: '#2f83d7', borderRadius: 4
                        }]
                    }}
                    options={{
                        indexAxis: 'y',
                        maintainAspectRatio: false, plugins: { legend: { display: false } }
                    }}
                />
            </div>
        </div>
    )
}

function Dashboard() {
    return (
        <div className="dashboard">
            <div className="predict-wrapper" style={{ width: "100%", marginBottom: "20px" }}>
                <Predict />
            </div>
            <Anomalies />
            
            <SummaryCard />
            <div className="bottomSection">
                <TopCategories />
                <RecentTransactions />
            </div>
        </div>
    )
}

export default Dashboard;