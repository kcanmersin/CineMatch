// App.js
import { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthContext } from './auth/AuthContext'; // Import AuthContext and AuthProvider
import 'bootstrap/dist/css/bootstrap.min.css';
import FirstPage from './Components/FirstPage';
import SignupPage from './Components/SignupPage';
import SigninPage from './Components/SignInPage';
import MainPage from './Components/MainPage';
import MyListsPage from './Components/MyListsPage';
import MyProfilePage from './Components/MyProfilePage';
import UserPage from './Components/UserPage';
import ListsPage from './Components/ListsPage';
import PrivateRoute from './auth/PrivateRoute';
import MoviePage from './Components/MoviePage';
import MatchedPeoplePage from './Components/MatchedPeoplePage';
import FilterPage from './Components/FilterPage';
import MyStatsPage from './Components/MyStatsPage';
import StatsPage from './Components/StatsPage';
import MyFollowersPage from './Components/MyFollowersPage';
import MyFollowingsPage from './Components/MyFollowingsPage';
import UserFollowersPage from './Components/UserFollowersPage';
import UserFollowingsPage from './Components/UserFollowingsPage';
import { UserProvider } from './Components/UserContext';
import ResetPassword from './Components/ResetPassword';


export default function App() {
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <UserProvider>
            <Routes>
                <Route path="/" element={<FirstPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/signin" element={<SigninPage isAuthenticated={isAuthenticated} />} />
                <Route path="/mainpage" element={<PrivateRoute isAuthenticated={isAuthenticated}><MainPage /></PrivateRoute>} />
                <Route path="/mylists" element={<PrivateRoute isAuthenticated={isAuthenticated}><MyListsPage /></PrivateRoute>} />
                <Route path="/myprofile" element={<PrivateRoute isAuthenticated={isAuthenticated}><MyProfilePage /></PrivateRoute>} />
                <Route path="/user/:username" element={<PrivateRoute isAuthenticated={isAuthenticated}><UserPage /></PrivateRoute>} />
                <Route path="/user/:username/lists" element={<PrivateRoute isAuthenticated={isAuthenticated}><ListsPage /></PrivateRoute>} />
                <Route path="/moviepage/:movieId" element={<PrivateRoute isAuthenticated={isAuthenticated}><MoviePage /></PrivateRoute>} />
                <Route path="/matchedpeople" element={<PrivateRoute isAuthenticated={isAuthenticated}><MatchedPeoplePage /></PrivateRoute>} />
                <Route path="/mylists/:listId" element={<PrivateRoute isAuthenticated={isAuthenticated}><FilterPage /></PrivateRoute>} />
                <Route path="/user/:username/lists/:listId" element={<PrivateRoute isAuthenticated={isAuthenticated}><FilterPage /></PrivateRoute>} />
                <Route path="/mystats" element={<PrivateRoute isAuthenticated={isAuthenticated}><MyStatsPage /></PrivateRoute>} />
                <Route path="/user/:username/stats" element={<PrivateRoute isAuthenticated={isAuthenticated}><StatsPage /></PrivateRoute>} />
                <Route path="/myfollowers" element={<PrivateRoute isAuthenticated={isAuthenticated}><MyFollowersPage /></PrivateRoute>} />
                <Route path="/myfollowings" element={<PrivateRoute isAuthenticated={isAuthenticated}><MyFollowingsPage /></PrivateRoute>} />
                <Route path="/user/:username/followers" element={<PrivateRoute isAuthenticated={isAuthenticated}><UserFollowersPage /></PrivateRoute>} />
                <Route path="/user/:username/followings" element={<PrivateRoute isAuthenticated={isAuthenticated}><UserFollowingsPage /></PrivateRoute>} />
                <Route path="/resetpassword" element={<ResetPassword />} />
            </Routes>
        </UserProvider>
      
    );
}


