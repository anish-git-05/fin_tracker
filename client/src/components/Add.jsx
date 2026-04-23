import { useState, useEffect } from "react";
import { API_URL } from "../api.js";
import "../style/Add.css";

function AddTransaction() {
    const [categories, setcategories] = useState([]);

    const getCurrentDateTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };

    const [transaction, setTransaction] = useState({
        amount: "",
        category_id: "",
        time_details: getCurrentDateTime(),
    });

    useEffect(() => {
        async function getData() {
            try {
                const response = await fetch(`${API_URL}/categories`);
                const data = await response.json();
                setcategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        }
        getData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let token = localStorage.getItem("token");

        try {
            const response = await fetch(`${API_URL}/addtransactions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: transaction.amount,
                    category_id: transaction.category_id,
                    time_details: transaction.time_details
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                alert("Transaction added successfully");
                setTransaction({ 
                    amount: "", 
                    category_id: "", 
                    time_details: getCurrentDateTime() 
                });
            } else {
                alert(data.message || "Failed to add transaction");
            }
        } catch (error) {
            alert("Network error. Could not reach the server.");
            console.error("Submission Error:", error);
        }
    }

    return (
        <div className="addTransaction">
            <h3 style={{ marginTop: 0, color: "#1D2942", fontSize: "20px", textAlign: "center" }}>
                Add Transaction
            </h3>
            <form className="tfom" onSubmit={handleSubmit}>
                <input 
                    type="number" 
                    min="0" 
                    placeholder="Amount" 
                    value={transaction.amount} 
                    onChange={(e) => setTransaction({ ...transaction, amount: e.target.value })} 
                    required 
                />
                
                <select 
                    value={transaction.category_id} 
                    onChange={(e) => setTransaction({ ...transaction, category_id: e.target.value })} 
                    required
                >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                        <option key={c.category_id} value={c.category_id}>
                            {c.name}
                        </option>
                    ))}
                </select>

                <div style={{ position: "relative", width: "100%", display: "flex", alignItems: "center" }}>
                    <input 
                        type="datetime-local" 
                        value={transaction.time_details} 
                        max={getCurrentDateTime()} 
                        onChange={(e) => setTransaction({ ...transaction, time_details: e.target.value })} 
                        required 
                        style={{ width: "100%", paddingRight: "180px" }}
                    />
                    
                    <span style={{ 
                        position: "absolute", 
                        right: "40px",
                        color: "white", 
                        fontSize: "15px", 
                        pointerEvents: "none"
                    }}>
                        Time of transaction
                    </span>
                </div>

                <button type="submit">Add</button>
            </form>
        </div>
    );
}

export default AddTransaction;