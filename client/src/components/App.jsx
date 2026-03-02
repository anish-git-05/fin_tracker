import Register from "./register";
import {Image} from "./home";
import {Navbar} from "./navbar";
import { Sidebar } from "./navbar";
import "../style/home.css";
function App() {
  return (
    <div className="home_page">
      <Navbar/>
      <div className="home_content">
        <Sidebar/>
        <div className="main_area">
          <Image/>
          <div className="text_box">
            <h1>Welcome to FinTracker!</h1>
            <h2>Your personal visual finance tool</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;