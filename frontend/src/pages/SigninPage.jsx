import "../styles/SigninPage.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useApi } from "../hooks";
import logo from "../assets/images/rg-logo.png";
import FormInput from "../components/FormInput";

function SigninPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const api = useApi();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    const response = await api.postForm("/auth/token", { username, password });

    const tokenData = await response.json();

    if (tokenData.access_token) {
      // console.log("TokenData:", tokenData);
      login(tokenData);
      console.log("Success login in:", tokenData);
      navigate("/dashboard");
    } else {
      setError("Incorrect username or password");
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
          <FormInput type="text" id="username" setter={setUsername} />
          <label htmlFor="password">Password</label>
          <FormInput type="password" id="password" setter={setPassword} />

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
          <div className={`error-message ${error === "" ? "" : "error"}`}>{error}</div>
        </form>
      </div>
    </div>
  );
}

export default SigninPage;
