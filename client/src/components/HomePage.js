import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import HomeTitleBar from './HomeTitleBar'; 

const HomePage = () => {
  const { authToken, email } = useAuth();
  const [city, setCity ] = useState('');
  const [weatherData, setWeatherData] = useState(null); // State to hold weather data
  const [error, setError] = useState(null); // State to hold error messages

  // maintain state of page
  const handleInputChange = (event) => {
    setCity(event.target.value);
  };
  
  // submit the city to the service
  const handleSubmit = async (event) => {
    console.log('HomePage: handleSubmit')
    event.preventDefault(); // Prevent the default form submission behavior
    try {
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
      setWeatherData(data)
      setError(null);
      console.log('retrieved weather successfully:', data);
    } catch (error) {
      console.error('Error getting the weather:', error);
      setWeatherData(null)
      setError(error);
    }
  };

  return (
    <div>
      <HomeTitleBar/>
      <div  className="input-label-style">
        Enter City Name: In the text box labeled "City," 
        type the name of the city you are interested in. 
        For example, you can enter "New York," "Los Angeles," or "London."
      </div>
      <form onSubmit={handleSubmit} className="p-3">
        <div className-="mb-3  d-flex align-items-center">
          <input className="input-width me-2" type="text" id="city" value={city} onChange={handleInputChange} placeholder="What city do you want weather for?" />
          <button type="submit"  className="btn btn-primary">Get Weather</button>
        </div>
      </form>

      {error && <p>Error: {error}</p>} {/* Show error message if there is one */}

      {weatherData && ( // Conditionally render city and temperature
        <div>
          <h2>Weather in {weatherData.location}</h2>
          <p>Temperature: {weatherData.temperature} °F</p>
          <p>Description: {weatherData.description}</p>
          <p>Humidity: {weatherData.humidity}%</p>
          <p>Wind Speed: {weatherData.wind_speed} mph</p>
          {weatherData.weather_icons && ( // Conditionally render the weather image if it exists
            <img src={weatherData.weather_icons} alt="Weather visual" />
          )}
        </div>
      )}

    </div>
  );
};

export default HomePage;