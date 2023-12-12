import "./MyProfilePage.css"
import { Link} from "react-router-dom";
import ProgramNavbar from "./SubComponents/ProgramNavbar";
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";
import MovieCard from "./SubComponents/MovieCard";
import Row from "react-bootstrap/Row";


export default function MyProfilePage(){


    /*  ---------------------------------------------------------------------------
        --------------------------------------------------------------------------
        LAN DİYAR YAPILACAKLARI BURAYA YAZIYORUM

        -username hem aşağıda variable olarak tanımlı hem de navbar da. eğer onları
        backendde bi defa çekip bi yerde tutup oradan çekebiliyosan öyle yap
    */

    const MyProfileBgImage= "src/assets/dummy1.jpg";
    const ppLink= "src/assets/pp.jpg";
    const username="Michael Corleone";

    
    const movieCount="1071";
    const followersCount= "1453";
    const followingsCount= "1923"

    // Dummy movie data
    const movieData = [
        { id: 1, name: "Movie 1", image: "src/assets/dummyPoster.jpg", date: "2022" },
        { id: 2, name: "Modsdddsdasdasda dasdasd dasdddddfsdvie 2", image: "src/assets/dummyPoster.jpg", date: "2021" },
        { id: 3, name: "Movie 3", image: "src/assets/dummyPoster.jpg", date: "2020" },
        { id: 3, name: "Movie 3", image: "src/assets/dummyPoster.jpg", date: "2020" },
        { id: 3, name: "Movie 3", image: "src/assets/dummyPoster.jpg", date: "2020" },
        { id: 3, name: "Movie 3", image: "src/assets/dummyPoster.jpg", date: "2020" },
        { id: 3, name: "Movie 3", image: "src/assets/dummyPoster.jpg", date: "2020" },
        { id: 3, name: "Movie 3", image: "src/assets/dummyPoster.jpg", date: "2020" },
        { id: 3, name: "Movie 3", image: "src/assets/dummyPoster.jpg", date: "2020" },
        { id: 3, name: "Movie 3", image: "src/assets/dummyPoster.jpg", date: "2020" },
    ];



    return(
        <div className="main-page">
            <ProgramNavbar/>
            <div className="profile-page-content"
              style={{
              backgroundImage: `linear-gradient(0deg, rgba(10, 20, 33, 0.4) 0%, rgba(10, 20, 33, 0.4) 100%), linear-gradient(0deg, #0A1421 0%, rgba(0, 0, 0, 0.00) 100%), url(${MyProfileBgImage})`,
              backgroundPosition: 'center center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
                }}>
                <div className= "user-profile">
                    <img
                        className="user-profile-image"
                        src={ppLink}
                    />
                    <div className="user-name">{username}</div>
                </div>
                <div className="follow-stats">
                    <div><span style={{fontWeight: 'bold'}}>{movieCount}</span> MOVIES</div>
                    <div><span style={{fontWeight: 'bold'}}>{followersCount}</span> FOLLOWERS</div>
                    <div><span style={{fontWeight: 'bold'}}>{followingsCount}</span> FOLLOWINGS</div>
                </div>
            </div>
            <div className="rest-myprofile-page">
                <div className="profile-buttons-container">
                    <Button variant="success profile-button">LISTS</Button>
                    <Button variant="success profile-button">STATS</Button>
                </div>
                <div className= "watched-movies">
                    <div className="watched-movies-text">
                        WATCHED MOVIES
                    </div>
                    <Container className="watched-movies-card-container">
                        <Row>
                            {movieData.map((movie) => (
                                <MovieCard key={movie.id} {...movie} />
                            ))}
                        </Row>
                    </Container>
                </div>
            </div>
        </div>
    )
}