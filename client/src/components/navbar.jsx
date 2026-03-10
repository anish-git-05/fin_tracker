import {Link} from "react-router-dom";
function Navbar(){
    const token=localStorage.getItem("token");
    let loggedIn=!!token;
    return(
        <nav className="navbar">
            <div id="navLeft">
                <Link to="/">Home</Link>
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
    }
    return(
        <nav className="sidebar">
                <Link to="/visual" onClick={handleClick}>Visualisation</Link>
                <Link to="/predict" onClick={handleClick}>Expense predictor</Link>
                <Link to="/about">About FinTrack</Link>
        </nav>
    );
}


export {Navbar};
export {Sidebar};
