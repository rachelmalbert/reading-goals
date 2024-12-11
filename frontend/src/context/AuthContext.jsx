import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Get, set, and delete token
const getToken = () => sessionStorage.getItem("reading_goals_token");
const storeToken = (token) =>
  sessionStorage.setItem("reading_goals_token", token);
const clearToken = () => sessionStorage.removeItem("reading_goals_token");

// Create the Auth Context
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getToken);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      storeToken(token);
    } else {
      clearToken();
    }
  }, [token]);

  const login = (tokenData) => {
    setToken(tokenData.access_token);
    console.log("logged in and token set");
  };

  const logout = () => {
    setToken(null);
    navigate("");
  };

  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider value={{ token, login, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

// HOOK //
const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthProvider, useAuth };
