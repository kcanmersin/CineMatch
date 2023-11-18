import "./FirstPage.css"
import { Link } from "react-router-dom"
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';


export default function FirstPage(){
    return (
        <div className = "background-firstpage">
            <Navbar bg="transparent" expand="sm">
                <Navbar.Brand className="mx-3 firstpage-color">Logo</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav>
                        <Link to= "/signup" className="btn btn-firstpage mx-3" role="button">Sign Up</Link>
                        <Link to= "/signin" className="btn btn-firstpage mx-3" role="button">Sign In</Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <div className="first-text">
                <div className = "first-text-big">
                    Discover the world of movies
                </div>
                <div className = "first-text-small">
                    Free social network platform for movie lovers
                </div>
            </div>
        </div>
    )
}