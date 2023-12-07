import "./SignInPage.css"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import FormGroup from "react-bootstrap/esm/FormGroup"
import { AuthContext } from "../auth/AuthContext";
import  { useContext } from 'react';

export default function SigninPage() {

  const { setIsAuthenticated } = useContext(AuthContext);
  
  // to redirect other pages
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [backendError, setBackendError] = useState("");
  

  const handleForgotPasswordClick = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/auth/users/reset_password/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: formData.email }),
        }
      );
      if (response.ok) {
        alert("Check your email to reset your password");
      } else {
        const errorData = await response.json();
        console.error("Password reset failed:", errorData.message);
      }
    } catch (error) {
      console.error("Password reset failed:", error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Check password length
    if (name === "password" && value.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
    } else {
      setPasswordError(""); // Clear password error if the length is valid
    }

    setBackendError("");
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check password length before submitting
    if (formData.password.length < 8) {
      console.log("Password is too short. Please enter a valid password.");
      return;
    }


      try {
        const response = await fetch('http://127.0.0.1:8000/auth/jwt/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        
        if (response.ok) {
          const jsonData = await response.json(); // This line extracts the JSON body

          // store the jwt access and refresh token in localStorage
          localStorage.setItem('jwtAccess', jsonData.access);
          localStorage.setItem('jwtRefresh', jsonData.refresh);
          localStorage.setItem('isAuthenticated', 'true');
          setIsAuthenticated(true);
          navigate("/mainpage");
        
        } else {
          const errorData = await response.json();
          setBackendError("Email or password is incorrect.");
          console.error('Signin failed:', errorData.message);
        }
      } catch (error) {
        console.error('Signin failed:', error.message);
      }

    
  };

  return (
    <div className="page">
      <Container fluid= "sm" className="signin-container">
        <Form className="signin-form" onSubmit={handleSubmit}>
          <FormGroup className="mb-5"> 
            Logo
            {backendError && (
              <div className="text-danger mt-4">{backendError}</div>
            )}
          </FormGroup>
          <Form.Group className="mb-5" controlId="email">
           <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-5" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            {passwordError && (
              <div className="text-danger">{passwordError}</div>
            )}
          </Form.Group>
          <Form.Group className="mb-5" controlId="password">
              <Button variant="success" type="submit">
                Sign In
              </Button>
          </Form.Group>
          <Form.Group className="mt-5 forgot-password">
            Forgot your password? <a href="#" onClick={handleForgotPasswordClick}> Click here</a>
          </Form.Group>
        </Form>
      </Container>
    </div>
  );
}


