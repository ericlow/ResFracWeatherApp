import React from 'react';
import { GoogleOAuthProvider, googleLogout } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';



const GoogleLogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    googleLogout();
    console.log('sign out ok');
    navigate('/')
  }
  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default GoogleLogoutButton;
