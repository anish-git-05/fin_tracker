import {useState} from "react"

function Navbar(){
    return(
        <nav className="navbar">
            <div id="home">
                Home
            </div>
            <div id="navRight">
                <a href="/dashboard">Dashboard</a>
                <a href="/profile">Profile</a>
            </div>
        </nav>
    )
}

function Sidebar(){
    return(
        <nav className="sidebar">
            <div>
                <a href="/visual">Expenditure visualization</a>
            </div>
        </nav>
    );
}

export default Navbar;
// export default Sidebar;