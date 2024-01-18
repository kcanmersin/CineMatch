import React, { useContext, useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import { UserContext } from './UserContext';
import ProgramNavbar from './SubComponents/ProgramNavbar';
import CommentSection from './SubComponents/CommentSection';
import { BounceLoader } from 'react-spinners';
import { Form } from 'react-bootstrap';
import './MoviePage.css';

export default function MoviePage() {
    const { username } = useContext(UserContext);
    const { movieId } = useParams();
    const [showModal, setShowModal] = useState(false);
    const [userRate, setUserRate] = useState('Not rated');
    const [rateId, setRateId] = useState(null);
    const [hasRated, setHasRated] = useState(false);
    const [movieData, setMovieData] = useState(null);
    const [comments, setComments] = useState([]);
    const [lists, setLists] = useState([]);
    const [userId, setUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userRating, setUserRating] = useState(0);
    const jwtAccess = localStorage.getItem('jwtAccess');
    const [lastUpdate, setLastUpdate] = useState(Date.now());
    const [showRatingModal, setShowRatingModal] = useState(false);
        

    const fetchMovieData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}movie/movie/movies/${movieId}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `JWT ${jwtAccess}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setMovieData(data);

            if (data.rate_by_current_user) {
                setUserRate(data.rate_by_current_user.rate_point);
                setRateId(data.rate_by_current_user.rate_id);
                setHasRated(true);
            } else {
                setUserRate("Not rated");
                setHasRated(false);
            }

            const commentsResponse = await fetch(data.comments.all_comment_link);
            const commentsData = await commentsResponse.json();
            setComments(commentsData);
        } catch (error) {
            console.error("Error fetching movie data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMovieData();
    }, [movieId, lastUpdate]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}auth/users/me/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `JWT ${jwtAccess}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                setUserId(data.id);
                const listsResponse = await fetch(`${import.meta.env.VITE_BASE_URL}movie/lists/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `JWT ${jwtAccess}`,
                        'Content-Type': 'application/json',
                    },
                });
                const listsData = await listsResponse.json();
                // Revised filter condition
                const userLists = listsData.filter(list => list.user === userId && !list.movies.some(movie => movie.id === +movieId));
                setLists(userLists);
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchUserData();
    }, [userId, jwtAccess, movieId]);
    

    const handleRatingSubmit = async (rating) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}movie/rate_list/${movieId}/rates/`, {
                method: 'POST',
                headers: {
                    'Authorization': `JWT ${jwtAccess}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: username, rate_point: parseFloat(rating) }),
            });

            if (response.ok) {
                const data = await response.json();
                setUserRate(data.rate_point);
                setRateId(data.id);
                setHasRated(true);
                setLastUpdate(Date.now());
                console.log('Rating submitted successfully:', data);
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error submitting rating:', error);
        }
    };

    const handleUpdateRating = async (newRating) => {
        if (!rateId) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}movie/rate_list/${movieId}/rates/${rateId}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `JWT ${jwtAccess}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rate_point: parseFloat(newRating) }),
            });

            if (response.ok) {
                const data = await response.json();
                setUserRate(data.rate_point);
                setLastUpdate(Date.now());
                console.log('Rating updated successfully:', data);
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error updating rating:', error);
        }
    };

    const handleRemoveRating = async () => {
        if (!rateId) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}movie/rate_list/${movieId}/rates/${rateId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `JWT ${jwtAccess}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setUserRate('Not rated');
                setRateId(null);
                setHasRated(false);
                setLastUpdate(Date.now());
                console.log('Rating removed successfully');
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error removing rating:', error);
        }
    };

    // Function to handle reply submission
    const onReplySubmit = (replyText, parentCommentId) => {
        const replyData = {
            // structure the reply data as needed for your backend
            username: username,
            text: replyText,
            parent_comment: parentCommentId,
        };

        fetch(`${import.meta.env.VITE_BASE_URL}movie/comment_list/${movieId}/`, {
            method: 'POST',
            headers: {
                'Authorization': `JWT ${jwtAccess}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(replyData)
        })
        .then(response => response.json())
        .then(data => {
            setLastUpdate(Date.now());
            // Update your comments state or handle the UI update as needed
        })
        .catch(error => {
            console.error('Error submitting reply:', error);
        });
    };

    // new comment 
    const onCommentSubmit = (commentText) => {
        const commentData = {
            username: username,
            text: commentText,
            parent_comment: null, // null for a top-level comment
        };

        fetch(`${import.meta.env.VITE_BASE_URL}movie/comment_list/${movieId}/`, {
            method: 'POST',
            headers: {
                'Authorization': `JWT ${jwtAccess}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(commentData)
        })
        .then(response => response.json())
        .then(data => {
            setLastUpdate(Date.now());
            //console.log('Comment submitted:', data);
            // Update your comments state with the new comment
        })
        .catch(error => {
            console.error('Error submitting comment:', error);
        });
    };

    // Function to handle adding a movie to a list
    const handleAddToList = (listId) => {
        if (!listId) {
            alert("Please select a list.");
            return;
        }


        const url = `${import.meta.env.VITE_BASE_URL}movie/movie-lists/`;

        const requestData = {
            movie_list_id: listId,
            movie_id: movieId,
        };

        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `JWT ${jwtAccess}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
        .then(response => {
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            // Handle no-content responses
            if (response.headers.get("content-length") === "0" || response.status === 204) {
                return null;
            } else {
                return response.json();
            }
        })
        .then(data => {
            console.log('Movie added to list:', data);
            // Here, handle any updates to the state or UI after successful addition
            handleCloseModal();
        })
        .catch(error => {
            console.error('Error adding movie to list:', error);
        });
    };

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
      
    if (isLoading || !movieData) {
        return (
            <div className="main-page">
                <ProgramNavbar />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <BounceLoader color="#123abc" loading={true} size={150} />
                </div>
            </div>
        );

    }
    

    const { title, poster_path, release_date, overview, vote_average, runtime, genres, cast, crew, similar_movies } = movieData;
    // convert runtime into hour and minutes
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;


    
    return (
        <div className="main-page">
            <ProgramNavbar/>
            <div className= "best-match-movie">
                <div className= "best-match-movie-poster">
                    <img
                        src={"https://image.tmdb.org/t/p/original" + poster_path}
                        alt="First Image"
                        className="best-match-movie-poster-image"
                    />
                </div>
                <div className= "best-match-movie-scene" style={{
                    backgroundImage: `linear-gradient(0deg, #0A1421 5%, rgba(0, 0, 0, 0.00) 100%),url(${"https://image.tmdb.org/t/p/original" + movieData.background_path})`,
                    backgroundPosition: 'center center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                }}>
                    <div className="movie-title-director">
                        <div className="name-and-date">{title.toUpperCase()} <span className="movie-date">({release_date})</span></div>
                        <div className="director-name">
                        Directed by {
                            crew.filter(crewMember => crewMember.crew.role === "Directing")
                                .map((crewMember, index, filteredArray) => (
                                    <span key={index} className="bold">
                                        {crewMember.crew.name}
                                        {index !== filteredArray.length - 1 ? ', ' : ''}
                                    </span>
                                ))
                        }
                        </div>
                    </div>
                </div>
            </div>
            <div className="rest-of-the-movie-page">
                <div className="movie-page-movie-details">
                    <p className="rating-data"><div className="voting-text">RATING:</div><div className="bold">{parseFloat(vote_average).toFixed(1)}</div></p>
                    <p className="rating-data"><div className="your-voting-text">YOUR RATING:</div><div className="bold">{userRate}</div></p>
                    <p>
                        <span className="bold">{hours}</span><span className="lighter"> hours </span>
                        <span className="bold">{minutes}</span><span className="lighter"> minutes</span>
                    </p>
                    <div>
                        <p className="starring bold">STARRING</p>
                        <p className="lighter">
                            {cast.map((actor, index) => (
                                <span key={index}>
                                    {actor.actor_id.actor_name}
                                    {index !== cast.length - 1 ? <br /> : ''}
                                </span>
                            ))}
                        </p>
                    </div>

                </div>
                <div className="movie-page-desc-comments">
                    <div className="genre-buttons">
                        {genres.map((genre, index) => (
                            <button key={index} className="genre-button">{genre}</button>
                        ))}
                    </div>
                    <p style={{color: "#cecece", marginBottom: "5rem"}}>{overview}</p>
                    <div className="comments-section">
                        <h2 className="comment-amount">{comments.length} COMMENTS</h2>
                        <CommentSection comments={comments} onReplySubmit={onReplySubmit} onCommentSubmit={onCommentSubmit} />
                    </div>
                </div>
                <div className="movie-page-buttons-similars">
                    <div className='movie-page-buttons'>
                    <Button variant="success"
                        onClick={handleShowModal}
                        className="add-to-a-list-button">
                        Add to a List
                    </Button>
                    <Button variant="success" onClick={() => setShowRatingModal(true)} className="add-to-a-list-button rate-button">
                        {hasRated ? 'Rated' : 'Rate'}
                    </Button>
                    </div>
                    <div className="similar-movies">
                        <div className="movies-like-text">Movies like <span className="bold">{title.split(' ')
                                                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                                            .join(' ')}</span>
                        </div>
                        <div className="similar-movies-list">
                            {similar_movies.map((movie) => (
                                <Link to={`/moviepage/${movie.movie_id}`} key={movie.movie_id}>
                                    <div className="similar-movie">
                                        <img className="similar-movie-poster" src={"https://image.tmdb.org/t/p/original" + movie.movie_poster_url} alt={movie.movie_title} />
                                        <p className="similar-movie-title">
                                        {movie.movie_title
                                            .split(' ')
                                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                            .join(' ')}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={showRatingModal} onHide={() => setShowRatingModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Rate this Movie</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="ratingInput">
                            <Form.Control
                                type="number"
                                min="0"
                                max="10"
                                step="0.1"
                                value={userRating}
                                onChange={(e) => setUserRating(e.target.value)}
                            />
                        </Form.Group>
                        <Modal.Footer className= "modal-footer">
                            {hasRated ? (
                                <>
                                    <Button variant="primary" onClick={() => handleUpdateRating(userRating)}>
                                        Update Rating
                                    </Button>
                                    <Button variant="danger" onClick={handleRemoveRating}>
                                        Remove Rating
                                    </Button>
                                </>
                            ) : (
                                <Button variant="primary" onClick={() => handleRatingSubmit(userRating)}>
                                    Submit Rating
                                </Button>
                            )}
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
                    <Modal show={showModal} onHide={handleCloseModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>LISTS</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="list-select-modal-body">
                            <select id="listSelector">
                                {lists.map((list) => {
                                    let displayTitle;
                                    if (list.title === 'watchlist') {
                                        displayTitle = 'WatchList';
                                    } else if (list.title === 'watched_movies') {
                                        displayTitle = 'Watched Movies';
                                    } else {
                                        displayTitle = list.title; // Default to the original title
                                    }

                                    return (
                                        <option key={list.id} value={list.id}>
                                            {displayTitle}
                                        </option>
                                    );
                                })}
                            </select>
                            <Button
                                variant="primary"
                                className="add-button"
                                onClick={() => handleAddToList(document.getElementById('listSelector').value)}
                            >
                                Add
                            </Button>
                        </Modal.Body>
            </Modal>
        </div>
    );
    
}