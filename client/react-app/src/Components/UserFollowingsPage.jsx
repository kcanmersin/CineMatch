import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BounceLoader } from 'react-spinners';
import "./MyFollowingsPage.css"
import ProgramNavbar from "./SubComponents/ProgramNavbar";
import { UserContext } from './UserContext';

export default function UserFollowingsPage() {
    const { username } = useContext(UserContext);
    const { username: profileUsername } = useParams();
    const [followings, setFollowings] = useState([]);
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
                // take id and fetch the followings
                const profileData = await profileResponse.json();
                fetchFollowings(profileData.id);
            } catch (error) {
                setError(error.toString());
                setIsLoading(false);
            }
        };

        const fetchFollowings = async (userId) => {
            try {
                const followingResponse = await fetch(`${import.meta.env.VITE_BASE_URL}accounts/following/${userId}/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `JWT ${jwtAccess}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!followingResponse.ok) {
                    throw new Error(`HTTP error! Status: ${followingResponse.status}`);
                }

                const followingsData = await followingResponse.json();
                setFollowings(followingsData);
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
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <BounceLoader color="#123abc" loading={isLoading} />
                </div>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <div>
                    <div className='list-page-username'>{profileUsername + "'s Followings"}</div>
                    {Array.isArray(followings) && followings.length > 0 ? (
                        <ul className='movie-lists-container'>
                            {followings.map((person, index) => (
                                <li className="movie-lists" key={person.user.id + "_" + index}>
                                    {/* Check if the following is the current user */}
                                    {person.user.username === username ? (
                                        <Link to="/myprofile" className="user-link">
                                            <img className="user-profile-image-list" src={person.user.profile_picture} alt={`${person.user.username}'s profile`} />
                                            <p style={{color: '#cecece'}}>Username: {person.user.username}</p>
                                        </Link>
                                    ) : (
                                        <Link to={`/user/${person.user.username}`} className="user-link">
                                            <img className="user-profile-image-list" src={person.user.profile_picture} alt={`${person.user.username}'s profile`} />
                                            <p style={{color: '#cecece'}}>Username: {person.user.username}</p>
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No followings found.</p>
                    )}
                </div>
            )}
        </div>
    );
}
