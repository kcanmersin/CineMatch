import React, { useState, useEffect, useContext } from "react";
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
  // TODO: her result için link koyulacak
  const user = useContext(UserContext);
  const { logout } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState({ movies: [], users: [] });

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
      const response = await fetch(`http://127.0.0.1:8000/movie/movie/search_bar/?search=${query}`);
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

  const displaySearchResults = () => {
    if (searchText.trim() === '') {
      return null; // Return null when there is no search text
    }
    const results = [];
    const { users, movies } = searchResults;

    // Add user results
    for (let i = 0; i < users.length && results.length < 5; i++) {
      results.push(
        <div className= "search-movie-result" key={'user-' + users[i].id}>
          <img className= "search-user-result-image" src={"http://127.0.0.1:8000" + users[i].profile.profile_picture} alt={users[i].username} />
          <div className="search-movie-result-text">User: {users[i].username}</div>
        </div>
      );
    }

    // Add movie results
    for (let i = 0; i < movies.length && results.length < 5; i++) {
      const title= movies[i].title.toUpperCase();
      results.push(
        <div className= "search-movie-result" key={'movie-' + movies[i].title}>
          <img  className= "search-movie-result-image" src={"https://image.tmdb.org/t/p/original" + movies[i].poster_path} alt={movies[i].title} />
          <div className="search-movie-result-text">
            <div className="search-movie-title">{title}</div>
            <div className="search-movie-date">({movies[i].release_date})</div>
          </div>
        </div>
      );
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
            onChange={handleSearchInput}
          />
          <Button variant="outline-info" className="navbar-button">Search</Button>
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
