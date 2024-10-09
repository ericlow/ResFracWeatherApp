import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TestComponent from './components/TestComponent';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import SettingsPage from './components/SettingsPage';
import logo from './logo.svg';
import './App.css';


function App() {
  return (
    <Router>
    <div className="App">
      <header className="App-header">
        <div>
          <Routes>
            <Route path="/test" element={<TestComponent/>}/>
            <Route path="/" element={<LoginPage/>}/>
            <Route path="/home" element={<HomePage/>}/>
            <Route path="/settings" element={<SettingsPage/>}/>
          </Routes>
        </div>
      </header>
    </div>
    </Router>
  );
}

export default App;

