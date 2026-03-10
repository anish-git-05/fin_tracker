import {useState,useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {API_URL} from "./api.js";
function UserDetails(){
    const [user,setUser]=useState({});
    useEffect(()=>{
        async function getData(){
            const token=localStorage.getItem('token');
            const response=await fetch(`${API_URL}/profile`,{
                    headers:{
                        "Authorization":`Bearer ${token}`
                    }
                }
            )
            const data=await response.json();
            setUser(data);
        }
        getData();
    },[]);
    return(
        <div className="userDetails">
            <p>UserName:{user.name}</p>
            <p>Email:{user.email}</p>
        </div>
    )
}

function Logout(){
    const navigate=useNavigate();
    let handleLogout=()=>{
        localStorage.removeItem("token");
        navigate("/login");
    }
    return(
        <div className='logout'>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}

function Profile(){
    return(
        <div className='profile' style={{backgroundColor:"whitesmoke", maxWidth:"400px",margin:"auto",padding:"16px",borderRadius:"10px"}}>
            <h2>Profile</h2>
            <UserDetails/>
            <Logout/>
        </div>
    )
}

export default Profile;
