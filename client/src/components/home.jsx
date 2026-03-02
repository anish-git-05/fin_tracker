import "../style/home.css";
import {Sidebar} from "./navbar"
import homeImg from "../assets/Image_home.svg"
function Home(){
    return(
    <div className="home_page">
      <div className="home_content">
        <Sidebar/>
        <div className="main_area">
          <img src={homeImg} className="homeImage"></img>
          <div className="text_box">
            <h1>Welcome to FinTracker!</h1>
            <h2>Your personal visual finance tool</h2>
          </div>
        </div>
      </div>
    </div>
    )
}

export default Home ;