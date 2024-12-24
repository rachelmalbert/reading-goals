import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { UserContext } from "./context/UserContext";
import api from "./api";

const useApi = () => {
  const { token } = useAuth();
  return api(token);
};

const useApiWithoutToken = () => {
  return api();
};

const useAuth = () => useContext(AuthContext);

const useUser = () => useContext(UserContext);

export { useApi, useApiWithoutToken, useAuth, useUser };
