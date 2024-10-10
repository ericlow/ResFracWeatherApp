import React, { createContext, useState, useContext } from 'react';

// Create the AuthContext
const AuthContext = createContext(null);

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null); // State to hold the token

  // Function to set the token
  const setToken = (token) => {
    setAuthToken(token);
  };

  // Function to clear the token on logout
  const clearToken = () => {
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ authToken, setToken, clearToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext in other components
export const useAuth = () => {
  return useContext(AuthContext);
};