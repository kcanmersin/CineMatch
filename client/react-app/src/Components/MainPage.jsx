import "./MainPage.css"
import  { useContext } from 'react';
import { Link} from "react-router-dom";
import ProgramNavbar from "./SubComponents/ProgramNavbar";
import { AuthContext } from "../auth/AuthContext";

export default function MainPage(){

    const { logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
    };

   

    return(
        <div className="main-page">
            <ProgramNavbar/>
            <h1>Main Page</h1>
            <Link to= "/moviepagegodfather">Godfather</Link>
            <Link to= "/movielist">WatchList</Link>
            <button onClick={handleLogout}>Logout</button>
            <Link to="/mylist">WatchList</Link>
        </div>
    )
}