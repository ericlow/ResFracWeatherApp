import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import NavigateButton from './NavigateButton';


const SettingsPage = () => {
const [apiKey, setApiKey] = useState('');
const [isEdited, setIsEdited] = useState(false);
const [isSaved, setIsSaved] = useState(true); // Initially, it's saved


const handleInputChange = (event) => {
  setApiKey(event.target.value);
  setIsEdited(true);
  setIsSaved(false); // Mark as not saved when edited
};

const handleSubmit = (event) => {
  event.preventDefault();
  // Save the API key logic goes here
  console.log('API Key submitted:', apiKey);
  setIsEdited(false); // Reset edited state
  setIsSaved(true); // Mark as saved
};


  return (
    <div>
      <h1>Settings Page</h1>
      <p>Settings</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="apiKey">API Key:</label><br/>
        <input type="text" id="apiKey" value={apiKey} onChange={handleInputChange} placeholder="Enter your API key" />
        <button type="submit">Save API Key</button>

      </form>

      <NavigateButton path="/home" label="close" />
      
    </div>
  );
};

export default SettingsPage;