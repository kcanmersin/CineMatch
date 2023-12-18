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
    const { username } = useContext(UserContext)

    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => {
        setShowModal(true);
    };
    
    const handleCloseModal = () => {
        setShowModal(false);
    };

    // TODO : poster pathi ayarla
    const UserPoints= "9.9";
    const MovieScene= "https://hips.hearstapps.com/hmg-prod/images/american-actors-marlon-brando-and-al-pacino-on-the-set-of-news-photo-1578503843.jpg?crop=1.00xw:0.756xh;0,0.0556xh&resize=1200:*";
    
    /*const MoviePoster= "src/assets/dummyPoster.jpg";
    const MovieScene= "src/assets/dummy1.jpg";
    const MovieName= "The Shining";
    const MovieYear= "1980";
    const MovieDesc= "A family heads to an isolated hotel for the winter where a sinister presence influences the father into violence, while his psychic son sees horrific forebodings from both past and future.";
    const MoivePoints= "8.8";
    
    const Length= "180"
    const Writers= ["Stanley Kubrick", "Stanley Kubrick"];
    const Actors= ["Diyar İsi", "Fatih Sultan Mehmet"];
    const Genres= ["Horror", "Crime"];
    const similarMoives = [
        { id: 1, name: "The Curious Case of Benjamin Button", image: "src/assets/dummyPoster.jpg", date: "1980" },
        { id: 2, name: "The Shining", image: "src/assets/dummyPoster.jpg", date: "1980" },
        { id: 3, name: "The Shining", image: "src/assets/dummyPoster.jpg", date: "1980" },
        { id: 4, name: "The Shining", image: "src/assets/dummyPoster.jpg", date: "1980" },
        { id: 5, name: "The Shining", image: "src/assets/dummyPoster.jpg", date: "1980" },
    ];
    const amountOfComments= "1071";
    const comments= [
        { id: 1, name: "torlak", image: "src/assets/pp.jpg", rating: "0.2", content: "Literally the worst movie ever. I’ve never understood what people find in this movie. It’s all about long and boring dialogues that points to nowhere. No action whatsoever. Gave up after that silly wedding ceremony scene.",
            replies: [{id: 1, name: "torlak", image: "src/assets/pp.jpg", rating: "0.2", content: "A masterclass in film making, is The Godfather a contender for the best film of all time? I'd argue the case that it is, this is the ultimate gangster movie.",}]},
        { id: 2, name: "riza", image: "src/assets/pp.jpg", rating: "8.8",  content: "Me see godfather me give 10",
            replies: [{id: 1, name: "torlak", image: "src/assets/pp.jpg", rating: "0.2", content: "A masterclass in film making, is The Godfather a contender for the best film of all time? I'd argue the case that it is, this is the ultimate gangster movie.",}]},
        { id: 3, name: "ADAM_ADAM", image: "src/assets/pp.jpg", rating: "9.9", content: "A masterclass in film making, is The Godfather a contender for the best film of all time? I'd argue the case that it is, this is the ultimate gangster movie.", 
            replies: [{id: 1, name: "torlak", image: "src/assets/pp.jpg", rating: "0.2", content: "A masterclass in film making, is The Godfather a contender for the best film of all time? I'd argue the case that it is, this is the ultimate gangster movie.",}]},
        { id: 4, name: "kenan", image: "src/assets/pp.jpg", rating: "7.6", content: "A masterclass in film making, is The Godfather a contender for the best film of all time? I'd argue the case that it is, this is the ultimate gangster movie.",
            replies: []},
        { id: 5, name: "Tfal", image: "src/assets/pp.jpg", rating: "8.8", content: "A masterclass in film making, is The Godfather a contender for the best film of all time? I'd argue the case that it is, this is the ultimate gangster movie.",
            replies: []},
    ]

    const userList= [{id: 1, listName:"sjagd"}, {id: 2, listName:"sjdsfsdagd"}]*/

    const [movieData, setMovieData] = useState(null);
    const [comments, setComments] = useState([]);
    const [lists, setLists] = useState([]);
    const [userId, setUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const jwtAccess = localStorage.getItem('jwtAccess');
    const [lastUpdate, setLastUpdate] = useState(Date.now());
    const [userRating, setUserRating] = useState(0);
    const { movieId } = useParams();

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
            console.log(data);
            return fetch(data.comments.all_comment_link);
        })
        .then(response => response.json())
        .then(commentsData => {
            setComments(commentsData);
            console.log(commentsData);
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
                        <div className="name-and-date">{title} <span className="movie-date">({release_date})</span></div>
                        <div className="director-name">Directed by <span className="bold">{director}</span></div>
                    </div>
                </div>
            </div>
            <div className="rest-of-the-movie-page">
                <div className="movie-page-movie-details">
                    <p className="rating-data"><div className="voting-text">RATING:</div><div className="bold">{vote_average}</div></p>
                    <p className="rating-data"><div className="your-voting-text">YOUR RATING:</div><div className="bold">{UserPoints}</div></p>
                    <p><span className="bold">{runtime}</span><span className="lighter"> minutes</span></p>
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
                        <h2>Comments {comments.length}</h2>
                        <CommentSection comments={comments} onReplySubmit={onReplySubmit} onCommentSubmit={onCommentSubmit} />
                    </div>
                </div>
                
                <div className="movie-page-buttons-similars">
                    <Button variant="success"
                        onClick={handleShowModal}>
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
                        <h2>Similar Movies</h2>
                        <div className="similar-movies-list">
                            {similar_movies.map((movie) => (
                                <Link to={`/moviepage/${movie.movie_id}`} key={movie.movie_id}>
                                    <div className="similar-movie">
                                        <img src={movie.movie_poster_url} alt={movie.movie_title} />
                                        <p>{movie.movie_title}</p>
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