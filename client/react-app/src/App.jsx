import 'bootstrap/dist/css/bootstrap.min.css';
import FirstPage from "./Components/FirstPage"
import {Routes, Route} from "react-router-dom"
import SignupPage from "./Components/SignupPage"
import SigninPage from "./Components/SigninPage"
import MainPage from "./Components/MainPage"
import MoviePage from "./Components/MoviePage"
import ListsPage from './Components/ListsPage';

function App() {
    return(
      <Routes>
        <Route path="/" element={<FirstPage />}/>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/mainpage" element={<MainPage/>} />
        <Route path="/moviepagegodfather" element={<MoviePage/>} />
        <Route path="/mylist" element={<ListsPage/>} />
      
      </Routes>

    )
}

export default App
