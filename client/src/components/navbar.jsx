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
                <Link to="/visual">Visualisation</Link>
                <Link to="/predict">Expense predictor</Link>
                <Link to="/rank">Your rankings</Link>
                <Link to="/about">About FinTrack</Link>
        </nav>
    );
}


export {Navbar};
export {Sidebar};
