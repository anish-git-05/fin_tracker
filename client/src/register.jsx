import { useState } from "react";

function Register(){
  const [data,setData]=useState({
    name:"",
    password:""
  });
  const handleSubmit=async (e)=>{
    e.preventDefault();
    try{
      const response=await fetch("http://localhost:5000/register",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
      })
      const resData=await response.json();
      console.log(resData);
    }catch(error){
      console.error("Error:",error);
    }
  }
  return(
    <div className="regDetails">
      <h3>Register</h3>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={data.name} onChange={(e)=>setData({...data,name:e.target.value})}></input>
        <input type="password" placeholder="Create password" value={data.password} onChange={(e)=>setData({...data,password:e.target.value})}></input>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}
export default Register;