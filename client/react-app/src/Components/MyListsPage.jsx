import { useState, useEffect } from 'react';

export default function MyListsPage() {
  const [lists, setLists] = useState([]);
  const [moviesData, setMoviesData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isPublic, setIsPublic] = useState(true); // State for the is_public checkbox
  const jwtAccess = localStorage.getItem('jwtAccess');
  const [userId, setUserId] = useState(null); // userId
  

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
        fetch(`http://127.0.0.1:8000/movie/movie/movies/${movieId}`, {
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

  const handleCreateButtonClick = () => {
    setShowCreateForm(!showCreateForm);
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
      setShowCreateForm(false);
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
    <div className="lists-page">
      <h1>Movie Lists</h1>
      <button onClick={handleCreateButtonClick}>
        {showCreateForm ? 'Cancel' : 'Create List'}
      </button>
      {showCreateForm && (
        <form onSubmit={handleCreateList}>
          <label>
            List Name:
            <input type="text" name="listName" required />
          </label>
          <label>
            Public:
            <input 
              type="checkbox" 
              checked={isPublic} 
              onChange={(e) => setIsPublic(e.target.checked)} 
            />
          </label>
          <button type="submit">Create</button>
        </form>
      )}
      <ul>
          {lists.map((list, index) => (
            <li key={index}>
              <h3>{list.title}</h3>
              <p>{list.movies.length} Movies</p>
              {moviesData[list.id] && moviesData[list.id].map((movie, movieIndex) => (
                <div key={movieIndex}>
                  <p>{movie.title}</p>
                </div>
              ))}
              <p>Total time of watch: {list.total_time_of_movies}</p>
              {/* Conditionally render the delete button */}
              {index >= 2 && (
                <button onClick={() => handleDeleteList(list.id)}>Delete</button>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
}
















