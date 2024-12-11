import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";

function SignupPage() {
  const [first_name, setFirstname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:8000/auth/register", {
      method: "POST",
      body: JSON.stringify({ first_name, username, email, password }),
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      if (response.ok) {
        console.log("User registered:", response);
        navigate("/signin");
      } else if (response.status === 422) {
        response.json().then((data) => {
          setError(data.detail.entity_field + " already taken");
        });
      } else {
        setError("error logging in");
      }
    });
  };
  return (
    <>
      <h1>Sign Up Page</h1>
      <form onSubmit={onSubmit}>
        <FormInput
          type="text"
          name="first name"
          setter={setFirstname}
        ></FormInput>
        <FormInput type="text" name="username" setter={setUsername}></FormInput>
        <FormInput type="text" name="email" setter={setEmail}></FormInput>
        <FormInput
          type="password"
          name="password"
          setter={setPassword}
        ></FormInput>
        <button>Create Account</button>
      </form>
    </>
  );
}

export default SignupPage;
