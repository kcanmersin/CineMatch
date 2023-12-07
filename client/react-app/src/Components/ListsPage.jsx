import { useState, useEffect } from 'react';

export default function ListsPage() {
  const [lists, setLists] = useState([]);
  const [moviesData, setMoviesData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // get jwt token in order to authorize
  const jwtAccess = localStorage.getItem('jwtAccess');
  

  useEffect(() => {
    const apiUrl = 'http://127.0.0.1:8000/movie/lists';
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
  

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="lists-page">
      <h1>Movie Lists</h1>
      {/* display the each list */}
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
