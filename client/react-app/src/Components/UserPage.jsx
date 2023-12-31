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
    // TODO: follow mechanism is the problem, fix it
    const { username } = useParams();
    const [yourUserId, setYourUserId] = useState(null);
    const [watchedMovies, setWatchedMovies] = useState([]);
    const [followState, setFollowState] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // New loading state
    const [profileData, setProfileData] = useState({
        id: null,
        matchRate: 0,
        followerCount: 0,
        followingCount: 0,
        followStatus: null,
        profilePictureUrl: '',
        watchedMovieCount: 0,
        bestMatchMoviePoster: ''
    });

    const jwtAccess = localStorage.getItem('jwtAccess');
    const bestMatchMoviePoster= "src/assets/dummyPoster.jpg";
    

    useEffect(() => {
      const fetchData = async () => {
          if (!username) {
              return; // Exit if username is not defined.
          }
  
          setIsLoading(true);
  
          try {
              // Fetch the current user's ID
              const userResponse = await fetch('http://127.0.0.1:8000/auth/users/me/', {
                method: 'GET',
                headers: {
                    'Authorization': `JWT ${jwtAccess}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!userResponse.ok) {
                throw new Error('Failed to fetch user data');
            }

            const userData = await userResponse.json();
            setYourUserId(userData.id);
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
              console.log(profileInfo)
  
              // Update state with profile information
              setProfileData({
                id: profileInfo.id,
                matchRate: profileInfo.match_rate,
                followerCount: profileInfo.follower_count,
                followingCount: profileInfo.following_count,
                watchedMovieCount: profileInfo.watched_movie_count,
                bestMatchMoviePoster: profileInfo.best_match_movie_poster,
                profilePictureUrl: profileInfo.profile_picture_url,
                followStatus: profileInfo.follow_status,
            });
            setFollowState(profileInfo.follow_status ? "Unfollow": "Follow");
  
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

              // set the list's movies
              if (watchedList && watchedList.movies) {
                setWatchedMovies(watchedList.movies); // Directly use the movies from the watched list
              } else {
                  console.log('Watched list or movies not found');
              }
  
          } catch (error) {
              console.error('Error:', error);
          } finally {
              setIsLoading(false);
          }
      };
  
      fetchData();
  }, [jwtAccess, username, followState]);
  

  const handleFollow = () => {
    setIsLoading(true); // Begin loading state

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
    }).then(response => response.json())
      .then(data => {
        console.log(data);
        // Assuming data.status is "following" if now following, and something else if not.
        if (data.status === "Following") {
            setFollowState("Unfollow");
        } else {
            setFollowState("Follow");
        }

        // Always refetch the profile after a follow/unfollow action to ensure the data is fresh.
        return fetch(`http://127.0.0.1:8000/accounts/profile/${username}/`, {
            method: 'GET',
            headers: {
                'Authorization': `JWT ${jwtAccess}`,
                'Content-Type': 'application/json',
            },
        });
      })
      .then(updatedProfileResponse => updatedProfileResponse.json())
      .then(updatedProfileInfo => {
        console.log(updatedProfileInfo);
        if (updatedProfileInfo) {
            // Update the state with the new follow state and count
            setProfileData(prevData => ({
                ...prevData,
                followerCount: updatedProfileInfo.follower_count,
                followStatus: updatedProfileInfo.follow_status,
            }));
        }
        setIsLoading(false); // End loading state
      })
      .catch(error => {
        console.error('Follow/unfollow request failed', error);
        setIsLoading(false); // End loading state
      });
};

  


    return(
        <div className="main-page">
            <ProgramNavbar/>
            <div className="profile-page-content"
              style={{
              backgroundImage: `linear-gradient(0deg, rgba(10, 20, 33, 0.4) 0%, rgba(10, 20, 33, 0.4) 100%), linear-gradient(0deg, #0A1421 0%, rgba(0, 0, 0, 0.00) 100%), url(${ bestMatchMoviePoster })`, /*profileData.bestMatchMoviePoster}*/
              backgroundPosition: 'center center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
                }}>
                <div className= "user-profile">
                    <img
                        className="user-profile-image"
                        src={profileData.profilePictureUrl}
                    />
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
                    <Link to={`/user/${username}/lists`}>
                        <Button variant="success profile-button">LISTS</Button>
                    </Link>
                    <Link to={`/user/${username}/stats`}>
                        <Button variant="success profile-button">STATS</Button>
                    </Link>
                    <Button 
                        variant="success profile-button" 
                        onClick={handleFollow}
                        disabled={isLoading} // Disable button while loading
                    >
                        {followState}
                    </Button>
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


