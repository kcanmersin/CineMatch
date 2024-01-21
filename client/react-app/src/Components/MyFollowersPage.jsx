import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";
import { BounceLoader } from 'react-spinners';
import "./MyFollowingsPage.css"
import ProgramNavbar from "./SubComponents/ProgramNavbar";

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
            <div className="main-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <BounceLoader color="#123abc" loading={isLoading} />
            </div>
        );
    }

    // Render
    return (
        <div className="main-page">
            <ProgramNavbar/>
            <div className='list-page-username'>My Followers</div>
            {isLoading ? (
                <div className="main-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <BounceLoader color="#123abc" loading={isLoading} />
                </div>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <div>
                    {Array.isArray(followers) && followers.length > 0 ? (
                        <ul className='movie-lists-container'>
                            {followers.map(person => (
                                <li className="movie-lists" key={person.is_followed_by.id}>
                                    <Link to={`/user/${person.is_followed_by.username}`} className="user-link">
                                        <img className="user-profile-image-list" src={person.is_followed_by.profile_picture} alt={`${person.is_followed_by.username}'s profile`} />
                                        <p style={{color: '#cecece'}}>Username: {person.is_followed_by.username}</p>
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
