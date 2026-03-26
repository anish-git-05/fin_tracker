import { useState } from "react";
import "../style/auth.css"
import {API_URL} from "../api.js";
import { Link } from "react-router-dom";
function Login(){
    const [email, setEmail] = useState('');
    const [password,setPassword]=useState('');
    const [message,setmessage]=useState('');
    const [loading, setloading] = useState(false);
    const handleLogin=async(e)=>{
        e.preventDefault()
        setloading(true);
        try{
            const response=await fetch(`${API_URL}/login`,{
                method:"POST",
                headers:{
                    "content-type":"application/json"
                },
                body:JSON.stringify({email,password})
            });
            const data=await response.json();
            if(!response.ok){
                setmessage(data.message || "Login failed");
                return;
            }
            setmessage(data.message);
            if(data.access_token){
                localStorage.setItem('token',data.access_token)
                window.location.href = '/';
            }
        }catch(error){
            setmessage("Network error");
        }
        finally{
            setloading(false)
        }
    }
    return(
        <div className="auth-container">
            <div className="auth-card">
                <form onSubmit={handleLogin}>
                    <h2 style={{color:"white"}}>Login</h2>
                    <input type="text" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
                    <button type="submit" disabled={loading}>
                        {loading ? <div className="spinner"></div> : "Login"}
                    </button>
                </form>
                {message && <p>{message}</p>}
                <p style={{ color: "white", textAlign: "center", marginTop: "15px" }}>
                    New to FinTracker? <Link to="/register" style={{ color: "#4da6ff" }}>Register now</Link>
                </p>
            </div>
            
        </div>
    )
}
export default Login;
