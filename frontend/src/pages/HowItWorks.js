import React from 'react';
import './HowItWorks.css';

const HowItWorks = () => {
  const steps = [
    {
      number: '1',
      title: 'Upload or Paste Your CV',
      description: 'Add your CV by uploading a PDF/DOC file or pasting the text directly into the form.'
    },
    {
      number: '2',
      title: 'Add Job Description',
      description: 'Provide the job description you\'re applying for - upload or paste the text.'
    },
    {
      number: '3',
      title: 'Get Instant Analysis',
      description: 'Our AI analyzes both documents and provides a detailed matching score.'
    },
    {
      number: '4',
      title: 'Review Results',
      description: 'See your overall match percentage and a breakdown by skill categories.'
    },
    {
      number: '5',
      title: 'Improve Your Profile',
      description: 'Identify gaps and optimize your CV to better match future job postings.'
    }
  ];

  return (
    <div className="how-it-works-page">
      <div className="how-header">
        <h1>How It Works</h1>
        <p>A simple 5-step process to optimize your job applications</p>
      </div>

      <div className="steps-container">
        {steps.map((step, index) => (
          <div key={index} className="step-card">
            <div className="step-number">{step.number}</div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
            {index < steps.length - 1 && <div className="step-arrow">↓</div>}
          </div>
        ))}
      </div>

      <div className="how-features">
        <h2>Why Use CVMatch?</h2>
        <div className="benefits-grid">
          <div className="benefit">
            <h4>🎯 Accuracy</h4>
            <p>Advanced AI algorithms ensure precise skill matching</p>
          </div>
          <div className="benefit">
            <h4>⚡ Speed</h4>
            <p>Get results in seconds, not minutes</p>
          </div>
          <div className="benefit">
            <h4>🔒 Privacy</h4>
            <p>Your data never leaves your device</p>
          </div>
          <div className="benefit">
            <h4>💡 Insights</h4>
            <p>Detailed feedback to improve your CV</p>
          </div>
        </div>
      </div>

      <div className="how-cta">
        <h2>Ready to get started?</h2>
        <p>Analyze your CV against your next job opportunity</p>
        <a href="/analyzer" className="btn-primary">Start Analyzing</a>
      </div>
    </div>
  );
};

export default HowItWorks;
