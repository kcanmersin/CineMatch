
import godfather from "../assets/godfather.jpg"
// watchlist movie card

export default function MovieCard() {
    return(
        <div className="watchlist-movie-card">
            <img src={godfather} alt="" />
            <p>The Godfather(1972)</p>
        </div>
    )
}