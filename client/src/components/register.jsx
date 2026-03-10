import { useState } from "react";
import "../style/auth.css"
function Register(){
  const [email, setEmail] = useState('');
  const [username,setUsername]=useState('');
  const [password,setPassword]=useState('');
  const [message,setmessage]=useState('');
  const handleRegister=async(e)=>{
    e.preventDefault();
    try{
      const response=await fetch('http://localhost:5000/register',{
        method:"POST",
        headers:{
          "content-type":"application/json"
        },
        body:JSON.stringify({email,username,password})
      });
      const data=await response.json();
            if(!response.ok){
                setmessage(data.message || "Register failed");
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
  return <div className="auth-container">
    <div className="auth-card">
        
        <form onSubmit={handleRegister}>
          <h2>Register</h2>
          <input type="text" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          <input type="text" placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
          <button type="submit">Sign up</button>
        </form>
    </div>
    
    {message && <p>{message}</p>}
  </div>
}
export default Register;