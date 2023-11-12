import { useState, useEffect } from "react";
import logo from "../assets/logo.jpg";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      // Submit the form data
      // You can add your form submission logic here
      console.log("Form submitted:", formData);
    } else {
      console.log("Form validation failed");
    }
  };

  return (
    <div className="signup-page">
      <div className="sign-up-greeting">
        <div className="title">
          <h1>Welcome to CineMatch</h1>
          <div className="already-have-an-account-container">
            <p>Already have an account?</p>
            <a href="">Click Here!</a>
          </div>
        </div>
      </div>

      <div className="signup-form-container">
        <div className="signup-form-logo">
          <img src={logo} alt="logo" />
        </div>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && <p className="error" style={{color: "red"}}>{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
            {errors.username && <p className="error" style={{color: "red"}}>{errors.username}</p>}
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
            {errors.password && <p className="error" style={{color: "red"}}>{errors.password}</p>}
          </div>
          <div>
            <button type="submit">Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  );
}

  