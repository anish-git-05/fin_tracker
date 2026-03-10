import {useState,useEffect} from "react";
import "../style/Dashboard.css";
function AddTransaction(){
    const [categories,setcategories]=useState([]);
    useEffect(()=>{
        async function getData(){
            const response=await fetch("http://localhost:5000/categories");
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
        const response=await fetch("http://localhost:5000/addtransactions",{
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
            <form onSubmit={handleSubmit}>
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
            const response=await fetch("http://localhost:5000/summary");
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
            <h3>Summary</h3>
            <p>Total expenses of the month:{sumExpenses}</p>
            <p>Average daily expenditure:{averageDailyExpenditure}</p>
            <p>Highest single day expenditure:{highestSingleDayExpenditure}</p>
        </div>
    )
}

function RecentTransactions(){
    const [transactions,settransactions]=useState([]);
    useEffect(()=>{
        async function getData(){
            const response =await fetch("http://localhost:5000/gettransactions");
            const data =await response.json();
            settransactions(data);
        }
        getData();
    },[])
    return(
        <div className="recentTransactions">
            <h3>Recent Transactions</h3>
            {
                transactions.map((t)=>(
                    <div key={t.transaction_id} className="transactionItem">
                        <p>{t.time_details}: {t.category_name} - Rs{t.amount}</p>
                    </div>
                )
                )
            }
        </div>
    )
}

function TopCategories(){
    const [catData,setcatData]=useState([]);
    useEffect(()=>{
        async function getData(){
            const response=await fetch("http://localhost:5000/categorywiseSpending");
            const data=await response.json();
            setcatData(data);
        }
        getData();
    },[]);
    let catList=[];
    for(let key in catData){
        catList.push({category:key,spent_money:catData[key]});
    }
    catList.sort((a,b)=>b.spent_money-a.spent_money);
    catList=catList.slice(0,5);
    return(
        <div className="topCategories">
            <h3>Top Spending Categories</h3>
            {
                catList.map((c)=>(
                    <div key={c.category_id} className="categoryItem">
                        <p>{c.category_name}: Rs{c.spent_money}</p>
                    </div>
                ))
    }
        </div>
    )
}

function Dashboard(){
    return(
        <div className="dashboard">
            <AddTransaction/>
            <SummaryCard/>
            <div className="bottomSection">
                <RecentTransactions/>
                <TopCategories/>
            </div>
        </div>
    )
}
export default Dashboard;