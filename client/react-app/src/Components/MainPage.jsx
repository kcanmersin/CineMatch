import "./MainPage.css"
import { useState, useEffect } from "react";
import { Link} from "react-router-dom";
import ProgramNavbar from "./SubComponents/ProgramNavbar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import SVGStar from "./SubComponents/SVGStar";
import MovieCard from "./SubComponents/MovieCard";
import UserCard from "./SubComponents/UserCard";


export default function MainPage(){
    // TODO: add matched people 
    const [matchedPeople, setMatchedPeople] = useState([]);
    const [data, setData] = useState([]); // Initialize with an empty array or an appropriate initial value
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const jwtAccess = localStorage.getItem("jwtAccess");
    //const [moviesData, setMoviesData] = useState([]);
    const [mostPopular, setMostPopular] = useState([]);
    const [bestRated, setBestRated] = useState([]);
    const [forYou, setForYou] = useState([]);

    // fetch the movie data
    const fetchMovieData = async (movieIds, setState) => {
        try {
            const movies = await Promise.all(movieIds.map(async (movieId) => {
                const response = await fetch(`http://127.0.0.1:8000/movie/movie/movies/${movieId}/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `JWT ${jwtAccess}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            }));
            setState(movies);
        } catch (error) {
            console.error('Error fetching movie data:', error);
            setError(error.toString());
        }
    };
    useEffect(() => {
        fetchMovieData([24, 11, 22, 70, 111], setMostPopular);
        fetchMovieData([15, 14, 13, 68, 69], setBestRated);
        fetchMovieData([71, 75, 76, 77, 78], setForYou);
    }, []);


    // get the matched people information
    useEffect(() => {
        fetch('http://127.0.0.1:8000/accounts/matched-people/', {
          method: 'GET',
          headers: {
            'Authorization': `JWT ${jwtAccess}`, // Replace 'jwtAccess' with your JWT token variable
            'Content-Type': 'application/json',
          },
        })
        .then(response => response.json())
        .then(data => {
          setMatchedPeople(data.best_matched_people);
        })
        .catch(error => {
          console.error('Error:', error);
          setError(error.toString());
        })
        .finally(() => {
          setIsLoading(false);
        });
      }, []);
    
    const bestMatchMoviePoster= "src/assets/dummyPoster.jpg";
    const bestMatchMovieScene= "src/assets/dummy1.jpg";
    const bestMatchMovieName= "The Shining";
    const bestMatchMovieYear= "1980";
    const bestMatchMovieDesc= "A family heads to an isolated hotel for the winter where a sinister presence influences the father into violence, while his psychic son sees horrific forebodings from both past and future.";
    const bestMatchMoivePoints= "8.8"


    return(
        <div className="main-page">
            <ProgramNavbar/>
            <div className="best-match-movie">
                <div className= "best-match-movie-poster">
                    <img
                        src={bestMatchMoviePoster}
                        alt="First Image"
                        className="best-match-movie-poster-image"
                    />
                </div>
                <div className= "best-match-movie-scene" style={{
                    backgroundImage: `linear-gradient(0deg, #0A1421 12.5%, rgba(0, 0, 0, 0.00) 100%),url(${bestMatchMovieScene})`,
                    backgroundPosition: 'center center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                }}>
                <div className= "descriptive-text">
                    <div className= "best-match-text">BEST MATCH</div>
                    <div className= "best-match-movie-name">{bestMatchMovieName} ({bestMatchMovieYear})</div>
                    {/*<Link to={`/movie/${bestMatchMovieId}`} className="best-match-movie-name-link">
                        <div className="best-match-movie-name">
                            {bestMatchMovieName} ({bestMatchMovieYear})
                        </div>
                    </Link>*/}
                    <div className= "best-match-movie-desc">{bestMatchMovieDesc}</div>
                </div>
                <div className= "best-match-movie-points"><span className="true-points">{bestMatchMoivePoints}</span>/10</div>
                <div className="star"><SVGStar/></div>
                </div>
            </div>
            <Container className="rest-of-the-page">
                <Row className="main-page-list">
                    <div className="main-page-list-text">
                        Most Popular
                    </div>
                    <Container className="movie-cards-container">
                            <div className="movie-cards">
                            {mostPopular.map(movie => (
                                <Link to={`/moviepage/${movie.id}`} key={movie.id} className="movie-card-link">
                                    <MovieCard {...movie} />
                                </Link>
                            ))}
                            
                            </div>
                    </Container>
                </Row>
                <Row className="main-page-list">
                    <div className="main-page-list-text">
                        Best Rated
                    </div>
                    <Container className="movie-cards-container">
                            <div className="movie-cards">
                            {bestRated.map(movie => (
                                <Link to={`/moviepage/${movie.id}`} key={movie.id} className="movie-card-link">
                                    <MovieCard {...movie} />
                                </Link>
                            ))}
                            </div>
                    </Container>
                </Row>
                <Row className="main-page-list">
                    <div className="main-page-list-text">
                        For You
                    </div>
                    <Container className="movie-cards-container">
                            <div className="movie-cards">
                                {forYou.map(movie => (
                                    <Link to={`/moviepage/${movie.id}`} key={movie.id} className="movie-card-link">
                                        <MovieCard {...movie} />
                                    </Link>
                                ))}
                            </div>
                    </Container>
                </Row>
                <Row className="main-page-list">
                    <div className="main-page-list-text">
                        <Link to="/matchedpeople" className="matched-people-link">
                            Matched People
                        </Link>
                    </div>
                    
                    <Container className="movie-cards-container">
                        <div className="movie-cards">
                            {matchedPeople.map((user, index) => (
                            <Link to={`/user/${user.username}`} key={`${user.id}-${index}`} className="movie-card-link">
                                <UserCard {...user} />
                            </Link>
                            ))}
                        </div>
                    </Container>

                </Row>
            </Container>
        </div>
    )
}