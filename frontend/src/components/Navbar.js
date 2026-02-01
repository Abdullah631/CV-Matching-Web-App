import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="logo-icon">📄</span>
          <span className="logo-text">CV<span className="logo-accent">Match</span></span>
        </Link>
        
        <div className="navbar-menu">
          <Link to="/analyzer" className="nav-link">Analyzer</Link>
          <a href="#features" className="nav-link">Features</a>
          <a href="#how-it-works" className="nav-link">How It Works</a>
        </div>

        <Link to="/analyzer" className="btn-get-started">
          Get Started
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
