import React, { useContext } from "react";
import CommentSection from "./SubComponents/CommentSection";
import {Button, Modal} from "react-bootstrap";
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { UserContext } from "./UserContext";
import ProgramNavbar from "./SubComponents/ProgramNavbar";
import "./MoviePage.css"


export default function MoviePage(){
    // TODO: Rate will be displayed
    const { username } = useContext(UserContext)
    const [showModal, setShowModal] = useState(false);
    const [userRate, setUserRate] = useState("Not rated");
    const [movieData, setMovieData] = useState(null);
    const [comments, setComments] = useState([]);
    const [lists, setLists] = useState([]);
    const [userId, setUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const jwtAccess = localStorage.getItem('jwtAccess');
    const [lastUpdate, setLastUpdate] = useState(Date.now());
    const [userRating, setUserRating] = useState(0);
    const { movieId } = useParams();


    const handleShowModal = () => {
        setShowModal(true);
    };
    
    const handleCloseModal = () => {
        setShowModal(false);
    };

    // logic part
    useEffect(() => {
        fetch(`http://127.0.0.1:8000/movie/movie/movies/${movieId}/`, {
            method: 'GET',
            headers: {
                'Authorization': `JWT ${jwtAccess}`,
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(data => {
            setMovieData(data);
            return fetch(data.comments.all_comment_link);
        })
        .then(response => response.json())
        .then(commentsData => {
            setComments(commentsData);

        })
        .catch(error => {
            console.error("Error fetching data: ", error);
        });
    }, [movieId, lastUpdate]);

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
        })
        .catch(error => {
          console.error('Error:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
      }, [userId, jwtAccess]);


    if (!movieData) {
        return <div>Loading...</div>;
    }


    // Function to handle reply submission
    const onReplySubmit = (replyText, parentCommentId) => {
        const replyData = {
            // structure the reply data as needed for your backend
            username: username,
            text: replyText,
            parent_comment: parentCommentId,
        };

        fetch(`http://127.0.0.1:8000/movie/comment_list/${movieId}/`, {
            method: 'POST',
            headers: {
                'Authorization': `JWT ${jwtAccess}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(replyData)
        })
        .then(response => response.json())
        .then(data => {
            //console.log('Reply submitted:', data);
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

        fetch(`http://127.0.0.1:8000/movie/comment_list/${movieId}/`, {
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


        const url = `http://127.0.0.1:8000/movie/movie-lists/`;

        const requestData = {
            movie_list_id: listId,
            movie_id: movieId, // Ensure this matches the expected format of your backend
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

    const handleRatingSubmit = (rating) => {
        // Create the rating data to send to the server
        const ratingData = {
          username: username, // Replace with the actual movie ID
          rate_point: parseFloat(rating), // Convert the rating to a number if needed
        };
      
        // Send the rating data to the server
        fetch(`http://127.0.0.1:8000/movie/rate_list/${movieId}/rates/`, {
          method: 'POST',
          headers: {
            'Authorization': `JWT ${jwtAccess}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(ratingData)
        })
        .then(response => {
          if (response.ok) {
            // Rating submitted successfully, you can handle UI updates here if needed
            console.log('Rating submitted successfully');
          } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
        })
        .catch(error => {
          console.error('Error submitting rating:', error);
        });
      };
      



    const { title, poster_path, release_date, overview, vote_average, runtime, genres, cast, crew, similar_movies } = movieData;
    // convert runtime into hour and minutes
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    // Find the director in the crew array
    const director = "Stanley Kubrick"; //crew.find(member => member.crew.role === "Director")?.crew.name;
    // Extracting actors' names
    const actorsNames = ["Daniel Daniel\nKarambit\nTuco Benedicto Pacífico Juan María Ramírez"]//cast.map(actor => actor.actor_id.actor_name).join(", ");

    return (
        <div className="main-page">
            <ProgramNavbar/>
            <div className= "best-match-movie">
                <div className= "best-match-movie-poster">
                    <img
                        src={"https://image.tmdb.org/t/p/original" + movieData.poster_path}
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
                        <div className="director-name">Directed by <span className="bold">{director}</span></div>
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
                    <div><p className="starring bold">STARRING</p><p className="lighter">{actorsNames}</p></div>
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
                    <Button variant="success"
                        onClick={handleShowModal}
                        className="add-to-a-list-button">
                        Add to a List
                    </Button>
                    <div className="rating-section">
  <h2>Rate This Movie</h2>
  <div className="user-rating">
    <p>Your Rating:</p>
    <input
      type="number"
      min="0"
      max="10"
      step="0.1"
      value={userRating}
      onChange={(e) => setUserRating(e.target.value)}
    />
    <button onClick={() => handleRatingSubmit(userRating)}>Submit</button>
  </div>
</div>
                    <Modal show={showModal} onHide={handleCloseModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>LISTS</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className= "list-select-modal-body">
                            <select id="listSelector">
                                {lists.map((list) => (
                                    <option key={list.id} value={list.id}>
                                        {list.title}
                                    </option>
                                ))}
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
                    <div className="similar-movies">
                        <div className="movies-like-text">Movies like <span className="bold">{title}</span></div>
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
        </div>
    );
    
}