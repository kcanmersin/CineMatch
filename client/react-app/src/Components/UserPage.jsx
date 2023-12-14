import "./MyProfilePage.css"
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import ProgramNavbar from "./SubComponents/ProgramNavbar";
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";
import MovieCard from "./SubComponents/MovieCard";
import Row from "react-bootstrap/Row";


export default function UserPage(){
    const { username } = useParams();
    const [yourUserId, setYourUserId] = useState(null);
    const [profileData, setProfileData] = useState({
        id: null,
        username: "Loading...",
        matchRate: 0,
        followerCount: 0,
        followingCount: 0,
        profilePictureUrl: '',
        watchedMovieCount: 0,
        bestMatchMoviePoster: ''
    });

    const jwtAccess = localStorage.getItem('jwtAccess');

    /*  ---------------------------------------------------------------------------
        --------------------------------------------------------------------------
        LAN DİYAR YAPILACAKLARI BURAYA YAZIYORUM

        -username hem aşağıda variable olarak tanımlı hem de navbar da. eğer onları
        backendde bi defa çekip bi yerde tutup oradan çekebiliyosan öyle yap
    */

    useEffect(() => {
    // Fetch profile data using the provided username
    fetch(`http://127.0.0.1:8000/accounts/profile/${username}/`, {
        method: 'GET',
        headers: {
        'Authorization': `JWT ${jwtAccess}`,
        'Content-Type': 'application/json',
        },
    })
        .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
        })
        .then(profileInfo => {
        // Update state with profile information
        setProfileData(prevData => ({
            ...prevData,
            id: profileInfo.id,
            username: username,
            matchRate: profileInfo.match_rate,
            followerCount: profileInfo.follower_count,
            followingCount: profileInfo.following_count,
            profilePictureUrl: profileInfo.profile_picture_url,
            watchedMovieCount: profileInfo.watched_movie_count,
            bestMatchMoviePoster: profileInfo.best_match_movie_poster
        }));
        })
        .catch(error => console.error('There has been a problem with your fetch operations:', error));
    }, [jwtAccess, username]);

    // in order to create follow and unfollow functionality, I need the user id
    useEffect(() => {
        // Fetch authenticated user's data
        fetch('http://127.0.0.1:8000/auth/users/me', {
          method: 'GET',
          headers: {
            'Authorization': `JWT ${jwtAccess}`,
            'Content-Type': 'application/json',
          },
        })
          .then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error('Network response was not ok.');
          })
          .then(data => {
            // Set the authenticated user's ID
            setYourUserId(data.id);
          })
          .catch(error => console.error('There has been a problem with your fetch operations:', error));
    }, [jwtAccess]);
    
    // follow or unfollow
    const handleFollow = () => {
        // Create a follow object with follower_id and following_id
        const followData = {
          follower_id: yourUserId, // Replace with the follower's user ID
          following_id: profileData.id, // Use the user ID of the profile being viewed
        };
      
        // Send a POST request to the follow endpoint
        fetch('http://127.0.0.1:8000/accounts/follow/', {
          method: 'POST',
          headers: {
            'Authorization': `JWT ${jwtAccess}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(followData),
        })
          .then(response => {
            if (response.ok) {
              // Follow request successful
              // You can update the UI or show a success message here
            } else {
              // Handle errors, e.g., the user is already following
              console.error('Follow request failed');
            }
          })
          .catch(error => {
            // Handle network errors
            console.error('Follow request failed:', error);
          });
      };

    //const MyProfileBgImage= "src/assets/dummy1.jpg";

    //const username="Michael Corleone";

    
    //const movieCount="1071";
    //const followersCount= "1453";
    //const followingsCount= "1923"

    // Dummy movie data
    /*const movieData = [
        { id: 1, name: "Movie 1", image: "src/assets/dummyPoster.jpg", date: "2022" },
        { id: 2, name: "Modsdddsdasdasda dasdasd dasdddddfsdvie 2", image: "src/assets/dummyPoster.jpg", date: "2021" },
        { id: 3, name: "Movie 3", image: "src/assets/dummyPoster.jpg", date: "2020" },
        { id: 4, name: "Movie 3", image: "src/assets/dummyPoster.jpg", date: "2020" },
        { id: 5, name: "Movie 3", image: "src/assets/dummyPoster.jpg", date: "2020" },
        { id: 6, name: "Movie 3", image: "src/assets/dummyPoster.jpg", date: "2020" },
        { id: 7, name: "Movie 3", image: "src/assets/dummyPoster.jpg", date: "2020" },
        { id: 8, name: "Movie 3", image: "src/assets/dummyPoster.jpg", date: "2020" },
        { id: 9, name: "Movie 3", image: "src/assets/dummyPoster.jpg", date: "2020" },
        { id: 10, name: "Movie 3", image: "src/assets/dummyPoster.jpg", date: "2020" },
    ];*/



    return(
        <div className="main-page">
            <ProgramNavbar/>
            <div className="profile-page-content"
              style={{
              backgroundImage: `linear-gradient(0deg, rgba(10, 20, 33, 0.4) 0%, rgba(10, 20, 33, 0.4) 100%), linear-gradient(0deg, #0A1421 0%, rgba(0, 0, 0, 0.00) 100%), url(${profileData.bestMatchMoviePoster})`,
              backgroundPosition: 'center center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
                }}>
                <div className= "user-profile">
                    <img
                        className="user-profile-image"
                        src={profileData.profilePictureUrl}
                    />
                    <div className="user-name">{profileData.username}</div>
                </div>
                <div className="follow-stats">
                    <div><span style={{fontWeight: 'bold'}}>{profileData.watchedMovieCount}</span> MOVIES</div>
                    <div><span style={{fontWeight: 'bold'}}>{profileData.followerCount}</span> FOLLOWERS</div>
                    <div><span style={{fontWeight: 'bold'}}>{profileData.followingCount}</span> FOLLOWINGS</div>
                </div>
            </div>
            <div className="rest-myprofile-page">
                <div className="profile-buttons-container">
                    <Link to={`/user/${username}/lists`}>
                        <Button variant="success profile-button">LISTS</Button>
                    </Link>
                    <Button variant="success profile-button">STATS</Button>
                    <Button variant="success profile-button" onClick={handleFollow}>FOLLOW</Button>
                </div>
                {/*<div className= "watched-movies">
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
                </div> */}
            </div>
        </div>
    )
}