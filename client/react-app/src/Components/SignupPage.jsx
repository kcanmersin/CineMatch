import "./SignupPage.css"
import { useState, useEffect } from "react";
import Form from 'react-bootstrap/Form';
import FormGroup from "react-bootstrap/esm/FormGroup";
import Button from "react-bootstrap/esm/Button";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    // Validation function to check if the form data is valid
    const validateForm = () => {
      const newErrors = {};
      let isValid = true;

      // Check email
      if (!formData.email) {
        newErrors.email = "Email is required";
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Invalid email format";
        isValid = false;
      }

      // Check username
      if (!formData.username) {
        newErrors.username = "Username is required";
        isValid = false;
      }

      // Check password
      if (!formData.password) {
        newErrors.password = "Password is required";
        isValid = false;
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters long";
        isValid = false;
      }

      setErrors(newErrors);
      setIsFormValid(isValid);
    };

    validateForm();
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid) {
      try {
        const response = await fetch('http://127.0.0.1:8000/auth/users/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
    
        if (response.ok) {
          console.log("Form submitted:", formData);
        } else {
          // Handle signup errors, such as duplicate email or invalid data
          const errorData = await response.json();
          console.error('Signup failed:', errorData.message);
        }
      } catch (error) {
        console.error('Signup failed:', error.message);
      }
    } else {
      console.log("Form validation failed");
    }
  };

  return (
    <div className="container-fluid signup-page">

      <div className="sign-up-greeting">
        <div className="title">
          <div className="welcome-text">
            Welcome to CineMatch
          </div>
          <div className="already-have-an-account">
            Already have an account? <a href="">Click Here!</a>
          </div>
        </div>
      </div>

      <div className= "sign-up-form-container">
        <Form onSubmit={handleSubmit}> 
          <FormGroup className="mb-5">
            Logo
          </FormGroup>
          <FormGroup className="mb-4 mx-5" /*controlId="formEmail"*/>
            <Form.Control
              size="lg"
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && <div className="" style={{color: "red"}}>{errors.email}</div>}
          </FormGroup>
          <FormGroup className="mb-4 mx-5" /*controlId="formUsername"*/>
            <Form.Control
              size="lg"
              type="text"
              id="username"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
            />
            {errors.username && <p className="error" style={{color: "red"}}>{errors.username}</p>}
          </FormGroup>
          <FormGroup className="mb-4 mx-5" /*controlId="formPassword"*/>
            <Form.Control
               size="lg"
               type="password"
               id="password"
               name="password"
               placeholder="Password"
               value={formData.password}
               onChange={handleInputChange}
             />
            {errors.password && <p className="error" style={{color: "red"}}>{errors.password}</p>}
          </FormGroup>
          <Button variant="success" type="submit">
            Submit
          </Button>
        </Form>
        </div>
    </div>
  );
}

  