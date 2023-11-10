import godfather from "../assets/godfather.jpg"

export default function ListCard() {

    /*let lists = [
        {
            src : godfather,
            title : "Godfathers",
            movie_count : 3,
            total_time : "6 hr 30 min"
        },
        {
            src : godfather,
            title : "Godfathers",
            movie_count : 3,
            total_time : "6 hr 30 min"
        },
        {
            src : godfather,
            title : "Godfathers",
            movie_count : 3,
            total_time : "6 hr 30 min"
        },
        {
            src : godfather,
            title : "Godfathers",
            movie_count : 3,
            total_time : "6 hr 30 min"
        },
    ]
*/

    return(
        <div className="list-card">
            <div className="list-image">
                <img src={godfather} alt="godfather" />
            </div>

            <div className="list-details">
                <h1>Godfathers</h1>
                <p>3 Movies</p>
                <p>Total time of watch : 6 hr 30 min</p>
            </div>

        </div>
    )
}