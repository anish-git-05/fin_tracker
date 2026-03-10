import{
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
import{Line,Bar,Pie} from "react-chartjs-2";
import { useState,useEffect } from "react";
import "../style/Visual.css";
import {API_URL} from "./api.js";
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

function ExpenseLineChart(){
    let labels=[];
    const [dataind,setdataind]=useState([]);
    useEffect(()=>{
        async function getData(){
            const response=await fetch(`${API_URL}/summary`);
            const data=await response.json();
            setdataind(data);
        }
        getData();  
    },[]);
    let dayWiseExpenses=[];
    for(let i=0;i<dataind.length;i++){
        dayWiseExpenses.push(dataind[i].total);
    }
    let n=dataind.length;
    for(let i=1;i<=n;i++){
        labels.push(i.toString());
    }
    let datapoints=[];
    if(dataind.length){
        datapoints.push(dayWiseExpenses[0]);
        for(let i=1;i<n;i++){
            datapoints.push(datapoints[i-1]+dayWiseExpenses[i]);
        }
    }
    const graph={
        labels:labels,
        datasets:[{
            label:"Cumulative Expenses",
            data:datapoints,
            borderColor:"silver",
            backgroundColor:"darkblue",
            tension:0.2
        }],
    }
    const options={
            responsive:true,
            plugins:{
                legend:{
                    position:"top"
                },
                title:{
                    display:true,
                    text:"Cumulative Expenses for the Month"
                }
            },
            maintainAspectRatio:false
    }
    return(
        <div className="monthlyGraph">
            <Line data={graph} options={options}/>
        </div>
    )
} 
function BarChart(){
    let labels=[];
    const [dataind,setdataind]=useState([]);
    useEffect(()=>{
        async function getData(){
            const response=await fetch(`${API_URL}/summary`);
            const data=await response.json();
            setdataind(data);
        }
        getData();  
    },[]);
    let dayWiseExpenses=[];
    for(let i=0;i<dataind.length;i++){
        dayWiseExpenses.push(dataind[i].total);
    }
    let n=dataind.length;
    for(let i=1;i<=n;i++){
        labels.push(i.toString());
    }
    const barData={
        labels:labels,
        datasets:[{
            label:"Daily Expenses",
            data:dayWiseExpenses,
            backgroundColor:"indigo",
            borderColor:"indigo",
            borderWidth:1
        }]
    }
    const options={
        responsive:true,
        plugins:{
            legend:{
                position:"top",
            },
            title:{
                display:true,
                text:"Daily Expenses for the Month"
            }
        },
        maintainAspectRatio:false
    }
    return(
        <div className="BarGraph">
            <Bar data={barData} options={options}></Bar>
        </div>
    )
}

function CategoryChart(){
    const[catData,setcatData]=useState([]);
    useEffect(()=>{
        async function getData(){
            const response=await fetch(`${API_URL}/categorywiseSpending`);
            const data=await response.json();
            setcatData(data);
        }
        getData();
    },[]);
    let catList=[];
    for(let i=0;i<catData.length;i++){
        catList.push({
            category_id:catData[i].category_id,
            category_name:catData[i].category_name,
            spent_money:catData[i].spent_money
        })
    }
    catList.sort((a,b)=>b.spent_money-a.spent_money);
    catList=catList.slice(0,5);
    const pieData={
        labels:Object.keys(catList),
        datasets:[{
            label:"Category wise Expenses",
            data:Object.values(catList),
            backgroundColor:["red","blue","green","orange","purple","cyan","magenta","yellow","brown","gray"],
            borderColor:"black",
            borderWidth:1
        }]
    }
    const options={
        responsive:true,
        plugins:{
            legend:{
                position:"top",
            },
            title:{
                display:true,
                text:"Category wise Expenses for the Month"
            }
        }
    }
    return(
        <div className="PieChart">
            <Pie data={pieData} options={options}></Pie>
        </div>
    )
}
function VisualPage(){
    return(
        <div className="visualPage">
            <ExpenseLineChart/>
            <div className="separatorCharts">
                <BarChart/>
                <CategoryChart/>
            </div>
        </div>
    )
}
export default VisualPage;