import { useState, useEffect } from 'react';

export default function ListsPage({ userId }) {
  const [lists, setLists] = useState([]);
  const [moviesData, setMoviesData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const jwtAccess = localStorage.getItem('jwtAccess');

  // get the list of a specified user --> userId
  useEffect(() => {
    setIsLoading(true);
    fetch(`http://127.0.0.1:8000/movie/${userId}/lists/`, {
      method: 'GET',
      headers: {
        'Authorization': `JWT ${jwtAccess}`,
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {
      setLists(data);
      fetchListImages(data);
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="lists-page">
      <h1>Movie Lists</h1>
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
