import "./MainPage.css"
import { useEffect } from "react";
import { Link} from "react-router-dom";
import ProgramNavbar from "./SubComponents/ProgramNavbar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import SVGStar from "./SubComponents/SVGStar";
import MovieCard from "./SubComponents/MovieCard";
import UserCard from "./SubComponents/UserCard";


export default function MainPage(){

    /*  ---------------------------------------------------------------------------
        --------------------------------------------------------------------------
        LAN DİYAR YAPILACAKLARI BURAYA YAZIYORUM

        --bestMatchMovieName a tıklandığında o filmin pageine gitmeli onu ayarla
        ben link to yazmadım html in içinde tam nasıl yapılacağını bilmedğimden sen
        yaz
        --benzer şekilde aşağıdaki herhangi bir movie carda tıklandığında onun page
        e gitsin
        --movie card mekanizmasını chat reis yaptı movie card file ında logic yok
    */

    /*const [bestMatchMovie, setBestMatchMovie] = useState({});
    const [movieCardsMostPopular, setMovieCardsMostPopular] = useState([]);
    const [movieCardsBestRated, setMovieCardsBestRated] = useState([]);
    const [movieCardsForYou, setMovieCardsForYou] = useState([]);
    const [userCards, setUserCards] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        // Replace these URLs with your actual backend endpoints
        Promise.all([
            fetch('your-backend-url/best-match-movie'),
            fetch('your-backend-url/most-popular'),
            fetch('your-backend-url/best-rated'),
            fetch('your-backend-url/for-you'),
            fetch('your-backend-url/matched-people')
        ])
        .then(async ([resBestMatch, resMostPopular, resBestRated, resForYou, resMatchedPeople]) => {
            const bestMatch = await resBestMatch.json();
            const mostPopular = await resMostPopular.json();
            const bestRated = await resBestRated.json();
            const forYou = await resForYou.json();
            const matchedPeople = await resMatchedPeople.json();
            setBestMatchMovie(bestMatch);
            setMovieCardsMostPopular(mostPopular);
            setMovieCardsBestRated(bestRated);
            setMovieCardsForYou(forYou);
            setUserCards(matchedPeople);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            setError(error.toString());
        })
        .finally(() => {
            setIsLoading(false);
        });
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }*/

    // We will use this substitue for this  ---> <MovieCard key={movie.id} {...movie} />
    /* <Link to={`/movie/${movie.id}`} key={movie.id}>
                <MovieCard {...movie} />
        </Link> */ 
    


    const bestMatchMoviePoster= "src/assets/dummyPoster.jpg";
    const bestMatchMovieScene= "src/assets/dummy1.jpg";
    const bestMatchMovieName= "The Shining";
    const bestMatchMovieYear= "1980";
    const bestMatchMovieDesc= "A family heads to an isolated hotel for the winter where a sinister presence influences the father into violence, while his psychic son sees horrific forebodings from both past and future.";
    const bestMatchMoivePoints= "8.8"


    const movieCardsMostPopular = [
        { id: 1, name: "The Curious Case of Benjamin Button", image: "src/assets/dummyPoster.jpg", date: "1980" },
        { id: 2, name: "The Shining", image: "src/assets/dummyPoster.jpg", date: "1980" },
        { id: 3, name: "The Shining", image: "src/assets/dummyPoster.jpg", date: "1980" },
        { id: 4, name: "The Shining", image: "src/assets/dummyPoster.jpg", date: "1980" },
        { id: 5, name: "The Shining", image: "src/assets/dummyPoster.jpg", date: "1980" },
      ];


      const movieCardsBestRated = [
        { id: 1, name: "The Shining", image: "src/assets/dummyPoster.jpg", date: "1980" },
        { id: 2, name: "The Shining", image: "src/assets/dummyPoster.jpg", date: "1980" },
        { id: 3, name: "The Shining", image: "src/assets/dummyPoster.jpg", date: "1980" },
        { id: 4, name: "The Shining", image: "src/assets/dummyPoster.jpg", date: "1980"},
        { id: 5, name: "The Shining", image: "src/assets/dummyPoster.jpg", date: "1980"},
      ];

      const movieCardsForYou = [
        { id: 1, name: "The Shining", image: "src/assets/dummyPoster.jpg", date: "1980" },
        { id: 2, name: "The Shining", image: "src/assets/dummyPoster.jpg", date: "1980" },
        { id: 3, name: "The Shining", image: "src/assets/dummyPoster.jpg", date: "1980" },
        { id: 4, name: "The Shining", image: "src/assets/dummyPoster.jpg", date: "1980" },
        { id: 5, name: "The Shining", image: "src/assets/dummyPoster.jpg", date: "1980" },
      ];

      const userCards = [
        { id: 1, username: "kenan", percentage: 123, image: "src/assets/pp.jpg" },
        { id: 2, username: "diko", percentage: 456, image: "src/assets/pp.jpg" },
        { id: 3, username: "User4", percentage: 456, image: "src/assets/pp.jpg" },
        { id: 4, username: "User5", percentage: 456, image: "src/assets/pp.jpg" },
        { id: 5, username: "User6", percentage: 456, image: "src/assets/pp.jpg" },
      ];


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
                                {movieCardsMostPopular.map((movie) => (
                                    <MovieCard key={movie.id} {...movie} />
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
                                {movieCardsBestRated.map((movie) => (
                                    <MovieCard key={movie.id} {...movie} />
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
                                {movieCardsForYou.map((movie) => (
                                    <MovieCard key={movie.id} {...movie} />
                                ))}
                            </div>
                    </Container>
                </Row>
                <Row className="main-page-list">
                    <div className="main-page-list-text">
                        Matched People
                    </div>
                    <Container className="movie-cards-container">
                            <div className="movie-cards">
                                {userCards.map((user) => (
                                    <Link to={`/user/${user.username}`} key={user.id}>
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