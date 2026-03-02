function Navbar(){
    return(
        <nav className="navbar">
            <div id="navLeft">
                <a href="/home">Home</a>
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
                <a href="/visual">Visualisation</a>
                <a href="/predict">Expense predictor</a>
                <a href="rank">Your rankings</a>
                <a href="/about">About FinTrack</a>
        </nav>
    );
}

export {Navbar};
export {Sidebar};