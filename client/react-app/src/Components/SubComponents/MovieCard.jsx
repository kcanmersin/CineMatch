/* eslint-disable react/prop-types */

const MovieCard = ({ id, poster_path, title, release_date }) => (
  <div key={id} className="movie-card">
    <img src={poster_path} alt={title} className="movie-card-image" />
    <div className="movie-card-body">
      <div className="movie-card-title">{title}({release_date})</div>
    </div>
  </div>
);

export default MovieCard;