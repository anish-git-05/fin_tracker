import {useState,useEffect} from 'react';
import "../style/profile.css";
import {API_URL} from "../api.js";
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
            if (!response.ok) {
                localStorage.removeItem('token'); 
                window.location.href = '/login';  
                return;
            }
            const data=await response.json();
            setUser(data);
        }
        getData();
    },[]);
    return(
        <div className="userDetails">
            <img 
                className="pp" 
                src={user.username ? `https://ui-avatars.com/api/?name=${user.username}&background=6366F1&color=fff&size=128` : "https://ui-avatars.com/api/?name=User"} 
                alt="User Logo" 
            />
            <p>Name:{user.username}</p>
            <p>Email:{user.email}</p>
        </div>
    )
}

function Logout(){
    let handleLogout=()=>{
        localStorage.removeItem("token");
        window.location.href = '/';
    }
    return(
        <div >
            <button className='log' onClick={handleLogout}>Logout</button>
        </div>
    )
}

function Profile(){
    return(
        <div className="profile">
            <div className='pc' >
                <h2 style={{color:'black'}}>Profile</h2>
                <div className="user-detail">
                    <UserDetails/>
                </div>
                <div className="logout">
                    <Logout/>
                </div> 
                
            </div>
        </div>
        
    )
}

export default Profile;
