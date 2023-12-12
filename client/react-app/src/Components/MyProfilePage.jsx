import "./MyProfilePage.css"
import { Link} from "react-router-dom";
import ProgramNavbar from "./SubComponents/ProgramNavbar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import SVGStar from "./SubComponents/SVGStar";
import MovieCard from "./SubComponents/MovieCard";
import UserCard from "./SubComponents/UserCard";


export default function MyProfilePage(){


    /*  ---------------------------------------------------------------------------
        --------------------------------------------------------------------------
        LAN DİYAR YAPILACAKLARI BURAYA YAZIYORUM

        -username hem aşağıda variable olarak tanımlı hem de navbar da eğer onları
        backendde bi defa çekip bi yerde tutup oradan çekebiliyosan öyle yap
    */

    const MyProfileBgImage= "src/assets/dummy1.jpg";
    const ppLink= "src/assets/pp.jpg";
    const username="Michael Corleone"


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
            </div>
        </div>
    )
}