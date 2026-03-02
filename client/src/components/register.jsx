import { useState } from "react";
import axios from 'axios';
// import './Auth.css';
function Register({onSuccess}){
  const [email, setEmail] = useState('');
  const [username,setUsername]=useState('');
  const [password,setPassword]=useState('');
  const [message,setmessage]=useState('');
  const handleRegister=async(e)=>{
    e.preventDefault();
    try{
      const response=await axios.post('http://localhost:5000/register',{
        email,username,password
      });
      setmessage(response.data.message);
      onSuccess();
    }
    catch(error){
      setmessage(error.response?.data?.message ||'Error');
    }
  }
  return <div className="auth-container">
    <div className="auth-card">
        {/* <h2>Register</h2> */}
        <form onSubmit={handleRegister}>
          <input type="text" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          <input type="text" placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)} required />
          <input type="password" placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
          <button type="submit">Sign up</button>
        </form>
    </div>
    
    {message && <p>{message}</p>}
  </div>
}
export default Register;