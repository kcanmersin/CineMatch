import { Link } from "react-router-dom"

export default function Navbar(){
    return (
        <div className = "navbar-container">
            <div>
                Logo
            </div>
            <div className="button-container">
                <button className="sign-button">Sign In</button>
                <Link to="/signup"><button className="sign-button">Sign Up</button></Link>
                
            </div>
        </div>
    )
}