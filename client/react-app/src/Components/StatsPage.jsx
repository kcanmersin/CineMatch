import './StatsPage.css'
import React, { useContext, useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import 'chartjs-plugin-datalabels';
import { UserContext } from "./UserContext";
import MovieRatingsChart from './SubComponents/MovieRatingsChart';
import GenreBreakdownChart from './SubComponents/GenreBreakdownChart';
import MoviesPerYearChart from  './SubComponents/MoviesPerYearChart';
import ProgramNavbar from './SubComponents/ProgramNavbar';
import { BounceLoader } from 'react-spinners';
import { useParams } from 'react-router-dom';

// Register the required components for both bar and line charts
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);
export default function StatsPage() {
    const { username } = useParams();
    const [userData, setUserData] = useState({});
    const [genreBreakdown, setGenreBreakdown] = useState([]);
    const [moviesPerYear, setMoviesPerYear] = useState([]);
    const [movieRatingsDistribution, setMovieRatingsDistribution] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const jwtAccess = localStorage.getItem('jwtAccess');
        const fetchStats = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_BASE_URL}accounts/profile/${username}/stats/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `JWT ${jwtAccess}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setUserData(data);  // Store all user data
                setGenreBreakdown(data.genre_breakdown);
                setMoviesPerYear(data.movies_per_year);
                setMovieRatingsDistribution(processMovieRatings(data.all_movie_ratings));
            } catch (e) {
                console.error("Failed to fetch stats:", e);
                setError(e);
            } finally {
                setIsLoading(false);
            }
        };

        if (username && username !== "Loading...") {
            fetchStats();
        }
    }, [username]);

    const processMovieRatings = (allRatings) => {
        const distribution = {
            '0-2': 0,
            '2-4': 0,
            '4-6': 0,
            '6-8': 0,
            '8-10': 0
        };
    
        allRatings.forEach(rating => {
            const rate = rating.rate_point;
            if(rate <= 2) distribution['0-2']++;
            else if(rate <= 4) distribution['2-4']++;
            else if(rate <= 6) distribution['4-6']++;
            else if(rate <= 8) distribution['6-8']++;
            else distribution['8-10']++;
        });
    
        return distribution;
    };

    const formatHoursToHoursMinutes = (hours) => {
        const hrs = Math.floor(hours);
        const mins = Math.round((hours - hrs) * 60);
        return `${hrs} hours ${mins} minutes`;
    };

    if (isLoading) {
        return (
          <div className='main-page'>
            <ProgramNavbar />
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              <BounceLoader color="#123abc" loading={isLoading} />
            </div>
          </div>
        );
      }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className='main-page'>
            <ProgramNavbar />
            <div className='stats-page'>
            <div className='user-info'>
                <img className= "stats-user-profile-image"src={userData.profile_photo_url} alt={`${username}'s profile`} />
                <div className='stats-page-user-name'>{username}</div>
                <div className='stats-page-user-info'>{userData.watched_movie_count}<span className='faint-text'> WATCHED MOVIES</span></div>
                <div className='stats-page-user-info'>{userData.follower_count}<span className='faint-text'> FOLLOWERS</span></div>
                <div className='stats-page-user-info'>{userData.following_count}<span className='faint-text'> FOLLOWINGS</span></div>
                <div className='stats-page-user-info'><span className='faint-text'>Member Since</span><span className='right-aligned'>   {new Date(userData.signed_up_since).toLocaleDateString()}</span></div>
                <div className='stats-page-user-info'><span className='faint-text'>Total Hours Watched</span><span className='right-aligned'>   {formatHoursToHoursMinutes(userData.total_hours_watched)}</span></div>
                <div className='stats-page-user-info'><span className='faint-text'>Average Time per Movie</span><span className='right-aligned'>  {formatHoursToHoursMinutes(userData.average_time_per_movie)}</span></div>
                <div className='stats-page-user-info'><span className='faint-text'>Favorite Genre</span><span className='right-aligned'>{userData.favorite_genre?.genre__genre_name}</span></div>
                <div className='stats-page-user-info'><span className='faint-text'>Average Rating</span><span className='right-aligned'>{userData.average_rating}</span></div>
            </div>
            <div className='graphs'>
            <MovieRatingsChart movieRatingsDistribution={movieRatingsDistribution} />
            <GenreBreakdownChart genreBreakdown={genreBreakdown} />
            <MoviesPerYearChart moviesPerYear={moviesPerYear} />
            </div>
            </div>
        </div>
        
    );
}
