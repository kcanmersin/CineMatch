import { useState } from "react";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function SigninPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [passwordError, setPasswordError] = useState("");

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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check password length before submitting
    if (formData.password.length < 8) {
      console.log("Password is too short. Please enter a valid password.");
      return;
    }

    // Add your sign-in logic here
    console.log("Form submitted:", formData);
  };

  return (
    <>
      <Form id="signInForm" onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="username">
          <Form.Label>Username:</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={formData.username}
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
          <Button type="submit" className="btn">
            Sign In
          </Button>
        </div>
      </Form>
    </>
  );
}
