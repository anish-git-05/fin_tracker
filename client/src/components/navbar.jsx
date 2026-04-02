import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

// 1. Receive 'toggle' as a prop
function Navbar({ toggle }){
    const token = localStorage.getItem("token");
    let loggedIn = !!token;
    const location = useLocation();
    const [side, setside] = useState(false);
    const [cl, setcl] = useState(false);
    
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
                    location.pathname !== "/" &&(
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
                        {/* 2. Pass 'toggle' down to the Sidebar */}
                        <Sidebar closeMenu={closeSidebar} toggle={toggle} />
                    </div>
                </>
            )}
        </>
    )
}

// 3. Receive BOTH 'closeMenu' and 'toggle' as props
function Sidebar({ closeMenu, toggle }){
    const token = localStorage.getItem("token");
    const loggedIn = !!token;
    
    const handleClick = (e) => {
        if(!loggedIn){
            e.preventDefault();
            alert("Please login to access this feature");
        }
        else if(closeMenu) closeMenu();
    }

    
    const handleChatClick = (e) => {
        e.preventDefault();
        if(!loggedIn){
            alert("Please login to access this feature");
            return;
        }
        if(toggle) toggle(); 
        if(closeMenu) closeMenu(); 
    }

    return(
        <nav className="sidebar">
                <Link to="/add" onClick={handleClick}>Add Transaction</Link>
                <Link to="/visual" onClick={handleClick}>Visualisation</Link>
                <Link to="/predict" onClick={handleClick}>Expense predictor</Link>
                
                {/* 5. Change this link to use the new handleChatClick */}
                <Link to="#" onClick={handleChatClick}>Ask Questions</Link>
                
                <Link to="/about">About FinTrack</Link>
        </nav>
    );
}

export { Navbar, Sidebar };