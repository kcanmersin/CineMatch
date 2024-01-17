import { useState, useEffect, useContext } from "react";
import debounce from 'lodash.debounce';
import { Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Image from 'react-bootstrap/Image';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { AuthContext } from "../../auth/AuthContext";
import { UserContext } from "../UserContext";
import "./ProgramNavbar.css";

export default function ProgramNavbar() {
  const user = useContext(UserContext);
  const { logout } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState({ movies: [], users: [] });
  const [firstSearchResult, setFirstSearchResult] = useState(null); 

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    document.getElementById('sidebar').style.visibility = sidebarOpen ? 'hidden' : 'visible';
  };

  const handleLogout = () => {
    logout();
  };

  const handleSearchInput = (event) => {
    const query = event.target.value;
    setSearchText(query);
    if (!query.trim()) {
      setSearchResults({ movies: [], users: [] }); // Clear results when query is empty
    }
  };

  const fetchSearchResults = async (query) => {
    if (!query.trim()) {
      setSearchResults({ movies: [], users: [] });
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}movie/movie/search_bar/?search=${query}`);
      const data = await response.json();
      setSearchResults({
        movies: Array.isArray(data.movies) ? data.movies : [],
        users: Array.isArray(data.users) ? data.users : []
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Use debounce to limit the number of API calls made while typing
  const debouncedSearch = debounce(fetchSearchResults, 300);

  useEffect(() => {
    debouncedSearch(searchText);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchText, debouncedSearch]);


  useEffect(() => {
    // Update the first search result when searchResults change
    if (searchResults.users.length > 0) {
      setFirstSearchResult(`/user/${searchResults.users[0].username}`);
    } else if (searchResults.movies.length > 0) {
      setFirstSearchResult(`/moviepage/${searchResults.movies[0].id}`);
    }
  }, [searchResults]);


  // Function to navigate to the first search result's page
  const navigateToFirstResult = () => {
    if (firstSearchResult) {
      window.location.href = firstSearchResult; // Redirect to the first result's URL
    }
  };

  // reset the search
  const resetSearch = () => {
    setSearchText('');
    setSearchResults({ movies: [], users: [] });
  };
  

  const displaySearchResults = () => {
    if (searchText.trim() === '') {
      return null; // Return null when there is no search text
    }
    const results = [];
    const { users, movies } = searchResults;
    // Filter out the current user from the users array
    const filteredUsers = users.filter(u => u.username !== user.username);

    // Check if there are no results
    if (filteredUsers.length === 0 && movies.length === 0) {
      return <div className="no-search-results">No results found</div>;
    }

    let isFirstResult = true; // flag for displaying first result as grey background

    // Add user results
    for (let i = 0; i < filteredUsers.length && results.length < 5; i++) {
      results.push(
        <Link to={`/user/${users[i].username}`} key={'user-' + users[i].id} onClick={resetSearch}>
          <div className="search-movie-result" style={isFirstResult ? { backgroundColor: 'grey' } : null}>
            <img className="search-user-result-image" src={import.meta.env.VITE_BASE_URL + filteredUsers[i].profile.profile_picture.slice(1)} alt={filteredUsers[i].username} />
            <div className="search-movie-result-text">User: {filteredUsers[i].username}</div>
          </div>
        </Link>
      );
      if (isFirstResult) isFirstResult = false;
    }

    // Add movie results
    for (let i = 0; i < movies.length && results.length < 5; i++) {
      const title = movies[i].title.toUpperCase();
      results.push(
        <Link to={`/moviepage/${movies[i].id}`} key={'movie-' + movies[i].title} onClick={resetSearch} >
          <div className="search-movie-result" style={isFirstResult ? { backgroundColor: 'grey' } : null}>
            <img className="search-movie-result-image" src={"https://image.tmdb.org/t/p/original" + movies[i].poster_path} alt={movies[i].title} />
            <div className="search-movie-result-text">
              <div className="search-movie-title">{title}</div>
              <div className="search-movie-date">({movies[i].release_date})</div>
            </div>
          </div>
        </Link>
      );
      if (isFirstResult) isFirstResult = false;
    }

    return results;
  };

  return (
    <div>
      <Navbar expand="lg" sticky="top" className="main-navbar flex-nowrap">
        <Navbar.Brand className= "mx-3 navbar-logo" style={{ color: '#CECECE' }}>
          <Link to="/mainpage" className="mx-3 navbar-logo" style={{ color: '#CECECE' }}>
            Logo
          </Link>
        </Navbar.Brand>
        <Form className="d-flex flex-grow-1 mx-4" inline>
          <FormControl
            type="text"
            placeholder="Search for movie..."
            className="mr-sm-2 flex-grow-1 navbar-search-bar"
            value={searchText}
            onChange={handleSearchInput}
          />
          <Button variant="outline-info" className="navbar-button" onClick={navigateToFirstResult}>Search</Button>
        </Form>
        <Nav.Link as={Link} to="/myprofile">
          <Image 
            className="mx-3 profile-photo"
            src={user.profilePictureUrl}
          />
        </Nav.Link>
        <Nav.Link as={Link} to="/myprofile" className="mx-1 navbar-username">
          <div style={{ color: '#CECECE' }}>{user.username}</div>
        </Nav.Link>
        <button className="side-menu-button mx-3" type="button" aria-label="Toggle Navigation" onClick={toggleSidebar}>
          <span className="navbar-toggler-icon"></span>
        </button>
      </Navbar>

      <div className="side-bar" id="sidebar">
        <Container className="sidebar-content">
          <Link to="/myprofile"><Row className="link-on-sidebar">PROFILE</Row></Link>
          <Link to="/mylists"><Row className="link-on-sidebar">MY LISTS</Row></Link>
          <Link to="/mystats"><Row className="link-on-sidebar">STATS</Row></Link>
          <Link to="/mainpage"><Row className="link-on-sidebar">LIGHT MODE</Row></Link>
          <Link to="/mainpage" onClick={handleLogout}><Row className="link-on-sidebar">LOG OUT</Row></Link>
        </Container>
      </div>

      <div className="search-results" style={{color:"white"}}>
        {displaySearchResults()}
      </div>
    </div>
  );
}
