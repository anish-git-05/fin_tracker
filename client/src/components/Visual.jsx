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
            const response=await fetch("http://localhost:5000/monthlyexpenses");
            const data=await response.json();
            setdataind(data);
        }
        getData();  
    },[]);
    let n=dataind.length;
    for(let i=1;i<=n;i++){
        labels.push(i.toString());
    }
    let datapoints=[];
    if(dataind.length){
        datapoints.push(dataind[0]);
        for(let i=1;i<n;i++){
            datapoints.push(datapoints[i-1]+dataind[i]);
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
            const response=await fetch("http://localhost:5000/monthlyexpenses");
            const data=await response.json();
            setdataind(data);
        }
        getData();  
    },[]);
    let n=dataind.length;
    for(let i=1;i<=n;i++){
        labels.push(i.toString());
    }
    const barData={
        labels:labels,
        datasets:[{
            label:"Daily Expenses",
            data:dataind,
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
    const[catData,setcatData]=useState({});
    useEffect(()=>{
        async function getData(){
            const response=await fetch("http://localhost:5000/categoryexpenses");
            const data=await response.json();
            setcatData(data);
        }
        getData();
    },[]);
    const pieData={
        labels:Object.keys(catData),
        datasets:[{
            label:"Category wise Expenses",
            data:Object.values(catData),
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
            <BarChart/>
            <CategoryChart/>
        </div>
    )
}
export default VisualPage;