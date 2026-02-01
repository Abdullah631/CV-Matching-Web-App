import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/analyzer');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">📄</span>
          <span className="logo-text">CV<span className="logo-accent">Match</span></span>
        </Link>

        <nav className="nav-menu">
          <Link to="/analyzer" className="nav-link">Analyzer</Link>
          <Link to="/features" className="nav-link">Features</Link>
          <Link to="/how-it-works" className="nav-link">How It Works</Link>
        </nav>

        <button className="btn-get-started" onClick={handleGetStarted}>
          Get Started
        </button>
      </div>
    </header>
  );
};

export default Header;
