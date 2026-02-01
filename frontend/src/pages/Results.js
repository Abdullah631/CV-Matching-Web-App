import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Results.css';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    return (
      <div className="results">
        <div className="results-container">
          <div className="no-results">
            <p>No results available. Please analyze a CV first.</p>
            <button onClick={() => navigate('/analyzer')} className="btn-back-analyze">
              Go to Analyzer
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 80) return '#27ae60';
    if (score >= 60) return '#f39c12';
    return '#e74c3c';
  };

  const getScoreInterpretation = (score) => {
    if (score >= 80) return 'Excellent match! Strong candidate for this role.';
    if (score >= 60) return 'Good match! Consider applying.';
    return 'Fair match. Review the detailed scores below.';
  };

  const overallColor = getScoreColor(result.overall_match);

  return (
    <div className="results">
      <div className="results-container">
        <div className="results-header">
          <h1>Match Analysis Results</h1>
        </div>

        {/* Overall Score */}
        <div className="overall-score-box" style={{ borderColor: overallColor }}>
          <p className="overall-label">Overall Match</p>
          <div className="overall-score" style={{ color: overallColor }}>
            {result.overall_match.toFixed(2)}%
          </div>
          <p className="overall-interpretation">
            {getScoreInterpretation(result.overall_match)}
          </p>
        </div>

        {/* Score Cards Grid */}
        <div className="scores-grid">
          <div className="score-card">
            <div className="score-card-icon">🛠️</div>
            <p className="score-label">Skill Match</p>
            <div className="score-value" style={{ color: getScoreColor(result.skill_match) }}>
              {result.skill_match.toFixed(2)}%
            </div>
            <div className="score-circle">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e0e0e0" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={getScoreColor(result.skill_match)}
                  strokeWidth="8"
                  strokeDasharray={`${(result.skill_match / 100) * 283} 283`}
                  style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                />
              </svg>
            </div>
          </div>

          <div className="score-card">
            <div className="score-card-icon">💼</div>
            <p className="score-label">Experience Match</p>
            <div className="score-value" style={{ color: getScoreColor(result.experience_match) }}>
              {result.experience_match.toFixed(2)}%
            </div>
            <div className="score-circle">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e0e0e0" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={getScoreColor(result.experience_match)}
                  strokeWidth="8"
                  strokeDasharray={`${(result.experience_match / 100) * 283} 283`}
                  style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                />
              </svg>
            </div>
          </div>

          <div className="score-card">
            <div className="score-card-icon">🎓</div>
            <p className="score-label">Education Match</p>
            <div className="score-value" style={{ color: getScoreColor(result.education_match) }}>
              {result.education_match.toFixed(2)}%
            </div>
            <div className="score-circle">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e0e0e0" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={getScoreColor(result.education_match)}
                  strokeWidth="8"
                  strokeDasharray={`${(result.education_match / 100) * 283} 283`}
                  style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                />
              </svg>
            </div>
          </div>

          <div className="score-card">
            <div className="score-card-icon">🧠</div>
            <p className="score-label">Semantic Similarity</p>
            <div className="score-value" style={{ color: getScoreColor(result.semantic_similarity) }}>
              {result.semantic_similarity.toFixed(2)}%
            </div>
            <div className="score-circle">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e0e0e0" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={getScoreColor(result.semantic_similarity)}
                  strokeWidth="8"
                  strokeDasharray={`${(result.semantic_similarity / 100) * 283} 283`}
                  style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="detailed-breakdown">
          <h2>Detailed Breakdown</h2>

          <div className="breakdown-item">
            <div className="breakdown-left">
              <span className="breakdown-label">Skill Match</span>
              <span className="breakdown-value">{result.skill_match.toFixed(2)}%</span>
            </div>
            <div className="breakdown-bar">
              <div
                className="breakdown-bar-fill"
                style={{
                  width: `${result.skill_match}%`,
                  backgroundColor: getScoreColor(result.skill_match)
                }}
              />
            </div>
          </div>

          <div className="breakdown-item">
            <div className="breakdown-left">
              <span className="breakdown-label">Experience Match</span>
              <span className="breakdown-value">{result.experience_match.toFixed(2)}%</span>
            </div>
            <div className="breakdown-bar">
              <div
                className="breakdown-bar-fill"
                style={{
                  width: `${result.experience_match}%`,
                  backgroundColor: getScoreColor(result.experience_match)
                }}
              />
            </div>
          </div>

          <div className="breakdown-item">
            <div className="breakdown-left">
              <span className="breakdown-label">Education Match</span>
              <span className="breakdown-value">{result.education_match.toFixed(2)}%</span>
            </div>
            <div className="breakdown-bar">
              <div
                className="breakdown-bar-fill"
                style={{
                  width: `${result.education_match}%`,
                  backgroundColor: getScoreColor(result.education_match)
                }}
              />
            </div>
          </div>

          <div className="breakdown-item">
            <div className="breakdown-left">
              <span className="breakdown-label">Semantic Similarity</span>
              <span className="breakdown-value">{result.semantic_similarity.toFixed(2)}%</span>
            </div>
            <div className="breakdown-bar">
              <div
                className="breakdown-bar-fill"
                style={{
                  width: `${result.semantic_similarity}%`,
                  backgroundColor: getScoreColor(result.semantic_similarity)
                }}
              />
            </div>
          </div>
        </div>

        <button onClick={() => navigate('/analyzer')} className="btn-analyze-another">
          Analyze Another CV
        </button>
      </div>
    </div>
  );
};

export default Results;
