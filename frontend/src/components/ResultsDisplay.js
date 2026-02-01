import React from 'react';
import './ResultsDisplay.css';

const ResultsDisplay = ({ result }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return '#27ae60'; // Green
    if (score >= 60) return '#f39c12'; // Orange
    return '#e74c3c'; // Red
  };

  const ScoreCard = ({ label, score, icon }) => (
    <div className="score-card">
      <div className="score-icon">{icon}</div>
      <h4 className="score-label">{label}</h4>
      <div className="score-circle" style={{ borderColor: getScoreColor(score) }}>
        <span className="score-value" style={{ color: getScoreColor(score) }}>
          {score}%
        </span>
      </div>
      <div className="score-bar">
        <div 
          className="score-bar-fill" 
          style={{ 
            width: `${score}%`,
            backgroundColor: getScoreColor(score)
          }}
        />
      </div>
    </div>
  );

  const overallColor = getScoreColor(result.overall_match);

  return (
    <div className="results-container">
      <div className="results-card">
        <h2 className="results-title">Match Analysis Results</h2>

        {/* Overall Match Score */}
        <div className="overall-score-section">
          <div className="overall-score-box" style={{ borderColor: overallColor }}>
            <h3 style={{ color: overallColor }}>Overall Match</h3>
            <div className="overall-score-large" style={{ color: overallColor }}>
              {result.overall_match}%
            </div>
            <p className="overall-interpretation">
              {result.overall_match >= 80 && "Excellent match! Strong candidate for this role."}
              {result.overall_match >= 60 && result.overall_match < 80 && "Good match! Consider applying."}
              {result.overall_match < 60 && "Fair match. Review the detailed scores below."}
            </p>
          </div>
        </div>

        {/* Detailed Scores */}
        <div className="scores-grid">
          <ScoreCard 
            label="Skill Match" 
            score={result.skill_match}
            icon="🛠️"
          />
          <ScoreCard 
            label="Experience Match" 
            score={result.experience_match}
            icon="💼"
          />
          <ScoreCard 
            label="Education Match" 
            score={result.education_match}
            icon="🎓"
          />
          <ScoreCard 
            label="Semantic Similarity" 
            score={result.semantic_similarity}
            icon="🧠"
          />
        </div>

        {/* Score Breakdown */}
        <div className="score-breakdown">
          <h3>Detailed Breakdown</h3>
          <div className="breakdown-item">
            <span className="breakdown-label">Skill Match:</span>
            <span className="breakdown-value">{result.skill_match}%</span>
            <div className="breakdown-bar">
              <div 
                className="breakdown-bar-fill"
                style={{ width: `${result.skill_match}%` }}
              />
            </div>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-label">Experience Match:</span>
            <span className="breakdown-value">{result.experience_match}%</span>
            <div className="breakdown-bar">
              <div 
                className="breakdown-bar-fill"
                style={{ width: `${result.experience_match}%` }}
              />
            </div>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-label">Education Match:</span>
            <span className="breakdown-value">{result.education_match}%</span>
            <div className="breakdown-bar">
              <div 
                className="breakdown-bar-fill"
                style={{ width: `${result.education_match}%` }}
              />
            </div>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-label">Semantic Similarity:</span>
            <span className="breakdown-value">{result.semantic_similarity}%</span>
            <div className="breakdown-bar">
              <div 
                className="breakdown-bar-fill"
                style={{ width: `${result.semantic_similarity}%` }}
              />
            </div>
          </div>
        </div>

        {/* Preprocessing Statistics */}
        {result.preprocessing_stats && (
          <div className="preprocessing-stats">
            <h3>📊 Text Processing Details</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">CV - Original Length:</span>
                <span className="stat-value">
                  {result.preprocessing_stats.cv?.original_length || 0} chars
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">CV - Cleaned Length:</span>
                <span className="stat-value">
                  {result.preprocessing_stats.cv?.cleaned_length || 0} chars
                </span>
              </div>
              {result.preprocessing_stats.cv?.sections_found && (
                <div className="stat-item">
                  <span className="stat-label">CV - Sections Found:</span>
                  <span className="stat-value">
                    {result.preprocessing_stats.cv.sections_found.join(', ')}
                  </span>
                </div>
              )}
              <div className="stat-item">
                <span className="stat-label">JD - Original Length:</span>
                <span className="stat-value">
                  {result.preprocessing_stats.jd?.original_length || 0} chars
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">JD - Cleaned Length:</span>
                <span className="stat-value">
                  {result.preprocessing_stats.jd?.cleaned_length || 0} chars
                </span>
              </div>
              {result.preprocessing_stats.jd?.sections_found && (
                <div className="stat-item">
                  <span className="stat-label">JD - Sections Found:</span>
                  <span className="stat-value">
                    {result.preprocessing_stats.jd.sections_found.join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsDisplay;
