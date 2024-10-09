import React from 'react';
import { Link } from 'react-router-dom';


const SettingsPage = () => {
  return (
    <div>
      <h1>Settings Page</h1>
      <p>Welcome to the Settings page!</p>
      <Link to="/home">Close</Link>

    </div>
  );
};

export default SettingsPage;