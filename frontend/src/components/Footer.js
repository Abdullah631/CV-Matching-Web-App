import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <Link to="/" className="footer-brand">
            <span className="footer-icon">📄</span>
            <span className="footer-title">CVMatch</span>
          </Link>
          <p className="footer-description">
            Analyze your CV against job descriptions and improve your chances of landing your dream job.
          </p>
        </div>

        <div className="footer-section">
          <h4>Product</h4>
          <ul>
            <li><Link to="/analyzer">CV Analyzer</Link></li>
            <li><Link to="/features">Features</Link></li>
            <li><Link to="/how-it-works">How It Works</Link></li>
          </ul>
        </div>

        

        <div className="footer-section">
          <h4>Legal</h4>
          <ul>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-copyright">
          <span>© {currentYear} CVMatch. All rights reserved.</span>
        </div>
        <div className="footer-social">
          <a href="#twitter" className="social-link">𝕏</a>
          <a href="#linkedin" className="social-link">in</a>
          <a href="#github" className="social-link">⚙️</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
