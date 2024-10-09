import React from 'react';
import { Link } from 'react-router-dom';
import GoogleLogoutButton from './GoogleLogoutButton';

const HomePage = () => {
  return (
    <div>
      <h1>Home Page Header</h1>
      <p>Welcome to the Home page!</p>
      <Link to="/settings">Settings</Link>
      <GoogleLogoutButton/>
    </div>
  );
};

export default HomePage;