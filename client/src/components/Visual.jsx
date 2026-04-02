import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Legend,
    Tooltip
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";
import { useState, useEffect } from "react";
import "../style/Visual.css";
import { API_URL } from "../api.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Legend,
    Tooltip
);

ChartJS.defaults.color = "#a0aabf"; 

function authfetch(url) {
    const token = localStorage.getItem("token");
    return fetch(url, {
        headers: { "Authorization": `Bearer ${token}` }
    });
}

function ExpenseLineChart() {
    let labels = [];
    const [dataind, setdataind] = useState([]);
    
    useEffect(() => {
        async function getData() {
            const response = await authfetch(`${API_URL}/summary`);
            const data = await response.json();
            setdataind(data);
        }
        getData();  
    }, []);
    
    let dayWiseExpenses = [];
    for (let i = 0; i < dataind.length; i++) {
        dayWiseExpenses.push(dataind[i].total);
    }
    let n = dataind.length;
    for (let i = 1; i <= n; i++) {
        labels.push(i.toString());
    }
    let datapoints = [];
    if (dataind.length) {
        datapoints.push(dayWiseExpenses[0]);
        for (let i = 1; i < n; i++) {
            datapoints.push(datapoints[i - 1] + dayWiseExpenses[i]);
        }
    }
    
    const graph = {
        labels: labels,
        datasets: [{
            label: "Cumulative Expenses",
            data: datapoints,
            borderColor: "#4da6ff",
            backgroundColor: "rgba(77, 166, 255, 0.1)",
            tension: 0.3,
            pointBackgroundColor: "#161b22",
            pointBorderColor: "#4da6ff",
            pointRadius: 4
        }],
    }
    
    const options = {
        responsive: true,
        maintainAspectRatio: false, 
        plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Cumulative Expenses for the Month", color: "#ffffff", font: { size: 16 } }
        },
        scales: {
            x: { grid: { color: "rgba(255, 255, 255, 0.05)" } },
            y: { grid: { color: "rgba(255, 255, 255, 0.05)" } }
        }
    }
    
    return <Line data={graph} options={options} />
} 

function BarChart() {
    let labels = [];
    const [dataind, setdataind] = useState([]);
    
    useEffect(() => {
        async function getData() {
            const response = await authfetch(`${API_URL}/summary`);
            const data = await response.json();
            setdataind(data);
        }
        getData();  
    }, []);
    
    let dayWiseExpenses = [];
    for (let i = 0; i < dataind.length; i++) {
        dayWiseExpenses.push(dataind[i].total);
    }
    let n = dataind.length;
    for (let i = 1; i <= n; i++) {
        labels.push(i.toString());
    }
    
    const barData = {
        labels: labels,
        datasets: [{
            label: "Daily Expenses",
            data: dayWiseExpenses,
            backgroundColor: "#4da6ff", 
            borderRadius: 4 
        }]
    }
    
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Daily Expenses for the Month", color: "#ffffff", font: { size: 16 } }
        },
        scales: {
            x: { grid: { display: false } }, 
            y: { grid: { color: "rgba(255, 255, 255, 0.05)" } }
        }
    }
    
    return <Bar data={barData} options={options} />
}

function CategoryChart() {
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
    
    let Labels = [];
    let Dataset = [];
    for (let obj of catList) {
        Labels.push(obj.category_name);
        Dataset.push(obj.spent_money);
    }
    
    const pieData = {
        labels: Labels,
        datasets: [{
            label: "Category wise Expenses",
            data: Dataset,
          
            backgroundColor: ["#4da6ff", "#ff6b6b", "#51cf66", "#fcc419", "#cc5de8"],
            borderColor: "#161b22", 
            borderWidth: 3
        }]
    }
    
    const options = {
        responsive: true,
        maintainAspectRatio: false, 
        plugins: {
            legend: { position: "bottom" },
            title: { display: true, text: "Top 5 Categories", color: "#ffffff", font: { size: 16 } }
        }
    }
    
    return (
        <div className="pie-wrapper">
            <Pie data={pieData} options={options} />
        </div>
    )
}

function VisualPage() {
    return (
        <div className="visual-page-wrapper">
            <div className="chart-card">
                <ExpenseLineChart />
            </div>
            
            <div className="chart-card">
                <BarChart />
            </div>
            
            <div className="chart-card pie-card"> 
                <CategoryChart />
            </div>
        </div>
    )
}

export default VisualPage;