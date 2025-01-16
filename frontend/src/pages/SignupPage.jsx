import "../styles/SignupPage.css";
import { useState } from "react";
import { useApi } from "../hooks";
import { useAuth } from "../hooks";
import FormInput from "../components/FormInput";
import logo from "../assets/images/rg-logo.png";

function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false); // New state for loading
  const [error, setError] = useState("");
  const { login } = useAuth();
  const api = useApi();

  const onSubmit = (e) => {
    e.preventDefault();

    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      console.log({ error });
    } else {
      api
        .post("/auth/register", { username, password })
        .then((response) => {
          if (!response.ok) {
            throw new Error();
          }
          return response.json();
        })
        .then((registerData) => {
          return api.postForm("/auth/token", { username, password });
        })
        .then((loginResponse) => {
          return loginResponse.json();
        })
        .then((loginData) => {
          login(loginData);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          // Handle errors (both network and HTTP errors)
          setError("Username already taken");
          setLoading(false);
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
          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default SignupPage;
