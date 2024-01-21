import React, { useState, useEffect } from 'react';
import ProgramNavbar from "./SubComponents/ProgramNavbar";
import { Button, Form, Modal } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { BounceLoader } from 'react-spinners';

export default function MyListsPage() {
  const [lists, setLists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const jwtAccess = localStorage.getItem('jwtAccess');
  const [userId, setUserId] = useState(null);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${import.meta.env.VITE_BASE_URL}auth/users/me/`, {
      method: 'GET',
      headers: {
        'Authorization': `JWT ${jwtAccess}`,
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {
      setUserId(data.id);
      fetchUserLists(data.id);
    })
    .catch(error => {
      console.error('Error:', error);
      setError(error.toString());
      setIsLoading(false);
    });
  }, []);

  const fetchUserLists = (userId) => {
    fetch(`${import.meta.env.VITE_BASE_URL}movie/lists/`, {
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

  const handleCreateList = (event) => {
    event.preventDefault();
    setIsLoading(true);
  
    fetch(`${import.meta.env.VITE_BASE_URL}movie/lists/create/`, {
      method: 'POST',
      headers: {
        'Authorization': `JWT ${jwtAccess}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: newListName,
        is_public: isPublic,
        user: userId
      }),
    })
    .then(response => response.json())
    .then(newList => {
      setLists([...lists, newList]);
      setShowModal(false);
      setNewListName("");
    })
    .catch(error => {
      console.error('Error creating list:', error);
      setError(error.toString());
    })
    .finally(() => {
      setIsLoading(false);
    });
  };
  
  const handleDeleteList = (listId) => {
    setIsLoading(true);

    fetch(`${import.meta.env.VITE_BASE_URL}movie/movie-lists/${listId}/delete/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `JWT ${jwtAccess}`,
        'Content-Type': 'application/json',
      },
    })
    .then(() => {
      setLists(lists.filter(list => list.id !== listId));
    })
    .catch(error => {
      console.error('Error deleting list:', error);
      setError(error.toString());
    })
    .finally(() => {
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

  return (
    <div className="main-page">
      <ProgramNavbar />
        <ul className='movie-lists-container'>
          {lists.map((list, index) => {
            // Transforming the list title
            let displayTitle = list.title;
            if (list.title === 'watchlist') {
              displayTitle = 'WatchList';
            } else if (list.title === 'watched_movies') {
              displayTitle = 'Watched Movies';
            }

            const isSingleMovie = list.movies.length === 1;

            return (
              <li className="movie-lists" key={list.id}>
                <div className="poster-info-container">
                  <div className="movie-lists-posters-container">
                    {list.movies.slice(0, 2).map((movie, movieIndex) => (
                      <div className={`container-for-shift${isSingleMovie ? ' single-movie' : ''}`} key={movieIndex}>
                        <img src={"https://image.tmdb.org/t/p/original" + movie.poster_path} alt={movie.title} className="movie-image" />
                      </div>
                    ))}
                  </div>
                  <div className="list-info">
                    <Link to={`/mylists/${list.id}`}>
                      <h3>{displayTitle}</h3>
                      <p>{list.movies.length} Movies</p>
                    </Link>
                  </div>
                </div>
                {/* Conditionally render delete button */}
                {list.title !== 'watchlist' && list.title !== 'watched_movies' ? (
                  <div className="delete-button-container">
                    <Button variant="danger" className="delete-button" onClick={() => handleDeleteList(list.id)}>
                      Delete
                    </Button>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      <Button variant="success" style={{margin:'2rem'}} onClick={handleShowModal}>
        Create New List
      </Button>
      <Modal className="create-list-modal" show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create New List</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateList}>
            <Form.Group>
              <Form.Label>List Name</Form.Label>
              <Form.Control 
                type="text" 
                value={newListName} 
                onChange={(e) => setNewListName(e.target.value)} 
                required 
              />
            </Form.Group>
            <Form.Group>
              <Form.Check 
                type="checkbox" 
                label="Public" 
                checked={isPublic} 
                onChange={(e) => setIsPublic(e.target.checked)} 
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Create
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}














