import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
function AuthProvider({ children }) {
  // state to hold the authenticated token
  const [token, setToken_] = useState(localStorage.getItem("token"));
  const [userId, setUserId] = useState(localStorage.getItem("userId"));

  // function to set authenticated token
  function setToken(newToken) {
    setToken_(newToken);
  }

  function setNewUser(userid) {
    setUserId(userid);
  }

  useEffect(() => {
    if (token && userId) {
      axios.defaults.headers.common["Authorization"] = "Bearer" + token;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
    }
  }, [token, userId]);

  const contextValue = useMemo(
    () => ({ token, setToken, userId, setNewUser }),
    [token, userId]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
