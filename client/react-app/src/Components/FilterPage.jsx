import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MovieCard from './SubComponents/MovieCard';
import { BounceLoader } from 'react-spinners';
import ProgramNavbar from './SubComponents/ProgramNavbar';
import { Container } from 'react-bootstrap';

import './FilterPage.css'

function FilterPage() {
    const { listId } = useParams();
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedGenres, setSelectedGenres] = useState([]); // State to manage selected genres
    const [sortMethod, setSortMethod] = useState('popularity'); // State to manage sorting method
    const jwtAccess = localStorage.getItem('jwtAccess');

    const genreOptions = ["Action", "Drama", "Comedy", "Thriller", "Romance", "Science Fiction", "Animation", "War", "Crime", "Horror", "Fantasy"];
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
        <div className='genre-options-container'>
        <div className='genre-options'>
            {genreOptions.map(genre => (
                <button
                key={genre}
                className={selectedGenres.includes(genre) ? 'selected' : ''}
                onClick={() => handleGenreChange(genre)}
              >
                {genre}
              </button>
            ))}
        </div>
            <button className= 'apply-filters-button' onClick={handleFilterMovies}>Apply Filters</button>
        </div>
    );

    const formatSortOption = (option) => {
        return option
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };
    


    const renderSortOptions = () => (
        <div className='genre-options sort-options'>
          <div className='sorted-by-text'>Sorted by</div>
          {sortOptions.map(option => (
            <button
              key={option}
              className={sortMethod === option ? 'selected' : ''}
              onClick={() => handleSortChange(option)}
              style={{ margin: '0.5rem', cursor: 'pointer', backgroundColor: sortMethod === option ? '#28a745' : 'transparent', color: sortMethod === option ? '#cecece' : 'rgba(206,206,206,0.5);' }}
            >
              {formatSortOption(option)}
            </button>
          ))}
        </div>
      );

    if (isLoading) {
        return (
            <div className='main-page'>
                <ProgramNavbar />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <BounceLoader color="#123abc" loading={true} />
                </div>
            </div>
        );
    }

    const moviesToDisplay = Array.isArray(filteredMovies) ? filteredMovies : movies;

    return (
        <div className='main-page'>
            <ProgramNavbar />
            <div className='page-content'>
                <div className='filer-sort-container'>
                {renderSortOptions()}   {/* Render the sorting options */}
                {renderGenreOptions()}  {/* Render the genre filter options */}
                </div>
                <Container className='movie-container'>
                    {moviesToDisplay.map((movie) => (
                      
                            <Link to={`/moviepage/${movie.id}`} key={movie.id}>
                                <MovieCard {...movie} />
                            </Link>
                    ))}
                </Container>
            </div>
        </div>
    );
}

export default FilterPage;
