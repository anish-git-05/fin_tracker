import {BrowserRouter,Routes,Route} from "react-router-dom";
import Home from "./home.jsx"
import Login from "./login.jsx"
import Register from "./register.jsx"
import {Navbar} from "./navbar"
import VisualPage from "./Visual.jsx"
import Dashboard from "./Dashboard.jsx"
import Profile from "./Profile.jsx"
import Predict from "./Predict.jsx"
import AddTransaction from "./Add.jsx"
import { About, Footer } from "./About";
import "../style/App.css"
import Chatbot from "./Chatbot.jsx";
import { useState } from "react";
function App() {
  const [open,setopen] = useState(false);
  
  const toggle = () => {
      setopen(!open);
  };
  return (
    <BrowserRouter>
    
      {/* <Navbar/> */}
      <Navbar toggle={toggle} />
      <Chatbot open={open} toggle={toggle} />
      <Routes>
        <Route path="/" element={<Home toggle={toggle} />}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/register" element={<Register/>}></Route>
        <Route path="/visual" element={<VisualPage/>}></Route>
        <Route path="/dashboard" element={<Dashboard/>}></Route>
        <Route path="/profile" element={<Profile/>}></Route>
        <Route path="/predict" element={<Predict/>}></Route>
        <Route path="/about" element={<About />} />
        <Route path="/add" element={<AddTransaction />} />
        {/* <Route path="/chat" element={<Chatbot />} /> */}
      </Routes>
      <Footer />
    </BrowserRouter>
    
  );
}
export default App;
