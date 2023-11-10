import logo from "../assets/logo.jpg"
import avatar from "../assets/avatar.jpg"
import compassIcon from "../assets/compass.svg"

export default function Navbar() {
    return (

        <nav className="navbar-container">
            <div className="navbar-logo">
                <img src={logo} alt="Logo" />
            </div>
            
            <div className="navbar-search">
                <input type="text" placeholder="Search for a movie... " />
                <button>
                    <img src={compassIcon} alt="compass" />
                </button>
            </div>
            
            <div className="navbar-user">
                <div className="user-avatar">
                    <img src={avatar} alt="User Avatar" />
                </div>
            </div>
        </nav>
        
    )
}