import "./MainPage.css"
import { Link } from "react-router-dom";
import ProgramNavbar from "./SubComponents/ProgramNavbar";

export default function MainPage(){

    return(
        <div className="main-page">
        <ProgramNavbar/>
        <h1>Main Page</h1>
        <Link to= "/moviepagegodfather">Godfather</Link>
        <Link to= "/movielist">WatchList</Link>
        </div>
    )
}