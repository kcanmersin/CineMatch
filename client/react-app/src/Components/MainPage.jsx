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
    const [matchedPeople, setMatchedPeople] = useState([]);
    const jwtAccess = localStorage.getItem("jwtAccess");
    const [bestMatchMovie, setBestMatchMovie] = useState(null);
    const [mostPopular, setMostPopular] = useState([]);
    const [bestRated, setBestRated] = useState([]);
    const [forYou, setForYou] = useState([]);



    // Function to fetch "best rate" movies from the "movie/best-rated" endpoint
    const fetchBestRatedMovies = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}movie/lists/16/`, {
                method: 'GET',
                headers: {
                    'Authorization': `JWT ${jwtAccess}`, // Replace 'jwtAccess' with your JWT token variable
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                // If the response is not 2xx, throw an error
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const movies = await response.json(); // Assuming the response is an array of movies
            setBestRated(movies.movies);
        } catch (error) {
            console.error('Error fetching For You movies:', error);

        }
    };


    // Function to fetch "most popular" movies from the "movie/most-popular" endpoint
    const fetchMostPopularMovies = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}movie/lists/17/`, {
                method: 'GET',
                headers: {
                    'Authorization': `JWT ${jwtAccess}`, // Replace 'jwtAccess' with your JWT token variable
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                // If the response is not 2xx, throw an error
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const movies = await response.json(); // Assuming the response is an array of movies
            setMostPopular(movies.movies);
        } catch (error) {
            console.error('Error fetching For You movies:', error);
        }
    };

    // Function to fetch "For You" movies from the "movie/for-you" endpoint
    const fetchForYouMovies = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}movie/movie/for-you/`, {
                method: 'GET',
                headers: {
                    'Authorization': `JWT ${jwtAccess}`, // Replace 'jwtAccess' with your JWT token variable
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                // If the response is not 2xx, throw an error
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const movies = await response.json(); // Assuming the response is an array of movies
            setForYou(movies);
            if (movies.length > 0) {
                setBestMatchMovie(movies[0]); // Set the first movie as the best match
            }
        } catch (error) {
            console.error('Error fetching For You movies:', error);
        }
    };

    // useEffect hook to call the all functions when the component mounts
    useEffect(() => {
        fetchMostPopularMovies();
        fetchBestRatedMovies();
        fetchForYouMovies();
        fetchMatchedPeople();
        
    }, []);

    
    // Function to fetch matched people
    const fetchMatchedPeople = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}accounts/matched-people/`, {
                method: 'GET',
                headers: {
                    'Authorization': `JWT ${jwtAccess}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (response.ok) {
                setMatchedPeople(data.best_matched_people);
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error:', error);
        } 
    };


    return(
        <div className="main-page">
            <ProgramNavbar/>
            <div className="best-match-movie">
                    {bestMatchMovie ? (
                        <>
                        <Link to={`/moviepage/${bestMatchMovie.id}`}>
                        <div className="best-match-movie">
                        <div className="best-match-movie-poster">
                            <img
                            src={"https://image.tmdb.org/t/p/original" + bestMatchMovie.poster_path}
                            alt="First Image"
                            className="best-match-movie-poster-image"
                            />
                        </div>
                        <div
                            className="best-match-movie-scene"
                            style={{
                            backgroundImage: `linear-gradient(0deg, #0A1421 12.5%, rgba(0, 0, 0, 0.00) 100%),url(${"https://image.tmdb.org/t/p/original" + bestMatchMovie.background_path})`,
                            backgroundPosition: 'center center',
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                            }}
                        >
                            <div className="descriptive-text">
                            <div className="best-match-text">BEST MATCH</div>
                            <div className="best-match-movie-name">
                                {bestMatchMovie.title
                                    .split(' ')
                                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                    .join(' ')} ({bestMatchMovie.release_date})
                            </div>
                            <div className="best-match-movie-desc">{bestMatchMovie.description}</div>
                            </div>
                            <div className="best-match-movie-points">
                            <span className="true-points">{parseFloat(bestMatchMovie.vote_average).toFixed(1)}/10</span>
                            </div>
                            <div className="star"><SVGStar /></div>
                        </div>
                        </div>
                        </Link>
                        </>
                    ) : (
                        // Render a loading message or placeholder when bestMatchMovie is null
                        <div>Loading best match movie...</div>
                    )}
            </div>         
                    
            <Container className="rest-of-the-page">
                <Row className="main-page-list">
                    <div className="main-page-list-text">
                        Most Popular
                    </div>
                    <Container className="movie-cards-container">
                            <div className="movie-cards">
                                {Array.isArray(mostPopular) && mostPopular.map(movie => (
                                    // Your render logic here
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
                                {Array.isArray(bestRated) && bestRated.map(movie => (
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