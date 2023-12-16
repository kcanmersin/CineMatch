import React from "react";
import CommentSection from "./SubComponents/CommentSection";
import Button from "react-bootstrap/Button";

export default function MoviePage(){

    const MoviePoster= "src/assets/dummyPoster.jpg";
    const MovieScene= "src/assets/dummy1.jpg";
    const MovieName= "The Shining";
    const MovieYear= "1980";
    const MovieDirector= "Stanley Kubrick";
    const MovieDesc= "A family heads to an isolated hotel for the winter where a sinister presence influences the father into violence, while his psychic son sees horrific forebodings from both past and future.";
    const MoivePoints= "8.8";
    const UserPoints= " NOT RATED";
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

    const userList= [{id: 1, listName:"sjagd"}, {id: 2, listName:"sjdsfsdagd"}]

    return (
        <div className="movie-page">
            <div className="movie-details">
                <div className="movie-poster">
                    <img src={MoviePoster} alt="Movie Poster" />
                </div>
                <div className="movie-info">
                    <h1>{MovieName}</h1>
                    <p>{MovieYear}</p>
                    <p>{MovieDirector}</p>
                    <p>{MovieDesc}</p>
                    <p>Points: {MoivePoints}</p>
                    <p>User Points: {UserPoints}</p>
                    <p>Length: {Length} minutes</p>
                    <p>Writers: {Writers.join(", ")}</p>
                    <p>Actors: {Actors.join(", ")}</p>
                    <p>Genres: {Genres.join(", ")}</p>
                </div>
            </div>
            <div className="similar-movies">
                <h2>Similar Movies</h2>
                <div className="similar-movies-list">
                    {similarMoives.map((movie) => (
                        <div key={movie.id} className="similar-movie">
                            <img src={movie.image} alt={movie.name} />
                            <p>{movie.name}</p>
                            <p>{movie.date}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="comments-section">
                <h2>Comments ({amountOfComments})</h2>
                <CommentSection comments={comments} />
            </div>
            <div className="user-list">
                <h2>User List</h2>
                <ul>
                    {userList.map(({ id, listName }) => (
                        <li key={id}>{listName}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
    
}