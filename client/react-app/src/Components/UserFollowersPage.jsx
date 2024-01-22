import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BounceLoader } from 'react-spinners';
import ProgramNavbar from "./SubComponents/ProgramNavbar";
import { UserContext } from './UserContext';

export default function UserFollowersPage() {
    const { username } = useContext(UserContext);
    const { username: profileUsername } = useParams();
    const [followers, setFollowers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const jwtAccess = localStorage.getItem('jwtAccess');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profileResponse = await fetch(`${import.meta.env.VITE_BASE_URL}accounts/profile/${profileUsername}/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `JWT ${jwtAccess}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!profileResponse.ok) {
                    throw new Error(`HTTP error! Status: ${profileResponse.status}`);
                }

                // take id and fetch the followers
                const profileData = await profileResponse.json();
                fetchFollowers(profileData.id);
            } catch (error) {
                setError(error.toString());
                setIsLoading(false);
            }
        };

        const fetchFollowers = async (userId) => {
            try {
                const followersResponse = await fetch(`${import.meta.env.VITE_BASE_URL}accounts/followers/${userId}/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `JWT ${jwtAccess}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!followersResponse.ok) {
                    throw new Error(`HTTP error! Status: ${followersResponse.status}`);
                }

                const followersData = await followersResponse.json();
                setFollowers(followersData);
                setIsLoading(false);
            } catch (error) {
                setError(error.toString());
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, [profileUsername, jwtAccess]);

    return (
        <div className="main-page">
            <ProgramNavbar/>
            {isLoading ? (
                <div className="main-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <BounceLoader color="#123abc" loading={isLoading} />
                </div>
            ) : error ? (
                <p>Error: {error}</p>
            ) : ( 
                <div>
                    <div className='list-page-username'>{profileUsername + "'s Followers"}</div>
                    {Array.isArray(followers) && followers.length > 0 ? (
                         <ul className='movie-lists-container'>

                            {followers.map((person, index) => (
                                <li className="movie-lists" key={person.user.id + "_" + index}>
                                    {/* Check if the follower is the current user */}
                                    {person.is_followed_by.username === username ? (
                                        <Link to="/myprofile" className="user-link">
                                            <img className="user-profile-image-list" src={person.is_followed_by.profile_picture} alt={`${person.is_followed_by.username}'s profile`} />
                                            <p style={{color: '#cecece'}}>Username: {person.is_followed_by.username}</p>
                                        </Link>
                                    ) : (
                                        <Link to={`/user/${person.is_followed_by.username}`} className="user-link">
                                            <img className="user-profile-image-list" src={person.is_followed_by.profile_picture} alt={`${person.is_followed_by.username}'s profile`} />
                                            <p style={{color: '#cecece'}}>Username: {person.is_followed_by.username}</p>
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No followers found.</p>
                    )}
                </div>
            )}
        </div>
    );
}
