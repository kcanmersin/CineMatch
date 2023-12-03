import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, useNavigate } from 'react-router-dom'; // Import useNavigate
import FirstPage from './Components/FirstPage';
import SignupPage from './Components/SignupPage';
import SigninPage from './Components/SigninPage';
import MainPage from './Components/MainPage';
import MoviePage from './Components/MoviePage';
import ListsPage from './Components/ListsPage';

import { useEffect, useState } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    // Retrieve the JWT token from localStorage
    const token = localStorage.getItem('jwtAccess');

    // Make a request to the backend for token validation
    if (token) {
      fetch('http://127.0.0.1:8000/auth/jwt/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })
        .then((response) => {
          if (response.ok) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            navigate('/signin'); // Use navigate to redirect to /signin
          }
        })
        .catch((error) => {
          setIsAuthenticated(false);
          console.error('Token validation failed:', error);
        });
    } else {
      setIsAuthenticated(false);
    }
  }, [navigate]); // Include navigate as a dependency

  return (
    <Routes>
      <Route path="/" element={<FirstPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/signin" element={<SigninPage />} />
      {isAuthenticated ? (
        <>
          <Route path="/mainpage" element={<MainPage />} />
          <Route path="/moviepagegodfather" element={<MoviePage />} />
          <Route path="/mylist" element={<ListsPage />} />
        </>
      ) : null}
    </Routes>
  );
}

export default App;
