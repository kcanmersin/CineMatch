import React from "react";

const MovieCard = ({ id, name, image, date }) => (
  <div key={id} className="movie-card">
    <img src={image} alt={name} className="movie-card-image" />
    <div className="movie-card-body">
      <div className="movie-card-title">{name}({date})</div>
    </div>
  </div>
);

export default MovieCard;