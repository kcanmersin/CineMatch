import { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleResetPasswordClick = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}auth/users/reset_password/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      if (response.ok) {
        setResetSuccess(true);
      } else {
        const errorData = await response.json();
        console.error("Password reset failed:", errorData.message);
      }
    } catch (error) {
      console.error("Password reset failed:", error.message);
    }
  };

  return (
    <div>
      {resetSuccess ? (
        <div>
          <p>An email with instructions to reset your password has been sent.</p>
        </div>
      ) : (
        <div>
          <p>Enter your email address to reset your password:</p>
          <Form>
            <Form.Group controlId="resetEmail">
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                required
              />
            </Form.Group>
            <Button
              variant="primary"
              type="button"
              onClick={handleResetPasswordClick}
            >
              Reset Password
            </Button>
          </Form>
        </div>
      )}
    </div>
  );
}


