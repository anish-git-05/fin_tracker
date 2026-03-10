import {BrowserRouter,Routes,Route} from "react-router-dom";
import Home from "./home.jsx"
import Login from "./login.jsx"
import Register from "./register.jsx"
import {Navbar} from "./navbar"
function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/register" element={<Register/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;