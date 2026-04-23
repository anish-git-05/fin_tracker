import { useState, useEffect } from 'react';
import "../style/profile.css";
import { API_URL } from "../api.js";

function UserDetails() {
    const [user, setUser] = useState({});
    useEffect(() => {
        async function getData() {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/profile`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!response.ok) {
                localStorage.removeItem('token');
                window.location.href = '/login';
                return;
            }
            const data = await response.json();
            setUser(data);
        }
        getData();
    }, []);
    return (
        <div className="userDetails">
            <img
                className="pp"
                src={user.username ? `https://ui-avatars.com/api/?name=${user.username}&background=6366F1&color=fff&size=128` : "https://ui-avatars.com/api/?name=User"}
                alt="User Logo"
            />
            <p>Name: {user.username}</p>
            <p>Email: {user.email}</p>
        </div>
    )
}

function Logout() {
    let handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = '/';
    }
    return (
        <div>
            <button className='log' onClick={handleLogout}>Logout</button>
        </div>
    )
}

function DeleteAccount() {
    const [showWarning, setShowWarning] = useState(false);

    const handleDelete = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${API_URL}/delete-account`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                localStorage.removeItem("token");
                window.location.href = '/'; // Redirect to home/login after deletion
            } else {
                alert("Failed to delete account. Please try again.");
            }
        } catch (err) {
            console.error("Error deleting account:", err);
        }
    };

    return (
        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
            <span
                onClick={() => setShowWarning(true)}
                style={{ color: '#ef4444', cursor: 'pointer', fontSize: '14px', textDecoration: 'underline' }}
            >
                Delete Account
            </span>

            {showWarning && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex',
                    justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: '#161b22', padding: '30px',
                        borderRadius: '10px', textAlign: 'center', maxWidth: '400px',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <h3 style={{ color: '#ef4444', marginTop: 0 }}>Are you sure?</h3>
                        <p style={{ color: '#a0aabf', marginBottom: '25px', fontSize: '15px' }}>
                            Your data will be deleted permanently. This action cannot be undone.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-around', gap: '15px' }}>
                            <button
                                onClick={handleDelete}
                                style={{ flex: 1, backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setShowWarning(false)}
                                style={{ flex: 1, backgroundColor: '#30363d', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function Profile() {
    return (
        <div className="profile">
            <div className='pc'>
                <h2 style={{ color: 'black' }}>Profile</h2>
                <div className="user-detail">
                    <UserDetails />
                </div>
                <div className="logout">
                    <Logout />
                </div>

                {/* Added Delete Account Section Here */}
                <DeleteAccount />
                
            </div>
        </div>
    )
}

export default Profile;