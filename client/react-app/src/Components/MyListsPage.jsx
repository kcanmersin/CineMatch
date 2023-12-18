import "./MyListsPage.css";
import { useState, useEffect } from 'react';
import ProgramNavbar from "./SubComponents/ProgramNavbar";
import { Button, Form, Container, Row, Col, Modal } from 'react-bootstrap';


export default function MyListsPage() {
  // TODO: this page renders after 2 or 3 seconds ---> fix it
  const [lists, setLists] = useState([]);
  const [moviesData, setMoviesData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isPublic, setIsPublic] = useState(true); // State for the is_public checkbox
  const jwtAccess = localStorage.getItem('jwtAccess');
  const [userId, setUserId] = useState(null); // userId
  const [showModal, setShowModal] = useState(false);

  const MoviePosterLink= "src/assets/dummyPoster.jpg";

  

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    fetch('http://127.0.0.1:8000/auth/users/me/', {
      method: 'GET',
      headers: {
        'Authorization': `JWT ${jwtAccess}`,
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {
      setUserId(data.id);
      return fetch('http://127.0.0.1:8000/movie/lists/', {
        method: 'GET',
        headers: {
          'Authorization': `JWT ${jwtAccess}`,
          'Content-Type': 'application/json',
        },
      });
    })
    .then(response => response.json())
    .then(data => {
      const userLists = data.filter(list => list.user === userId);
      setLists(userLists);
      fetchListImages(userLists);
    })
    .catch(error => {
      console.error('Error:', error);
      setError(error.toString());
    })
    .finally(() => {
      setIsLoading(false);
    });
  }, [userId]);

  const fetchListImages = (lists) => {
    lists.forEach((list) => {
      // Assuming each movie in list.movies is an object with an 'id' property
      const listMovieIds = list.movies.slice(0, 2).map(movie => movie.id);
  
      Promise.all(listMovieIds.map((movieId) => 
        fetch(`http://127.0.0.1:8000/movie/movie/movies/${movieId}/`, {
          method: 'GET',
          headers: {
            'Authorization': `JWT ${jwtAccess}`,
            'Content-Type': 'application/json',
          },
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
      ))
      .then((movies) => {
        setMoviesData(prevMovies => ({ ...prevMovies, [list.id]: movies }));
      })
      .catch((error) => {
        console.error('Error fetching movie data:', error);
        setError(error.toString());
      });
    });
  };


  const handleCreateList = (event) => {
    event.preventDefault();
    const listName = event.target.listName.value;

    setIsLoading(true);
  
    fetch('http://127.0.0.1:8000/movie/lists/create/', {
      method: 'POST',
      headers: {
        'Authorization': `JWT ${jwtAccess}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: listName,
        is_public: isPublic, // Include is_public in the POST request
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(newList => {
      setLists(currentLists => [...currentLists, newList]);
      setShowModal(false);
      setIsPublic(true); // Reset the isPublic state to default
    })
    .catch(error => {
      console.error('Error creating list:', error);
      setError(error.toString());
    })
    .finally(() => {
      setIsLoading(false);
    });
  };
  
  // remove the list from the database
  const handleDeleteList = (listId) => {
    setIsLoading(true);

    fetch(`http://127.0.0.1:8000/movie/movie-lists/${listId}/delete/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `JWT ${jwtAccess}`,
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Remove the deleted list from the state
      setLists(currentLists => currentLists.filter(list => list.id !== listId));
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="main-page">
      <ProgramNavbar />
      <ul className='movie-lists-container'>
        {lists.map((list, index) => (
          <li className= "movie-lists" key={index}>
            <div className="poster-info-container">
              <div className= "movie-lists-posters-container">
                {moviesData[list.id] && moviesData[list.id].map((movie, movieIndex) => (
                  <div className= "container-for-shift" key={movieIndex}>
                    <img src={MoviePosterLink} className="movie-image" />
                  </div>
                ))}
              </div>
              <div className="list-info">
                <h3>{list.title}</h3>
                <p>{list.movies.length} Movies</p>
              </div>
            </div>
            <div className="delete-button-container">
              {index >= 2 && (
                <Button variant="danger" className="delete-button" onClick={() => handleDeleteList(list.id)}>
                  Delete
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
      <Button variant="success"
        style={{margin:'2rem'}}onClick={handleShowModal}>
        {showCreateForm ? 'Cancel' : 'Create List'}
      </Button>
      <Modal className= "create-list-modal" show={showModal} onHide={handleCloseModal}>
        <Modal.Header className="modal-header"closeButton>
          <Modal.Title>Create List</Modal.Title>
        </Modal.Header>
        <Modal.Body
          className="modal-body">
          <Form className= "create-list-form" onSubmit={handleCreateList}>
            <Form.Group controlId="listName">
            <Form.Label>List Name:</Form.Label>
            <Form.Control type="text" name="listName" required />
          </Form.Group>
          <Form.Group controlId="isPublic">
            <Form.Check
              type="checkbox"
              label="Public"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
          </Form.Group>
          <Button variant="primary" className="create-list-submit-button" type="submit">
            Create
          </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
















