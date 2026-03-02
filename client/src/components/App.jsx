import Register from "./register";
import Login from "./login";
import {Image} from "./home";
import {Navbar} from "./navbar";
import { Sidebar } from "./navbar";
import "../style/home.css";
import { useState,useEffect} from "react";
function App() {
  const [model,setmodel]=useState(null);
  const [login,setlogin]=useState(false);
  useEffect(()=>{
        const token=localStorage.getItem('token');
        if(token)setlogin(true);

    },[]);

  const close=()=>setmodel(null);
  return (
    <div className="home_page">
      <Navbar setModel={setmodel} login={login} setlogin={setlogin}/>
      <div className="home_content">
        <Sidebar/>
        <div className="main_area">
          <Image/>
          <div className="text_box">
            <h1>Welcome to FinTracker!</h1>
            <h2>Your personal visual finance tool</h2>
          </div>
        </div>
      </div>
    {
      model &&(
        <div className="modal-overlay" onClick={close}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={close}>&times;</button>
            
              {model==='login' &&(
                <Login onSuccess={close} setlogin={setlogin}/>
              )}
              {model==='register' &&(
                <Register onSuccess={close}/>
              )}
    
          </div>
        </div>
      )
    }
    </div>
  );
}

export default App;