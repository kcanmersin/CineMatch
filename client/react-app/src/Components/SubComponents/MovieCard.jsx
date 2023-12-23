/* eslint-disable react/prop-types */


const MovieCard = ({ id, poster_path, title, release_date }) => {
  // Function to capitalize the first character of each word in a string
  const capitalizeEveryWord = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div key={id} className="movie-card">
      <img
        src={"https://image.tmdb.org/t/p/original" + poster_path}
        alt={title}
        className="movie-card-image"
      />
      <div className="movie-card-body">
        <div className="movie-card-title">
          {capitalizeEveryWord(title)}({release_date})
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
