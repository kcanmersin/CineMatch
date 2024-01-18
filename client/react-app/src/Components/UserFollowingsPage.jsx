import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BounceLoader } from 'react-spinners';

export default function UserFollowingsPage() {
    const { username } = useParams(); 
    const [followings, setFollowings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const jwtAccess = localStorage.getItem('jwtAccess');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profileResponse = await fetch(`${import.meta.env.VITE_BASE_URL}accounts/profile/${username}/`, {
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
    }, [username, jwtAccess]);

    return (
        <div>
            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <BounceLoader color="#123abc" loading={isLoading} />
                </div>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <div>
                    <h1>{username + "'s Followings"}</h1>
                    {Array.isArray(followings) && followings.length > 0 ? (
                        <ul>
                            {followings.map(person => (
                                <li key={person.user.username}>
                                    <Link to={`/user/${person.user.username}`} className="user-link">
                                        <img src={person.user.profile_picture} alt={`${person.user.username}'s profile`} />
                                        <p>Username: {person.user.username}</p>
                                    </Link>
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
