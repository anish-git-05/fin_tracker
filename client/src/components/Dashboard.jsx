import {useState,useEffect} from "react";

function SummaryCard(){
    const [sumData,setsumData]=useState({});
    useEffect(()=>{
        async function getData(){
            const response=await fetch("http://localhost:5000/summary");
            const data=await response.json();
            setsumData(data);
        }
        getData();
    },[]);
    return(
        <div className="summaryCard">
            <h3>Summary</h3>
            <p>Total expenses of the month:{sumData.totalExpenses}</p>
            <p>Average daily expenditure:{sumData.averageDailyExpenditure}</p>
            <p>Highest single day expenditure:{sumData.highestSingleDayExpenditure}</p>
        </div>
    )
}

function RecentTransactions(){
    const [transacactions,settransactions]=useState([]);
    useEffect(()=>{
        async function getData(){
            const reponse =await fetch("http://localhost:5000/recenttransactions");
            const data =await response.json();
            settransactions(data);
        }
        getData();
    },[])
    return(
        <div className="recentTransactions">
            <h3>Recent Transactions</h3>
            {
                transacactions.map((t)=>(
                    <div key={t.id} className="transactionItem">
                        <p>{t.date}: {t.category} - Rs{t.amount}</p>
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
            const response=await fetch("http://localhost:5000/topcategories");
            const data=await response.json();
            setcatData(data);
        }
        getData();
    },[]);
    return(
        <div className="topCategories">
            <h3>Top Spending Categories</h3>
            {
                catData.map((c)=>(
                    <div key={c.id} className="categoryItem">
                        <p>{c.category}: Rs{c.total}</p>
                    </div>
                ))
    }
        </div>
    )
}

function Dashboard(){
    return(
        <div className="dashboard">
            <SummaryCard/>
            <RecentTransactions/>
            <TopCategories/>
        </div>
    )
}
export default Dashboard;