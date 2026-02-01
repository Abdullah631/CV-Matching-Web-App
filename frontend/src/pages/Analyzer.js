import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import './Analyzer.css';

const Analyzer = () => {
  const navigate = useNavigate();
  const [cvText, setCvText] = useState('');
  const [jdText, setJdText] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [jdFile, setJdFile] = useState(null);
  const [cvMode, setCvMode] = useState('text');
  const [jdMode, setJdMode] = useState('text');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cvDragActive, setCvDragActive] = useState(false);
  const [jdDragActive, setJdDragActive] = useState(false);

  const SUPPORTED_FORMATS = ['pdf', 'docx', 'doc', 'txt', 'pptx'];
  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  const validateFile = (file) => {
    if (!file) return { valid: false, error: 'No file selected' };
    const fileName = file.name.toLowerCase();
    const fileExt = fileName.split('.').pop();
    if (!SUPPORTED_FORMATS.includes(fileExt)) {
      return { valid: false, error: `Unsupported format. Supported: ${SUPPORTED_FORMATS.join(', ')}` };
    }
    if (file.size > MAX_FILE_SIZE) {
      return { valid: false, error: `File too large. Maximum ${(MAX_FILE_SIZE / (1024 * 1024)).toFixed(0)}MB` };
    }
    return { valid: true, error: '' };
  };

  const handleCvFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = validateFile(file);
      if (validation.valid) {
        setCvFile(file);
        setError('');
      } else {
        setError(`CV: ${validation.error}`);
      }
    }
  };

  const handleJdFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = validateFile(file);
      if (validation.valid) {
        setJdFile(file);
        setError('');
      } else {
        setError(`JD: ${validation.error}`);
      }
    }
  };

  const handleCvDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setCvDragActive(true);
    } else if (e.type === 'dragleave') {
      setCvDragActive(false);
    }
  };

  const handleCvDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCvDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const validation = validateFile(file);
      if (validation.valid) {
        setCvFile(file);
        setCvMode('file');
        setError('');
      } else {
        setError(`CV: ${validation.error}`);
      }
    }
  };

  const handleJdDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setJdDragActive(true);
    } else if (e.type === 'dragleave') {
      setJdDragActive(false);
    }
  };

  const handleJdDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setJdDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const validation = validateFile(file);
      if (validation.valid) {
        setJdFile(file);
        setJdMode('file');
        setError('');
      } else {
        setError(`JD: ${validation.error}`);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (cvMode === 'text' && !cvText.trim()) {
      setError('Please enter CV text');
      return;
    }
    if (cvMode === 'file' && !cvFile) {
      setError('Please select CV file');
      return;
    }

    if (jdMode === 'text' && !jdText.trim()) {
      setError('Please enter job description text');
      return;
    }
    if (jdMode === 'file' && !jdFile) {
      setError('Please select job description file');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      if (cvMode === 'text') {
        formData.append('cv_text', cvText);
      } else {
        formData.append('cv_file', cvFile);
      }

      if (jdMode === 'text') {
        formData.append('jd_text', jdText);
      } else {
        formData.append('jd_file', jdFile);
      }

      const response = await axios.post(
        API_ENDPOINTS.PREDICT_WITH_FILES,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      navigate('/results', { state: { result: response.data } });
    } catch (err) {
      console.error('Full Error:', err);
      console.error('Error Response:', err.response);
      console.error('Error Message:', err.message);
      
      let errorMsg = 'An error occurred. Please check your inputs and try again.';
      
      if (err.response?.data?.details) {
        errorMsg = err.response.data.details;
      } else if (err.response?.data?.error) {
        errorMsg = err.response.data.error;
      } else if (err.message) {
        errorMsg = `Network error: ${err.message}`;
      }
      
      console.error('Final Error Message:', errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="analyzer">
      <div className="analyzer-container">
        <div className="analyzer-header">
          <h1>Analyze Your CV Match</h1>
          <p>Upload or paste your CV and the job description to see how well you match</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="analyzer-form">
          <div className="analyzer-grid">
            {/* CV Section */}
            <div className="input-section">
              <div className="section-header-small">
                <span className="section-icon">📄</span>
                <h3>Your CV / Resume</h3>
              </div>
              <p className="section-description">Upload your CV file or paste the text content</p>

              <div className="mode-tabs">
                <button
                  type="button"
                  className={`mode-tab ${cvMode === 'text' ? 'active' : ''}`}
                  onClick={() => setCvMode('text')}
                  disabled={loading}
                >
                  📝 Paste Text
                </button>
                <button
                  type="button"
                  className={`mode-tab ${cvMode === 'file' ? 'active' : ''}`}
                  onClick={() => setCvMode('file')}
                  disabled={loading}
                >
                  📤 Upload File
                </button>
              </div>

              {cvMode === 'text' ? (
                <textarea
                  value={cvText}
                  onChange={(e) => setCvText(e.target.value)}
                  placeholder="Paste your CV or resume text here..."
                  className="form-textarea"
                  disabled={loading}
                />
              ) : (
                <div
                  className={`file-upload-area ${cvDragActive ? 'drag-active' : ''}`}
                  onDragEnter={handleCvDrag}
                  onDragLeave={handleCvDrag}
                  onDragOver={handleCvDrag}
                  onDrop={handleCvDrop}
                >
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc,.txt,.pptx"
                    onChange={handleCvFileChange}
                    className="file-input"
                    disabled={loading}
                    id="cv-file-input"
                  />
                  <label htmlFor="cv-file-input" className="file-upload-label">
                    {cvFile ? (
                      <>
                        <span className="file-icon">✅</span>
                        <span className="file-name">{cvFile.name}</span>
                      </>
                    ) : (
                      <>
                        <span className="file-icon">📁</span>
                        <span className="upload-text">Drag file here or click to browse</span>
                      </>
                    )}
                  </label>
                </div>
              )}
            </div>

            {/* JD Section */}
            <div className="input-section">
              <div className="section-header-small">
                <span className="section-icon">💼</span>
                <h3>Job Description</h3>
              </div>
              <p className="section-description">Upload the job description file or paste the text content</p>

              <div className="mode-tabs">
                <button
                  type="button"
                  className={`mode-tab ${jdMode === 'text' ? 'active' : ''}`}
                  onClick={() => setJdMode('text')}
                  disabled={loading}
                >
                  📝 Paste Text
                </button>
                <button
                  type="button"
                  className={`mode-tab ${jdMode === 'file' ? 'active' : ''}`}
                  onClick={() => setJdMode('file')}
                  disabled={loading}
                >
                  📤 Upload File
                </button>
              </div>

              {jdMode === 'text' ? (
                <textarea
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  placeholder="Paste the job description here..."
                  className="form-textarea"
                  disabled={loading}
                />
              ) : (
                <div
                  className={`file-upload-area ${jdDragActive ? 'drag-active' : ''}`}
                  onDragEnter={handleJdDrag}
                  onDragLeave={handleJdDrag}
                  onDragOver={handleJdDrag}
                  onDrop={handleJdDrop}
                >
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc,.txt,.pptx"
                    onChange={handleJdFileChange}
                    className="file-input"
                    disabled={loading}
                    id="jd-file-input"
                  />
                  <label htmlFor="jd-file-input" className="file-upload-label">
                    {jdFile ? (
                      <>
                        <span className="file-icon">✅</span>
                        <span className="file-name">{jdFile.name}</span>
                      </>
                    ) : (
                      <>
                        <span className="file-icon">📁</span>
                        <span className="upload-text">Drag file here or click to browse</span>
                      </>
                    )}
                  </label>
                </div>
              )}
            </div>
          </div>

          <button type="submit" className="btn-analyze" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Analyzing...
              </>
            ) : (
              'Analyze Match'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Analyzer;
