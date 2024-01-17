import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BounceLoader } from 'react-spinners';

export default function MatchedPeoplePage() {
  const [matchedPeople, setMatchedPeople] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const jwtAccess = localStorage.getItem('jwtAccess');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}accounts/matched-people/`, {
      method: 'GET',
      headers: {
        'Authorization': `JWT ${jwtAccess}`,
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {
      setMatchedPeople(data.best_matched_people);
    })
    .catch(error => {
      console.error('Error:', error);
      setError(error.toString());
    })
    .finally(() => {
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <BounceLoader color="#123abc" loading={isLoading} />
      </div>
    );
  }

  if (error) {
    return (
      <div>Error: {error}</div>
    );
  }

  return (
    <div>
      <h1>Matched People</h1>
      <ul>
        {matchedPeople.map(person => (
          <li key={person.username}>
            <Link to={`/user/${person.username}`} className="user-link">
              <img src={person.profile_picture} alt={`${person.username}'s profile`} />
              <p>Username: {person.username}</p>
              <p>Rate Ratio: {person.rate_ratio}%</p>
              <p>Movie Count: {person.movie_count}</p>
              <p>Follower Count: {person.follower_count}</p>
              <p>Following Count: {person.following_count}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
