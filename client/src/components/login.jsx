import { useState } from "react";
import axios from 'axios';
// import './Auth.css';
function Login({onSuccess,setlogin}){
    const [email, setEmail] = useState('');
    const [password,setPassword]=useState('');
    const [message,setmessage]=useState('');
   
    const handleLogin=async(e)=>{
        e.preventDefault()
        try{
            const response=await axios.post("http://localhost:5000/login",{
                email,password
            });
            setmessage(response.data.message);
            if(response.data.access_token){
                localStorage.setItem('token',response.data.access_token)
                setlogin(true);
                onSuccess();
            }
        }catch(error){
            setmessage(error.response?.data?.message ||'Error');
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