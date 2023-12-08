import "./MainPage.css"
import { Link} from "react-router-dom";
import ProgramNavbar from "./SubComponents/ProgramNavbar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import SVGStar from "./SubComponents/SVGStar";


export default function MainPage(){

    const bestMatchMoviePoster= "src/assets/dummyPoster.jpg";
    const bestMatchMovieScene= "src/assets/dummy1.jpg";
    const bestMatchMovieName= "The Shining";
    const bestMatchMovieYear= "1980";
    const bestMatchMovieDesc= "A family heads to an isolated hotel for the winter where a sinister presence influences the father into violence, while his psychic son sees horrific forebodings from both past and future.";
    const bestMatchMoivePoints= "8.8"

    /*  ---------------------------------------------------------------------------
        --------------------------------------------------------------------------
        LAN DİYAR YAPILACAKLARI BURAYA YAZIYORUM

        --şu yukardaki constları backende bağla
        --bestMatchMovieName a tıklandığında o filmin pageine gitmeli onu ayarla
        ben link to yazmadım html in içinde tam nasıl yapılacağını bilmedğimden sen
        yaz
        --benzer şekilde aşağıdaki herhangi bir movie carda tıklandığında onun page
        e gitsin
    */

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
                            <div className= "best-match-movie-desc">{bestMatchMovieDesc}</div>
                        </div>
                        <div className= "best-match-movie-points"><span className="true-points">{bestMatchMoivePoints}</span>/10</div>
                        <div className="star"><SVGStar/></div>
                    </div>
            </div>
        </div>
    )
}