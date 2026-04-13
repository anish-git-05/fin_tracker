import { useState, useEffect } from "react";
import { API_URL } from "../api.js";
import "../style/Add.css";

function AddTransaction() {
    const [categories, setcategories] = useState([]);
    
    useEffect(() => {
        async function getData() {
            const response = await fetch(`${API_URL}/categories`);
            const data = await response.json();
            setcategories(data);
        }
        getData();
    }, []);

    const [transaction, setTransaction] = useState({
        amount: "",
        category_id: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        let token = localStorage.getItem("token");
        
        const response = await fetch(`${API_URL}/addtransactions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                amount: transaction.amount,
                category_id: transaction.category_id
            })
        });
        
        const data = await response.json();
        if (response.ok) {
            alert("Transaction added successfully");
            setTransaction({ amount: "", category_id: "" });
        } else {
            alert(data.message || "Failed to add transaction");
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
                <button type="submit">Add</button>
            </form>
        </div>
    );
}

export default AddTransaction;