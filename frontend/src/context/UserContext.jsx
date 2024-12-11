import { useQuery } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const { isLoggedIn, token, logout } = useAuth();
  const navigate = useNavigate();

  // get the user
  const { data, isLoading } = useQuery({
    queryKey: ["user", token],
    enabled: isLoggedIn,
    staleTime: Infinity,
    queryFn: () =>
      fetch("http://localhost:8000/user/self", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }).then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          logout();
        }
      }),
  });

  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  return <UserContext.Provider value={data}>{children}</UserContext.Provider>;
};

// HOOK //
const useUser = () => {
  return useContext(UserContext);
};

export { UserProvider, useUser };
