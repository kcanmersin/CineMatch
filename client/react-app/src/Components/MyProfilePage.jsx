import "./MyProfilePage.css"
import { useState, useEffect, useContext } from "react";
import { Link} from "react-router-dom";
import ProgramNavbar from "./SubComponents/ProgramNavbar";
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";
import MovieCard from "./SubComponents/MovieCard";
import Row from "react-bootstrap/Row";
import { UserContext } from "./UserContext";


export default function MyProfilePage(){
    const { username, profilePictureUrl, setProfilePicture } = useContext(UserContext);
    const [profileData, setProfileData] = useState({
        id:null,
        matchRate: 0,
        followerCount: 0,
        followingCount: 0,
        watchedMovieCount: 0,
        bestMatchMoviePoster: ''
    });

    const [watchedMovies, setWatchedMovies] = useState([]);
    const jwtAccess = localStorage.getItem('jwtAccess');

    useEffect(() => {
        const fetchData = async () => {
            if (!username) {
                return; // Exit if username is not defined.
            }
    
    
            try {
                // Fetch profile data
                const profileResponse = await fetch(`http://127.0.0.1:8000/accounts/profile/${username}/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `JWT ${jwtAccess}`,
                        'Content-Type': 'application/json',
                    },
                });
    
                if (!profileResponse.ok) {
                    throw new Error('Network response was not ok.');
                }
    
                const profileInfo = await profileResponse.json();
    
                // Update state with profile information
                setProfileData({
                    id: profileInfo.id,
                    matchRate: profileInfo.match_rate,
                    followerCount: profileInfo.follower_count,
                    followingCount: profileInfo.following_count,
                    watchedMovieCount: profileInfo.watched_movie_count,
                    bestMatchMoviePoster: profileInfo.best_match_movie_poster,
                    profilePictureUrl: profileInfo.profile_picture_url
                });
    
                // Fetch lists
                const listsResponse = await fetch(`http://127.0.0.1:8000/movie/lists/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `JWT ${jwtAccess}`,
                        'Content-Type': 'application/json',
                    },
                });
    
                if (!listsResponse.ok) {
                    throw new Error('Error fetching lists.');
                }
    
                const allLists = await listsResponse.json();
                const userLists = await allLists.filter(list => list.user === profileInfo.id);
                const watchedList = userLists.find((list, index) => index === 1);
    
                if (watchedList && watchedList.movies) {
                    setWatchedMovies(watchedList.movies); // Directly use the movies from the watched list
                } else {
                    console.log('Watched list or movies not found');
                }
    
            } catch (error) {
                console.error('Error:', error);
            }
        };
    
        fetchData();
    }, [jwtAccess, username]);
        
    
    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const formData = new FormData();
          formData.append("profile_picture", file);
      
          fetch('http://127.0.0.1:8000/accounts/change-profile-photo/', {
            method: 'PATCH',
            headers: {
              Authorization: `JWT ${jwtAccess}`,
            },
            body: formData,
          })
            .then(response => response.json())
            .then(data => {
              setProfilePicture(data.profile_picture_url)
              window.location.reload();
            })
            .catch(error => console.error('Error updating profile picture:', error));
        }
      };
      

    return(
        <div className="main-page">
            <ProgramNavbar />
            <div className="profile-page-content"
              style={{
              backgroundImage: `linear-gradient(0deg, rgba(10, 20, 33, 0.4) 0%, rgba(10, 20, 33, 0.4) 100%), linear-gradient(0deg, #0A1421 0%, rgba(0, 0, 0, 0.00) 100%), url(${profileData.bestMatchMoviePoster})`,
              backgroundPosition: 'center center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
                }}>
                <div className= "user-profile">
                <label htmlFor="profilePictureInput">
                    <img
                        className="user-profile-image"
                        src={profilePictureUrl} // Fallback to a default image if profilePictureUrl is empty
                        alt="Profile"
                    />
                    <input
                        type="file"
                        id="profilePictureInput"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleProfilePictureChange}
                    />
                </label>
                    <div className="user-name">{username}</div>
                </div>
                <div className="follow-stats">
                    <div><span style={{fontWeight: 'bold'}}>{profileData.watchedMovieCount}</span> MOVIES</div>
                    <div><span style={{fontWeight: 'bold'}}>{profileData.followerCount}</span> FOLLOWERS</div>
                    <div><span style={{fontWeight: 'bold'}}>{profileData.followingCount}</span> FOLLOWINGS</div>
                </div>
            </div>
            <div className="rest-myprofile-page">
                <div className="profile-buttons-container">
                    <Link to="/mylists">
                        <Button variant="success profile-button">LISTS</Button>
                    </Link>
                    <Button variant="success profile-button">STATS</Button>
                </div>
                <div className= "watched-movies">
                    <div className="watched-movies-text">
                        WATCHED MOVIES
                    </div>
                    <Container className="watched-movies-card-container">
                        <Row>
                            {watchedMovies.map((movie) => (
                                <Link key={movie.id} to={`/moviepage/${movie.id}`}>
                                    <MovieCard {...movie} />
                                </Link>
                            ))}
                        </Row>
                    </Container>
                </div>
            </div>
        </div>
    )
}