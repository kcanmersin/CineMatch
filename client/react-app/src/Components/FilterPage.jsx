import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MovieCard from './SubComponents/MovieCard';
import { BounceLoader } from 'react-spinners';
import ProgramNavbar from './SubComponents/ProgramNavbar';

function FilterPage() {
    const { listId } = useParams();
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedGenres, setSelectedGenres] = useState([]);  // State to manage selected genres
    const jwtAccess = localStorage.getItem('jwtAccess');

    // Define available genres (you could also fetch this from an API)
    const genreOptions = ["Action", "Drama", "Comedy", "Thriller", "Romance"];

    useEffect(() => {
        // Fetch the list and filter movies when the component mounts
        setIsLoading(true);
        fetchListAndFilterMovies();
    }, [listId]);

    const fetchListAndFilterMovies = () => {
        fetch(`http://127.0.0.1:8000/movie/lists/${listId}/`, {
            method: 'GET',
            headers: {
                'Authorization': `JWT ${jwtAccess}`,
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            setMovies(data.movies);  // Update the state with the movies from the list
            handleFilterMovies();    // Immediately apply filters once movies are fetched
        })
        .catch(error => {
            console.error('Error fetching list:', error);
            setIsLoading(false);
        });
    };

    const handleFilterMovies = () => {
        console.log(selectedGenres);
        const filterCriteria = {
            list_id: listId,
            start_date: "2008",
            end_date: "2023",
            genres: selectedGenres
        };

        fetch(`http://127.0.0.1:8000/movie/movie-lists/${listId}/filter/`, {
            method: 'POST',
            headers: {
                'Authorization': `JWT ${jwtAccess}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(filterCriteria)
        })
        .then(response => response.json())
        .then(data => {
            setFilteredMovies(data);  // Update the state with the filtered movies
            setIsLoading(false);      // End loading
        })
        .catch(error => {
            console.error('Error filtering movies:', error);
            setIsLoading(false);
        });
    };

    const handleGenreChange = (genre) => {
        if (selectedGenres.includes(genre)) {
            setSelectedGenres(selectedGenres.filter(g => g !== genre));  // Remove genre
        } else {
            setSelectedGenres([...selectedGenres, genre]);  // Add genre
        }
    };

    // Render the genre filter options
    const renderGenreOptions = () => (
        <div>
            {genreOptions.map(genre => (
                <label key={genre}>
                    <input
                        type="checkbox"
                        checked={selectedGenres.includes(genre)}
                        onChange={() => handleGenreChange(genre)}
                    />
                    {genre}
                </label>
            ))}
            <button onClick={handleFilterMovies}>Apply Filters</button>
        </div>
    );

    // If the page is still loading, show the loader
    if (isLoading) {
        return (
            <div>
                <ProgramNavbar />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <BounceLoader color="#123abc" loading={true} />
                </div>
            </div>
        );
    }

    // Determine which movies to display: filtered or all from the list
    const moviesToDisplay = Array.isArray(filteredMovies) ? filteredMovies : movies;

    // Render the movies once loading is complete
    return (
        <div>
            <ProgramNavbar />
            {renderGenreOptions()}  {/* Render the genre filter options */}
            <h1>Filtered Movies</h1>
            <ul>
            {moviesToDisplay.map(movie => (
                <li key={movie.id}>
                    <Link to={`/moviepage/${movie.id}`}>
                        <MovieCard {...movie} />
                    </Link>
                </li>
            ))}
            </ul>
        </div>
    );
}

export default FilterPage;
