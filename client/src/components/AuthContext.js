import React, { createContext, useState, useContext } from 'react';

// Create the AuthContext
const AuthContext = createContext(null);

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null); // State to hold the token
  const [email, setEmail] = useState(null); // State to hold the user's email

  // Function to set the token
  const setToken = (token) => {
    setAuthToken(token);
  };


  // Function to set the email
  const setUserEmail = (userEmail) => {
    setEmail(userEmail);
  };


  // Function to clear the token on logout
  const clearAuth = () => {
    setAuthToken(null);
    setEmail(null);
  };

  return (
    <AuthContext.Provider value={{ authToken, email, setToken, setUserEmail, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext in other components
export const useAuth = () => {
  return useContext(AuthContext);
};