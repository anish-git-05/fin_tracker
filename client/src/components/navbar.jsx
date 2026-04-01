import { useState } from "react";
import {Link,useLocation} from "react-router-dom";
function Navbar(){
    const token=localStorage.getItem("token");
    let loggedIn=!!token;
    const location =useLocation();
    const [side,setside]=useState(false);
    const [cl,setcl]=useState(false);
    const closeSidebar = () => {
        setcl(true);
        setTimeout(() => {
            setside(false);
            setcl(false);
        }, 300); 
    };

    return(
        <>
        <nav className="navbar">
            <div id="navLeft">
                {
                    location.pathname!=="/" &&(
                        <div style={{display:'flex'}}>
                        <div className="hamburger-icon" onClick={() => setside(true)}>
                            ☰
                        </div>
                        <Link to="/">Home</Link>
                        </div>
                    )
                }
                
            </div>
            <div id="navRight">
                 {!loggedIn &&(
                    <>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>    
                    </>
                )}
                {loggedIn &&(
                    <>
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/profile">Profile</Link>
                    </>
                )}
            </div>

        </nav>
        {location.pathname !== "/" && side && (
                <>
                    <div 
                        className={`sidebar-backdrop ${cl ? 'closing' : ''}`} 
                        onClick={closeSidebar}
                    ></div>
                    
                    <div className={`sidebar-offcanvas ${cl ? 'closing' : ''}`}>
                        <button className="close-sidebar-btn" onClick={closeSidebar}>×</button>
                        <Sidebar closeMenu={closeSidebar} />
                    </div>
                </>
            )}
        </>
    )
}

function Sidebar(){
    const token=localStorage.getItem("token");
    const loggedIn=!!token;
    const handleClick=(e)=>{
        if(!loggedIn){
            e.preventDefault();
            alert("Please login to access this feature");
        }
        else if(closeMenu)closeMenu();
    }
    return(
        <nav className="sidebar">
                <Link to="/add" onClick={handleClick}>Add Transaction</Link>
                <Link to="/visual" onClick={handleClick}>Visualisation</Link>
                <Link to="/predict" onClick={handleClick}>Expense predictor</Link>
                <Link to="/about">About FinTrack</Link>
        </nav>
    );
}


export {Navbar};
export {Sidebar};
