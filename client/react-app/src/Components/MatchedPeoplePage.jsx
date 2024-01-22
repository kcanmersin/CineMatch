import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BounceLoader } from 'react-spinners';
import "./MyFollowingsPage.css"
import ProgramNavbar from "./SubComponents/ProgramNavbar";

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
      <div className="main-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
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
    <div className="main-page">
      <ProgramNavbar/>
      <div className='list-page-username'>Matched People</div>
      <ul className='movie-lists-container'>
        {matchedPeople.map(person => (
          <li className="movie-lists" key={person.username}>
            <Link to={`/user/${person.username}`} className="user-link">
              <img className="user-profile-image-list" src={person.profile_picture} alt={`${person.username}'s profile`} />
              <p>Username: {person.username}            <span style={{color: "#00FF38"}}>{person.rate_ratio}%</span></p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
