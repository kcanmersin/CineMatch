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
    const [selectedGenres, setSelectedGenres] = useState([]); // State to manage selected genres
    const [sortMethod, setSortMethod] = useState('popularity'); // State to manage sorting method
    const jwtAccess = localStorage.getItem('jwtAccess');

    const genreOptions = ["Action", "Drama", "Comedy", "Thriller", "Romance"];
    const sortOptions = ['popularity', 'alphabetic', 'rating', 'user_rating', 'length', 'release_date']; // Sorting options

    useEffect(() => {
        setIsLoading(true);
        fetchListAndFilterMovies();
    }, [listId, sortMethod]); // Re-fetch when listId or sortMethod changes

    const fetchListAndFilterMovies = () => {
        fetch(
            `${import.meta.env.VITE_BASE_URL}movie/lists/${listId}/`, {
            method: 'GET',
            headers: {
                'Authorization': `JWT ${jwtAccess}`,
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            setMovies(data.movies);  // Update the state with the movies from the list
            handleFilterMovies();    // Immediately apply filters and sorting once movies are fetched
        })
        .catch(error => {
            console.error('Error fetching list:', error);
            setIsLoading(false);
        });
    };

    const handleFilterMovies = () => {
        const filterCriteria = {
            list_id: listId,
            start_date: "1900",
            end_date: "2023",
            genres: selectedGenres,
            sort_by: sortMethod // Include the selected sorting method in the filter criteria
        };

        fetch(`${import.meta.env.VITE_BASE_URL}movie/movie-lists/${listId}/filter/`, {
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

    const handleSortChange = (method) => {
        setSortMethod(method); // Update the sort method and re-fetch & filter movies
    };

    const handleGenreChange = (genre) => {
        if (selectedGenres.includes(genre)) {
            setSelectedGenres(selectedGenres.filter(g => g !== genre));  // Remove genre
        } else {
            setSelectedGenres([...selectedGenres, genre]);  // Add genre
        }
    };

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

    const renderSortOptions = () => (
        <div>
            <h3>Sort by:</h3>
            {sortOptions.map(option => (
                <label key={option}>
                    <input
                        type="radio"
                        name="sortMethod"
                        value={option}
                        checked={sortMethod === option}
                        onChange={() => handleSortChange(option)}
                    />
                    {option}
                </label>
            ))}
        </div>
    );

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

    const moviesToDisplay = Array.isArray(filteredMovies) ? filteredMovies : movies;

    return (
        <div>
            <ProgramNavbar />
            {renderGenreOptions()}  {/* Render the genre filter options */}
            {renderSortOptions()}   {/* Render the sorting options */}
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
