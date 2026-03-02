import { useState } from "react";
// import './Auth.css';
function Login(){
    const [email, setEmail] = useState('');
    const [password,setPassword]=useState('');
    const [message,setmessage]=useState('');
   
    const handleLogin=async(e)=>{
        e.preventDefault()
        try{
            const response=await fetch("http://localhost:5000/login",{
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
            }
        }catch(error){
            setmessage("Network error");
        }
    }
    return(
        <div className="auth-container">
            <div className="auth-card">
                <form onSubmit={handleLogin}>
                    <input type="text" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
                    <input type="password" placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
                    <button type="submit">Login</button>
                </form>
                {message && <p>{message}</p>}
            </div>
            
        </div>
    )
}
export default Login;