import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            🤖 AI-Powered CV Analysis
          </div>
          <h1 className="hero-title">
            Find Your Perfect
            <br />
            <span className="title-accent">Job Match</span>
          </h1>
          <p className="hero-description">
            Upload your CV and job description to instantly see how well you match. Get
            detailed insights on skills, experience, and education alignment.
          </p>
          <div className="hero-buttons">
            <button 
              className="btn-primary" 
              onClick={() => navigate('/analyzer')}
            >
              Start Analyzing →
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="section-container">
          <div className="section-header">
            <h2>Powerful Analysis Features</h2>
            <p>Our advanced algorithms analyze multiple dimensions of your CV to give you actionable insights.</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🛠️</div>
              <h3>Skill Matching</h3>
              <p>Identify matching and missing skills between your CV and the job-requirements.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💼</div>
              <h3>Experience Analysis</h3>
              <p>Evaluate how your experience aligns with what employers are looking for.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <h3>AI-Powered Insights</h3>
              <p>Get semantic similarity analysis to understand deeper matches.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Instant Results</h3>
              <p>Receive detailed analysis in seconds to improve your applications.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works" id="how-it-works">
        <div className="section-container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Three simple steps to understand your job fit</p>
          </div>

          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Upload Your CV</h3>
              <p>Paste your CV text or upload your resume file in any common format.</p>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <h3>Add Job Description</h3>
              <p>Copy the job posting you're interested in and paste it into the analyzer.</p>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <h3>Get Instant Results</h3>
              <p>Receive detailed match analysis with actionable insights to improve your application.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
