import "./MyProfilePage.css"
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import ProgramNavbar from "./SubComponents/ProgramNavbar";
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";
import MovieCard from "./SubComponents/MovieCard";
import Row from "react-bootstrap/Row";


export default function UserPage(){

    // TODO: add matched percentage below username
    const { username } = useParams();
    const [yourUserId, setYourUserId] = useState(null);
    const [watchedMovies, setWatchedMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // New loading state
    const [profileData, setProfileData] = useState({
        id: null,
        username: "Loading...",
        matchRate: 0,
        followerCount: 0,
        followingCount: 0,
        followStatus: null,
        profilePictureUrl: '',
        watchedMovieCount: 0,
        bestMatchMoviePoster: ''
    });

    const jwtAccess = localStorage.getItem('jwtAccess');

    

    useEffect(() => {
      setIsLoading(true);
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
              bestMatchMoviePoster: profileInfo.best_match_movie_poster,
              followStatus: profileInfo.follow_status,
          }));
          
        })
        .catch(error => console.error('There has been a problem with your fetch operations:', error));
    }, [jwtAccess, username]);

    // in order to create follow and unfollow functionality, I need the user id
    useEffect(() => {
        // Fetch authenticated user's data
        fetch('http://127.0.0.1:8000/auth/users/me/', {
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

    // display the watched movies
















    
    const handleFollow = () => {
      // Determine whether to follow or unfollow based on the current followStatus
      const shouldFollow = !profileData.followStatus;
    
      // Create a follow object with follower_id and following_id
      const followData = {
        follower_id: profileData.id, // Replace with the follower's user ID
        following_id: yourUserId, // Use the user ID of the profile being viewed
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
            // After the follow/unfollow is successful, fetch the updated follower count
            return fetch(`http://127.0.0.1:8000/accounts/profile/${username}/`, {
              method: 'GET',
              headers: {
                'Authorization': `JWT ${jwtAccess}`,
                'Content-Type': 'application/json',
              },
            });
          } else {
            // Handle errors, e.g., the user is already following
            console.error(shouldFollow ? 'Follow request failed' : 'Unfollow request failed');
            return null;
          }
        })
        .then(updatedProfileResponse => {
          if (updatedProfileResponse) {
            return updatedProfileResponse.json();
          }
          return null;
        })
        .then(updatedProfileInfo => {
          if (updatedProfileInfo) {
            // Update the state with the new follower count
            console.log(updatedProfileInfo);
            setProfileData(prevData => ({
              ...prevData,
              followerCount: updatedProfileInfo.follower_count,
              followStatus: updatedProfileInfo.follow_status,
            }));
          }
        })
        .catch(error => {
          // Handle network errors
          console.error(shouldFollow ? 'Follow request failed' : 'Unfollow request failed', error);
        });
    };


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
                    <Button 
                        variant="success profile-button" 
                        onClick={handleFollow}
                        disabled={isLoading} // Disable button while loading
                    >
                        {isLoading ? "Loading..." : profileData.followStatus ? "Unfollow" : "Follow"}
                    </Button>
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