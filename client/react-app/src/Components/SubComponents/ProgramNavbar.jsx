import "./ProgramNavbar.css"
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Sidebar from "react-sidebar";
import Image from 'react-bootstrap/Image';

export default function ProgramNavbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };


  return (
    <div>
      <Navbar expand="lg" sticky="top" bg="dark" variant="dark">
        <Navbar.Brand className= "mx-3">
          Logo
        </Navbar.Brand>
        <Form className="d-flex flex-grow-1 mx-4" inline>
          <FormControl
            type="text"
            placeholder="Search for movie..."
            className="mr-sm-2 flex-grow-1 navbar-search-bar" // Use flex-grow-1 to cover available space
          />
          <Button variant="outline-info" className="navbar-button">Search</Button>
        </Form>
        <Nav.Link as={Link} to="/myprofile">
          <Image className="mx-3 profile-photo"/>
        </Nav.Link>
        <Nav.Link as={Link} to="/myprofile" className="mx-1">
          <div style={{ color: '#CECECE' }}>Annesiz Orospu Çocuğu</div>
        </Nav.Link>
        <button  className="side-menu-button mx-3" type= "button" aria-label="Toogle Navigation"
        onClick={() => toggleSidebar()}> 
          <span className="navbar-toggler-icon"></span>
        </button>
      </Navbar>

      
      <Sidebar
        sidebar={<div>Some content for the sidebar</div>}
        open={sidebarOpen}
        onSetOpen={toggleSidebar}
        styles={{ sidebar: { background: "white", width: "300px" } }}
      />
    </div>
  );
}
