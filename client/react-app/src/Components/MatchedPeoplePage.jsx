import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


export default function MatchedPeoplePage() {
  const [matchedPeople, setMatchedPeople] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const jwtAccess = localStorage.getItem('jwtAccess');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/accounts/matched-people/', {
      method: 'GET',
      headers: {
        'Authorization': `JWT ${jwtAccess}`, // Replace 'jwtAccess' with your JWT token variable
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
  }, []); // Empty dependency array means this effect runs once after the initial render

  return (
    <div>
      <h1>Matched People</h1>
      {isLoading ? <p>Loading...</p> : null}
      {error ? <p>Error: {error}</p> : null}
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
