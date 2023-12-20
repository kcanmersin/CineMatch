import React, { useState, useEffect } from "react";
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
import Col from 'react-bootstrap/Col';
import { AuthContext } from "../../auth/AuthContext";
import { useContext } from 'react';
import { UserContext } from "../UserContext";
import "./ProgramNavbar.css";

export default function ProgramNavbar() {
  const user = useContext(UserContext);
  const { logout } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    document.getElementById('sidebar').style.visibility = sidebarOpen ? 'hidden' : 'visible';
  };

  const handleLogout = () => {
      logout();
  };

  const handleSearchInput = (event) => {
    setSearchText(event.target.value);
  };

  const fetchSearchResults = (query) => {
    fetch(`http://127.0.0.1:8000/movie/movie/search_bar/?search=${query}`)
      .then(response => response.json())
      .then(data => {
        setSearchResults(data.movies);
      })
      .catch(error => console.error('Error:', error));
  };

  const debouncedSearch = debounce(() => {
    fetchSearchResults(searchText);
  }, 500);

  useEffect(() => {
    if (searchText) {
      debouncedSearch();
    }
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchText]);

  // display first 5 results
  // display first 5 results (movies and users)
  const displaySearchResults = () => {
    return searchResults.slice(0, 5).map((result, index) => {
      if (result.title && result.release_date) {
        // This is a movie
        return (
          <div key={index}>
            <p>{result.title} ({result.release_date})</p>
            <img src={"https://image.tmdb.org/t/p/original" + result.poster_path} alt={result.title} />
          </div>
        );
      } else if (result.username && result.profile.profile_picture) {
        // This is a user
        return (
          <div key={index}>
            <p>{result.username}</p>
            <img src={result.profile.profile_picture} alt={result.username} />
          </div>
        );
      } else {
        return null;
      }
    });
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
          <Link to="/mainpage"><Row className="link-on-sidebar">STATS</Row></Link>
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
