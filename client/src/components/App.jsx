import {BrowserRouter,Routes,Route} from "react-router-dom";
import Home from "./home.jsx"
import Login from "./login.jsx"
import Register from "./register.jsx"
import {Navbar} from "./navbar"
import VisualPage from "./Visual.jsx"
import Dashboard from "./Dashboard.jsx"
import Profile from "./Profile.jsx"
import "../style/App.css"
function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/register" element={<Register/>}></Route>
        <Route path="/visual" element={<VisualPage/>}></Route>
        <Route path="/dashboard" element={<Dashboard/>}></Route>
        <Route path="/profile" element={<Profile/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
