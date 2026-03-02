

function Navbar({setModel,login,setlogin}){
    
    
    const handlelogout=()=>{
        localStorage.removeItem('token');
        setlogin(false);
        window.location.href="/";
    };


    return(
        <nav className="navbar">
            <div id="navLeft">
                <a href="/home">Home</a>
            </div>
            <div id="navRight">
                {
                    login?(<>
                            <a href="/dashboard">Dashboard</a>
                            <a href="/profile">Profile</a>
                            <a href="/logout" onClick={handlelogout}>Logout</a>
                        </>
                    ):(
                        <>
                            <a href="#" onClick={(e)=>{e.preventDefault();setModel('login')}}>Login</a>
                            <a href="#" onClick={(e)=>{e.preventDefault();setModel('register')}}>Register</a>
                        </>
                    )
                }
                
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
