import React from 'react';
import './Features.css';

const Features = () => {
  const features = [
    {
      icon: '⚡',
      title: 'Instant Analysis',
      description: 'Get real-time matching results between your CV and job descriptions in seconds.'
    },
    {
      icon: '📊',
      title: 'Detailed Metrics',
      description: 'View comprehensive scoring breakdown across skills, experience, and qualifications.'
    },
    {
      icon: '🎯',
      title: 'Skill Matching',
      description: 'Identify missing skills and competencies to improve your profile.'
    },
    {
      icon: '📈',
      title: 'Performance Tracking',
      description: 'Monitor your matching scores across multiple job applications.'
    },
    {
      icon: '🔒',
      title: 'Privacy First',
      description: 'Your data is processed locally. We never store your CVs or job descriptions.'
    },
    {
      icon: '🚀',
      title: 'Easy to Use',
      description: 'Simple, intuitive interface - no sign-up required to get started.'
    }
  ];

  return (
    <div className="features-page">
      <div className="features-header">
        <h1>Powerful Features</h1>
        <p>Everything you need to optimize your job application process</p>
      </div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="features-cta">
        <h2>Ready to improve your CV matching?</h2>
        <p>Start analyzing your CV against job descriptions now</p>
        <a href="/analyzer" className="btn-primary">Get Started</a>
      </div>
    </div>
  );
};

export default Features;
