import React, { useContext } from "react";
import CommentSection from "./SubComponents/CommentSection";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { UserContext } from "./UserContext";


export default function MoviePage(){
    const { username } = useContext(UserContext)

    // TODO : poster pathi ayarla
    const UserPoints= " NOT RATED";
    /*const MoviePoster= "src/assets/dummyPoster.jpg";
    const MovieScene= "src/assets/dummy1.jpg";
    const MovieName= "The Shining";
    const MovieYear= "1980";
    const MovieDirector= "Stanley Kubrick";
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
        })
        .catch(error => {
            console.error('Error adding movie to list:', error);
        });
    };



    const { title, poster_path, release_date, overview, vote_average, runtime, genres, cast, crew, similar_movies } = movieData;
    // Find the director in the crew array
    const director = crew.find(member => member.crew.role === "Director")?.crew.name;
    // Extracting actors' names
    const actorsNames = cast.map(actor => actor.actor_id.actor_name).join(", ");

    return (
        <div className="movie-page">
            {/*<div className="movie-details">
                <div className="movie-poster">
                    
                    <img src={"https://image.tmdb.org/t/p/w500/6CoRTJTmijhBLJTUNoVSUNxZMEI.jpg"} alt="Movie Poster" />
                </div>
                <div className="movie-info">
                    <h1>{title}</h1>
                    <p>{release_date}</p>
                    <p>{director}</p>
                    <p>{overview}</p>
                    <p>Points: {vote_average}</p>
                    <p>User Points: {UserPoints}</p>
                    <p>Length: {runtime} minutes</p>
                    <p>Actors: {actorsNames}</p>
                    <p>Genres: {genres.join(", ")}</p>
                </div>
    </div>*/}
                <select id="listSelector">
                    {lists.map(list => (
                        <option key={list.id} value={list.id}>{list.title}</option>
                    ))}
                </select>
                <Button variant="primary" onClick={() => handleAddToList(document.getElementById('listSelector').value)}>Add to List</Button>

            
            {/*<div className="similar-movies">
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
            <div className="comments-section">
                <h2>Comments {comments.length}</h2>
                <CommentSection comments={comments} onReplySubmit={onReplySubmit} onCommentSubmit={onCommentSubmit} />
            </div>
            {/*<div className="user-list">
                <h2>User List</h2>
                <ul>
                    {userList.map(({ id, listName }) => (
                        <li key={id}>{listName}</li>
                    ))}
                </ul>
            </div>*/}
        </div>
    );
    
}