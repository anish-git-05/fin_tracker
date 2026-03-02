import { useState } from "react";

function Login(){
    const [data,setData]=useState({
        name:"",
        password:""
    })
    const handleSubmit=async(e)=>{
        e.preventDefault()
        try{
            const response=await fetch("http://localhost:5000/login",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(data)
            })
        }catch(error){
            console.log("Error in login",error);
        }
        const responseData=await response.json();
        console.log(responseData);
    }
    const handleInput=(e)=>{
        const{name,value}=e.target;
        setData((prevData)=>({
            ...prevData,
            [name]:value
        }));
    };
    return(
        <div className="login">
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" name="name" value={data.name} onChange={handleInput}></input>
                <input type="text" placeholder="Username" name="password" value={data.password} onChange={handleInput}></input>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}
export default Login;