//import foto from "../assets/sign-up-foto.jpg"
import logo from "../assets/logo.jpg"

export default function SignupPage() {
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
  
          <form action="">
            <div>
              <label htmlFor="">Email</label>
              <input type="text" />
            </div>
            <div>
              <label htmlFor="">Username</label>
              <input type="text" />
            </div>
            <div>
              <label htmlFor="">Password</label>
              <input type="password" />
            </div>
            <div>
                <button>Sign Up</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  