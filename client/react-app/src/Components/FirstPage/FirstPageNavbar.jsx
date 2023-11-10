import { Link } from "react-router-dom"

export default function FirstPageNavbar(){
    return (
        <div className = "first-page-navbar-container">
            <div>
                Logo
            </div>
            <div className="button-container">
                <Link to="/signin"><button className="sign-button">Sign In</button></Link>
                <Link to="/signup"><button className="sign-button">Sign Up</button></Link>
                
            </div>
        </div>
    )
}