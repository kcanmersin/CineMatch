import { useState } from "react";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function SigninPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [isButtonValid, setIsButtonValid] = useState(false);
  

  const handleForgotPasswordClick = () => {
    alert('Check your email to reset your password');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Check password length
    if (name === "password" && value.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
    } else {
      setPasswordError(""); // Clear password error if the length is valid
    }

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
          console.log(jsonData.access);
          console.log(jsonData.refresh);
          localStorage.setItem('jwtAccess', jsonData.access);
          localStorage.setItem('jwtRefresh', jsonData.refresh);
          setIsButtonValid(true);

        



        
        } else {
          const errorData = await response.json();
          console.error('Signin failed:', errorData.message);
        }
      } catch (error) {
        console.error('Signin failed:', error.message);
      }

    
  };

  return (
    <>
      <Form id="signInForm" onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email:</Form.Label>
          <Form.Control
            type="text"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password:</Form.Label>
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
        <div className="form-group">
        

          {isButtonValid
            ? <Link to= "/mainpage">
                <Button variant="success" type="submit">
                  Sign In
                </Button>
              </Link>
              :<Button variant="success" type="submit">
                Submit
              </Button>}
        </div>


        <div>
      <p>Forgot your password ? 
        <span>
          <a href="#" onClick={handleForgotPasswordClick}>Click here</a>
        </span>
      </p>
    </div>
      </Form>
    </>
  );
}
