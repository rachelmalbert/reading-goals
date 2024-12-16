import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";
import { useAuth } from "../context/AuthContext";
import "./SigninPage.css";
// import books from "../assets/images/books.png";

import logo from "../assets/images/rg-logo.png";

function SigninPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8000/auth/token", {
      method: "POST",
      body: new URLSearchParams({ username, password }),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const tokenData = await response.json();

    if (tokenData) {
      login(tokenData);
      console.log("Success login in:", tokenData);
      navigate("/dashboard");
    } else {
      console.log("Error logging in");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <form onSubmit={onSubmit}>
          <div className="logo-container">
            <div className="logo-title">Reading Goals</div>
            <img className="logo" src={logo} alt="Logo" />
          </div>

          <label htmlFor="username">Username</label>
          <FormInput
            type="text"
            // name="username"
            id="username"
            setter={setUsername}
          />
          <label htmlFor="password">Password</label>
          <FormInput
            type="password"
            // name="password"
            id="password"
            setter={setPassword}
          />
          {/* Forgot password link */}
          <div className="forgot-password-link">
            <a href="/forgot-password" className="forgot-password-text">
              Forgot Password?
            </a>
          </div>
          <button className="sign-in-button" type="submit">
            Sign In
          </button>

          {/* Sign-up link */}
          <div className="signup-link">
            <p className="signup-link-text">
              Don't have an account?{" "}
              <a href="/signup" className="signup-link-text">
                Sign Up
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SigninPage;
