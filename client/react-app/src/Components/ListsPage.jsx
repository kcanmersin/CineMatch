import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProgramNavbar from "./SubComponents/ProgramNavbar";
import { Link } from "react-router-dom";
import { BounceLoader } from 'react-spinners';
import "./MyListsPage.css";

export default function ListsPage() {
  const { username } = useParams();
  const [lists, setLists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const jwtAccess = localStorage.getItem('jwtAccess');

  useEffect(() => {
    setIsLoading(true);
    // Fetch the user's profile and lists based on the username
    fetch(`http://127.0.0.1:8000/accounts/profile/${username}/`, {
      method: 'GET',
      headers: {
        'Authorization': `JWT ${jwtAccess}`,
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(profileInfo => {
      fetchUserLists(profileInfo.id);
    })
    .catch(error => {
      console.error('Error:', error);
      setError(error.toString());
      setIsLoading(false);
    });
  }, [username, jwtAccess]);

  const fetchUserLists = (userId) => {
    fetch(`http://127.0.0.1:8000/movie/lists/`, {
      method: 'GET',
      headers: {
        'Authorization': `JWT ${jwtAccess}`,
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {
      const userLists = data.filter(list => list.user === userId);
      setLists(userLists);
      setIsLoading(false);
    })
    .catch(error => {
      console.error('Error fetching lists:', error);
      setError(error.toString());
      setIsLoading(false);
    });
  };

  if (isLoading) {
    return (
      <div className='main-page'>
        <ProgramNavbar />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <BounceLoader color="#123abc" loading={isLoading} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-page">
        <ProgramNavbar />
        <div>Error: {error}</div>
      </div>
    );
  }

  // Filter and display only public lists
  const publicLists = lists.filter(list => list.is_public);

  return (
    <div className="main-page">
      <ProgramNavbar />
      <div className='list-page-username'>Lists by <span>{username}</span></div>  
      <ul className='movie-lists-container'>
        {publicLists.map((list) => (
          <li className="movie-lists" key={list.id}>
            <div className="poster-info-container">
              <div className="movie-lists-posters-container">
                {list.movies.slice(0, 2).map((movie, index) => (
                  <div className="container-for-shift" key={index}>
                    <img src={"https://image.tmdb.org/t/p/original" + movie.poster_path} alt={movie.title} className="movie-image" />
                  </div>
                ))}
              </div>
              <div className="list-info">
                <Link to={`/user/${username}/lists/${list.id}`}>
                  <h3>{list.title}</h3>
                  <p>{list.movies.length} Movies</p>
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

