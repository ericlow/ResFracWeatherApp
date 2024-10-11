import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavigateButton from './NavigateButton';
import { useAuth } from './AuthContext';
import SettingsTitleBar from './SettingsTitleBar';

const SettingsPage = () => {
  const [apiKey, setApiKey] = useState('');
  const { authToken, email } = useAuth();

  // maintain state of page
  const handleInputChange = (event) => {
    setApiKey(event.target.value);
  };

  // get the API key from the database on load
  useEffect(() => {
    const fetchUser = async () => {
      if (!authToken) return; // If not authenticated, do not fetch

      try {
        const response = await fetch(`http://localhost:8080/get-user?email=${encodeURIComponent(email)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setApiKey(data.apikey); // Set the API key from user data
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [authToken]); // Run this effect whenever the authToken changes

  // submit the api key to the service
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    try {
      console.log(email);
      console.log(authToken);
      const response = await fetch('http://localhost:8080/update-api-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ authToken }`
        },
        body: JSON.stringify({ apiKey, email }), // Send the API key as JSON
      });

      if (!response.ok) {
        throw new Error('Failed to update API key');
      }

      const data = await response.json();
      console.log('API key updated successfully:', data);
    } catch (error) {
      console.error('Error updating API key:', error);
    }
  };


  return (
    <div>
      <SettingsTitleBar/>

      <form onSubmit={handleSubmit} className="p-3">
        <div  className="mb-3  d-flex align-items-left">
          <label  className="input-label" htmlFor="apiKey">API Key:</label><br/>
          <input  className="input-width me-2"  type="text" id="apiKey" value={apiKey} onChange={handleInputChange} placeholder="Enter your API key" />
          <button className="btn btn-primary" type="submit" >Save API Key</button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;