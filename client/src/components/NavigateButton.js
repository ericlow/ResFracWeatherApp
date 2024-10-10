import React from 'react';
import { useNavigate } from 'react-router-dom';

const NavigateButton = ({ path, label }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(path); // Use the path prop for navigation
  };

  return (
    <button onClick={handleClick}>{label}</button>
  );
};

export default NavigateButton;