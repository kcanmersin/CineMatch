import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MovieCard from './SubComponents/MovieCard';
import { BounceLoader } from 'react-spinners';  // Import the spinner

function FilterPage() {
    const { listId } = useParams();
    const [movies, setMovies] = useState([]);
    const [detailedMovies, setDetailedMovies] = useState({});
    const [loadingDetails, setLoadingDetails] = useState({});
    const [allMoviesLoaded, setAllMoviesLoaded] = useState(false);  // Track if all movies are loaded
    const jwtAccess = localStorage.getItem('jwtAccess');

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/movie/lists/${listId}/`, {
            method: 'GET',
            headers: {
                'Authorization': `JWT ${jwtAccess}`,
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            setMovies(data.movies);
            const initialLoadingState = data.movies.reduce((acc, movie) => {
                acc[movie.id] = true;  // Initialize loading state for each movie
                return acc;
            }, {});
            setLoadingDetails(initialLoadingState);
            fetchMovieDetails(data.movies);
        })
        .catch(error => {
            console.error('Error fetching list:', error);
        });
    }, [listId]);

    const fetchMovieDetails = (movies) => {
        const detailPromises = movies.map(movie => {
            return fetch(`http://127.0.0.1:8000/movie/movie/movies/${movie.id}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `JWT ${jwtAccess}`,
                    'Content-Type': 'application/json',
                },
            })
            .then(response => response.json())
            .catch(error => {
                console.error(`Error fetching details for movie ${movie.id}:`, error);
            });
        });

        Promise.all(detailPromises).then(detailsArray => {
            const newDetailedMovies = {};
            const newLoadingDetails = {};

            detailsArray.forEach(details => {
                if (details) {
                    newDetailedMovies[details.id] = details;
                    newLoadingDetails[details.id] = false;  // Set loading to false once the data is fetched
                }
            });

            setDetailedMovies(newDetailedMovies);
            setLoadingDetails(newLoadingDetails);
            setAllMoviesLoaded(true);  // Indicate that all movies are loaded
        });
    };

    return (
        <div>
            <h1>Filtered Movies</h1>
            {!allMoviesLoaded ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <BounceLoader color="#123abc" loading={true} />  {/* Centralized spinner */}
                </div>
            ) : (
                <ul>
                    {movies.map(movie => (
                        <li key={movie.id}>
                            {detailedMovies[movie.id] ? <MovieCard {...detailedMovies[movie.id]} /> : <div>Failed to load details</div>}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default FilterPage;
