import { useQuery } from "@tanstack/react-query";
import { createContext } from "react";
import { useAuth, useApi } from "../hooks";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const { isLoggedIn, token, logout } = useAuth();
  const api = useApi();

  const { data, isLoading } = useQuery({
    queryKey: ["user", token],
    enabled: isLoggedIn,
    staleTime: Infinity,
    queryFn: () =>
      api.get("/user/self").then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          logout();
        }
      }),
    onError: () => {
      logout();
    },
  });

  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  return <UserContext.Provider value={data}>{children}</UserContext.Provider>;
};

export { UserProvider, UserContext };
