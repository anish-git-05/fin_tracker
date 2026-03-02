import {Link} from "react-router-dom";
function Navbar(){
    return(
        <nav className="navbar">
            <div id="navLeft">
                <Link to="/">Home</Link>
            </div>
            <div id="navRight">
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/profile">Profile</Link>
            </div>
        </nav>
    )
}

function Sidebar(){
    return(
        <nav className="sidebar">
                <a href="/visual">Visualisation</a>
                <a href="/predict">Expense predictor</a>
                <a href="rank">Your rankings</a>
                <a href="/about">About FinTrack</a>
        </nav>
    );
}


export {Navbar};
export {Sidebar};
