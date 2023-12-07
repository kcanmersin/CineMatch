// App.js
import { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthContext } from './auth/AuthContext'; // Import AuthContext and AuthProvider
import 'bootstrap/dist/css/bootstrap.min.css';
import FirstPage from './Components/FirstPage';
import SignupPage from './Components/SignupPage';
import SigninPage from './Components/SigninPage';
import MainPage from './Components/MainPage';
import ListsPage from './Components/ListsPage';
import PrivateRoute from './auth/PrivateRoute';

export default function App() {
    const { isAuthenticated } = useContext(AuthContext);

    return (

        <Routes>
            <Route path="/" element={<FirstPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/signin" element={<SigninPage isAuthenticated={isAuthenticated} />} />
            <Route path="/mainpage" element={<PrivateRoute isAuthenticated={isAuthenticated}><MainPage /></PrivateRoute>} />
            <Route path="/mylist" element={<PrivateRoute isAuthenticated={isAuthenticated}><ListsPage /></PrivateRoute>} />
        </Routes>
      
    );
}


