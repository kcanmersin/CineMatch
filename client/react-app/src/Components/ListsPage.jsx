import { useState, useEffect } from 'react';

export default function ListsPage() {
  const [lists, setLists] = useState([]);
  const [moviesData, setMoviesData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const jwtAccess = localStorage.getItem('jwtAccess');

  useEffect(() => {
    const apiUrl = 'http://127.0.0.1:8000/movie/lists/';
    setIsLoading(true);

    fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `JWT ${jwtAccess}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setLists(data);
        fetchListImages(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError(error.toString());
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

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
      body: JSON.stringify({ title: listName }), // Using "title" as the key for the list name
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((newList) => {
      setLists(currentLists => [...currentLists, newList]);
      setShowCreateForm(false);
    })
    .catch((error) => {
      console.error('Error creating list:', error);
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
          </li>
        ))}
      </ul>
    </div>
  );
}
















