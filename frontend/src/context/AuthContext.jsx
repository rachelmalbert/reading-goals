import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Get, set, and delete token
const getToken = () => sessionStorage.getItem("reading_goals_token");
const storeToken = (token) => sessionStorage.setItem("reading_goals_token", token);
const clearToken = () => sessionStorage.removeItem("reading_goals_token");

// Create the Auth Context
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getToken);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiryTime = payload.exp * 1000; 
      const now = Date.now();
      const timeUntilExpiry = expiryTime - now;

      if (timeUntilExpiry <= 0) {
        console.log("Token already expired");
        clearToken();
        return;
      }

      console.log("Token is valid, storing it");
      storeToken(token); // store the full token

      const logoutTimeout = setTimeout(() => {
        console.log("Token expired — auto logging out");
        clearToken();
        logout();
      }, timeUntilExpiry);

      return () => clearTimeout(logoutTimeout);

    } catch (e) {
      console.error("Invalid token format:", e);
      clearToken(); // Token is invalid or can't be decoded
    }
  }, [token]);



  const login = (tokenData) => {
    setToken(tokenData.access_token);
    console.log("logged in and token set");
  };

  const logout = () => {
    clearToken();
    setToken(null);
    navigate("/signin");
  };

  const isLoggedIn = !!token;

  return <AuthContext.Provider value={{ token, login, logout, isLoggedIn }}>{children}</AuthContext.Provider>;
};

export { AuthProvider, AuthContext };
