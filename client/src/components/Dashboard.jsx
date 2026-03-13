import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js';
import {useState,useEffect} from "react";
import "../style/Dashboard.css";
import {API_URL} from "../api.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);
function authfetch(url){
    const token=localStorage.getItem("token");
    return fetch(url,{
        headers:{
            "Authorization":`Bearer ${token}`
        }
    });
}
function AddTransaction(){
    const [categories,setcategories]=useState([]);
    useEffect(()=>{
        async function getData(){
            const response=await fetch(`${API_URL}/categories`);
            const data=await response.json();
            setcategories(data);
        }
        getData();
    },[]);
    const [transaction,setTransaction]=useState({
        amount:"",
        category_id:"",
    });
    const handleSubmit=async (e)=>{
        e.preventDefault();
        let token=localStorage.getItem("token");
        const response=await fetch(`${API_URL}/addtransactions`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            },
            body:JSON.stringify({
                amount:transaction.amount,
                category_id:transaction.category_id
            })

        });
        const data=await response.json();
        if(response.ok){
            alert("Transaction added successfully");
            setTransaction({amount:"",category_id:""});
        }else{
            alert(data.message || "Failed to add transaction");
        }
    }
    return(
        <div className="addTransaction">
            <h3 style={{color:"white"}}>Add Transaction</h3>
            <form className="tfom" onSubmit={handleSubmit}>
                <input type="number" min="0" placeholder="Amount" value={transaction.amount} onChange={(e)=>setTransaction({...transaction,amount:e.target.value})} required/>
                <select value={transaction.category_id} onChange={(e)=>setTransaction({...transaction,category_id:e.target.value})} required>
                   <option value="">Select Category</option>
                   {
                    categories.map((c)=>(
                        <option key={c.category_id} value={c.category_id}>{c.name}</option>
                    ))
                   }
                </select>
                <button type="submit">Add</button>
            </form>
        </div>
    )
}
function SummaryCard(){
    const [sumData,setsumData]=useState([]);
    useEffect(()=>{
        async function getData(){
            const response=await authfetch(`${API_URL}/summary`);
            const data=await response.json();
            setsumData(data);
        }
        getData();
    },[]);
    let sumExpenses=0;
    for(let i=0;i<sumData.length;i++){
        sumExpenses+=sumData[i].total;
    }
    let averageDailyExpenditure=sumData.length?sumExpenses/sumData.length:0;
    let highestSingleDayExpenditure=0;
    for(let i=0;i<sumData.length;i++){
        if(sumData[i].total>highestSingleDayExpenditure){
            highestSingleDayExpenditure=sumData[i].total;
        }
    }
    return(
        <div className="summaryCard">
            <h3>Monthly Spending Insights 📊</h3>
            <div className="grid">
                <div className="box">
                    <p>Total Spent:{sumExpenses}</p>
                </div>
                <div className="box">
                    <p>Average Daily Expenditure:{averageDailyExpenditure}</p>
                </div>
                <div className="box">
                    <p>Highest Single Day Expenditure:{highestSingleDayExpenditure}</p>
                </div>
            </div>
        </div>
    )
}

function RecentTransactions(){
    const [transactions,settransactions]=useState([]);
    useEffect(()=>{
        async function getData(){
            const response =await authfetch(`${API_URL}/gettransactions`);
            const data =await response.json();
            settransactions(data);
        }
        getData();
    },[])
    return(
        // <div className="recentTransactions">
        //     <h3>Recent Transactions</h3>
        //     {
        //         transactions.map((t)=>(
        //             <div key={t.transaction_id} className="transactionItem">
        //                 <p>{t.time_details}: {t.category_name} - Rs{t.amount}</p>
        //             </div>
        //         )
        //         )
        //     }
        // </div>
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
                        {
                            transactions.map((t)=>(
                                <tr key={t.transaction_id}>
                                    <td>{t.time_details}</td>
                                    <td>{t.category_name}</td>
                                    <td style={{fontWeight:"600", color:"#0F172A"}}>{t.amount}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function TopCategories(){
    const [catData,setcatData]=useState([]);
    useEffect(()=>{
        async function getData(){
            const response=await authfetch(`${API_URL}/categorywiseSpending`);
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
    return(
    //     <div className="topCategories">
    //         <h3>Top Spending Categories</h3>
    //         {
    //             catList.map((c)=>(
    //                 <div key={c.category_id} className="categoryItem">
    //                     <p>{c.category_name}: Rs{c.spent_money}</p>
    //                 </div>
    //             ))
    // }
    //     </div>
            <div className="topCategories">
                <h3>Top Spending Categories</h3>
                <div style={{ height: "250px", width: "100%", marginTop: "10px" }}>
                    <Bar
                    data={{
                        labels:catList.map((c)=>c.category_name),
                        datasets:[{
                            data:catList.map((c)=>c.spent_money),
                            backgroundColor:'#6366F1',borderRadius:4
                        }]
                    }}
                    options={{
                        indexAxis:'y',
                        maintainAspectRatio:false,plugins:{legend:{display:false}}
                    }}
                    />
                </div>
            </div>
    )
}

function Dashboard(){
    return(
        <div className="dashboard">
            <AddTransaction/>
            <SummaryCard/>
            <div className="bottomSection">
                <TopCategories/>
                <RecentTransactions/>
            </div>
        </div>
    )
}
export default Dashboard;
