import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";
import { BounceLoader } from 'react-spinners';

export default function MyFollowersPage() {
    const { userId } = useContext(UserContext);
    const [followers, setFollowers] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const jwtAccess = localStorage.getItem('jwtAccess');

    useEffect(() => {
        if (userId) {
            fetch(`${import.meta.env.VITE_BASE_URL}accounts/followers/${userId}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `JWT ${jwtAccess}`,
                    'Content-Type': 'application/json',
                },
            })
            .then(response => response.json())
            .then(data => {
                setFollowers(data);
            })
            .catch(error => {
                console.error('Error:', error);
                setError(error.toString());
            })
            .finally(() => {
                setIsLoading(false);
            });
        }
    }, [userId]);

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <BounceLoader color="#123abc" loading={isLoading} />
            </div>
        );
    }

    // Render
    return (
        <div>
            <h1>My Followers</h1>
            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <BounceLoader color="#123abc" loading={isLoading} />
                </div>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <div>
                    {Array.isArray(followers) && followers.length > 0 ? (
                        <ul>
                            {followers.map(person => (
                                <li key={person.user.id}>
                                    <Link to={`/user/${person.user.username}`} className="user-link">
                                        <img src={person.user.profile_picture} alt={`${person.user.username}'s profile`} />
                                        <p>Username: {person.user.username}</p>
                                    </Link>
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
