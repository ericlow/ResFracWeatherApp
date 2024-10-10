import React, { useState, useEffect } from 'react';
import GoogleLogoutButton from './GoogleLogoutButton';
import NavigateButton from './NavigateButton';
import { useAuth } from './AuthContext';

const HomePage = () => {
  const { authToken, email } = useAuth();
  const [city, setCity ] = useState('');

  // maintain state of page
  const handleInputChange = (event) => {
    setCity(event.target.value);
  };
  
  // submit the city to the service
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    try {
      console.log(authToken);
      const response = await fetch(`http://localhost:8080/get-weather?email=${encodeURIComponent(email)}&city=${encodeURIComponent(city)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ authToken }`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get weather');
      }

      const data = await response.json();
      console.log('retrieved weather successfully:', data);
    } catch (error) {
      console.error('Error getting the weather:', error);
    }
  };

  return (
    <div>
      <h1>Home Page Header</h1>
      <p>Welcome to the Home page!</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="city">City</label><br/>
        <input type="text" id="city" value={city} onChange={handleInputChange} placeholder="What city do you want weather for?" />
        <button type="submit">Get Weather</button>
      </form>
      <NavigateButton path="/settings" label="settings" />
      <GoogleLogoutButton/>
    </div>
  );
};

export default HomePage;