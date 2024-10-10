import React from 'react';
import GoogleLogoutButton from './GoogleLogoutButton';
import NavigateButton from './NavigateButton';

const HomePage = () => {
  return (
    <div>
      <h1>Home Page Header</h1>
      <p>Welcome to the Home page!</p>
      <NavigateButton path="/settings" label="settings" />
      <GoogleLogoutButton/>
    </div>
  );
};

export default HomePage;