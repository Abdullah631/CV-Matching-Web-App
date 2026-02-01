import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './History.css';

const History = ({ onBack }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/matches/history/');
      setHistory(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load history');
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#27ae60';
    if (score >= 60) return '#f39c12';
    return '#e74c3c';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="history-container">
      <div className="history-card">
        <div className="history-header">
          <h2>Match History</h2>
          <button className="btn-back" onClick={onBack}>← Back to Matcher</button>
        </div>

        {loading && <div className="loading">Loading history...</div>}

        {error && <div className="error-message">{error}</div>}

        {!loading && history.length === 0 && (
          <div className="empty-state">
            <p>No match history yet. Start by analyzing your first CV-JD pair!</p>
          </div>
        )}

        {!loading && history.length > 0 && (
          <div className="history-list">
            {history.map((result) => (
              <div key={result.id} className="history-item">
                <div className="history-item-header">
                  <div className="history-score">
                    <span 
                      className="score-badge" 
                      style={{ backgroundColor: getScoreColor(result.overall_match) }}
                    >
                      {result.overall_match}%
                    </span>
                  </div>
                  <div className="history-time">
                    {formatDate(result.created_at)}
                  </div>
                </div>

                <div className="history-item-body">
                  <div className="history-text">
                    <h4>CV Preview:</h4>
                    <p>{result.cv_text.substring(0, 150)}...</p>
                  </div>
                  <div className="history-text">
                    <h4>JD Preview:</h4>
                    <p>{result.jd_text.substring(0, 150)}...</p>
                  </div>
                </div>

                <div className="history-item-scores">
                  <div className="mini-score">
                    <span>Skills: {result.skill_match}%</span>
                  </div>
                  <div className="mini-score">
                    <span>Exp: {result.experience_match}%</span>
                  </div>
                  <div className="mini-score">
                    <span>Edu: {result.education_match}%</span>
                  </div>
                  <div className="mini-score">
                    <span>Semantic: {result.semantic_similarity}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
