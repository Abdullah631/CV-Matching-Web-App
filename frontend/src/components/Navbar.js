import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1 className="navbar-title">
            <span className="logo-icon">📄</span> CV-JD Matcher
          </h1>
          <p className="navbar-subtitle">AI-Powered Job Application Analyzer</p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
