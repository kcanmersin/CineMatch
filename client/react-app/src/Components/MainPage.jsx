import { Link } from "react-router-dom";

export default function MainPage(){

    return(
        <>
        <h1>Main Page</h1>
        <Link to= "/moviepagegodfather">Godfather</Link>
        <Link to= "/movielist">WatchList</Link>
        </>
    )
}