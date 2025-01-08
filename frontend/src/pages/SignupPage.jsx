import "../styles/SignupPage.css";
import { useState } from "react";
import { useAuth } from "../hooks";
import FormInput from "../components/FormInput";
import logo from "../assets/images/rg-logo.png";

function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const onSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      console.log({ error });
    } else {
      fetch("http://localhost:8000/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error();
          }
          return response.json();
        })
        .then((registerData) => {
          return fetch("http://localhost:8000/auth/token", {
            method: "POST",
            body: new URLSearchParams({ username, password }),
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          });
        })
        .then((loginResponse) => {
          return loginResponse.json();
        })
        .then((loginData) => {
          login(loginData);
        })
        .catch((error) => {
          console.log(error);
          setError("Username already taken");
        });
    }
  };
  return (
    <>
      <div className="signup-container">
        <div className="signup-form-container">
          <form onSubmit={onSubmit}>
            <div className="logo-container">
              <div className="logo-title">Reading Goals</div>
              <img className="logo" src={logo} alt="Logo" />
            </div>
            <FormInput type="text" name="Username" setter={setUsername} placeholder="Username" required></FormInput>
            <FormInput type="password" name="Password" setter={setPassword} placeholder="Password" required></FormInput>
            <FormInput type="password" name="Confirm Password" setter={setConfirmPassword} placeholder="Confirm Password" required></FormInput>
            <button className="signup-button" type="submit">
              Create Account
            </button>

            <div className={`error-message ${error === "" ? "" : "error"}`}>{error}</div>
            {/* Sign-in link */}
            <div className="signup-link">
              <p className="signup-link-text">
                Already have an account?{" "}
                <a href="/signin" className="signup-link-text">
                  Sign In
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default SignupPage;
