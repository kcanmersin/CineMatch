import Navbar from "./Navbar"
import MovieCard from "./MovieCard"


export default function WatchListPage() {

    return (
        <div className="watchlist-page-container">
            <Navbar/>
            <h1>WATCHLIST BY CAN30</h1>

            <div className="watchlist-movies-list">
                <MovieCard />
                <MovieCard />
                <MovieCard />
                <MovieCard />
                <MovieCard />
                <MovieCard />
                <MovieCard />
                <MovieCard />
                <MovieCard />
                <MovieCard />
                <MovieCard />
                <MovieCard />
            </div>
            


        </div>

    )
}