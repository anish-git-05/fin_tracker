import { useState, useEffect, useRef } from "react";
import "../style/Chatbot.css";
import { API_URL } from "../api.js";


function Chatbot({open,toggle}){
    const [message,setmessage]=useState([{sender:"bot",text:"Hi! I am FinBot. Ask me anything about your spending this month."}]);
    const [input,setinput]=useState("")
    const [load,setload]=useState(null);
    const ref=useRef(null);
    useEffect(()=>{
        ref.current?.scrollIntoView({behavior:"smooth"});
    },[message])
    const send=async(e)=>{
        e.preventDefault();
        if(!input.trim())return;
    
    const text=input;
    setinput("");
    setmessage((prev)=>[...prev,{sender:"user",text:text}]);
    setload(true);
    try{
        const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ message: text })
            });
            const data =await response.json();
        if(response.ok){
            setmessage((prev) => [...prev, { sender: "bot", text: data.reply }]);
        } 
        else{
            setmessage((prev) => [...prev, { sender:"bot", text: "Error: " + (data.message || "Could not connect.") }]);
        }
    }
    catch(err){
        setmessage((prev) => [...prev, { sender: "bot", text: "Network error.?" }]);
    }
    finally {
            setload(false);
    }
}
return(
    <div className={`chat-drawer ${open ? "open" : ""}`}>
            <div className="chat-header">
                <h3>🤖 FinBot AI</h3>
                <button className="close-btn" onClick={toggle}>&times;</button>
            </div>
            
            <div className="chat-body">
                {message.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        {msg.text}
                    </div>
                ))}
                
                {load && (
                    <div className="typing-indicator">FinBot is analyzing...</div>
                )}
                <div ref={ref} />
            </div>

            <form className="chat-footer" onSubmit={send}>
                <input 
                    type="text" 
                    className="chat-input"
                    placeholder="Ask about your finances..." 
                    value={input}
                    onChange={(e) => setinput(e.target.value)}
                    disabled={load}
                />
                <button type="submit" className="send-btn" disabled={load || !input.trim()}>
                    {load ? "..." : "➤"}
                </button>
            </form>
        </div>
)

}
export default Chatbot;
