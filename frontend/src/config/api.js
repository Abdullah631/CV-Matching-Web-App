// API Configuration
// Use deployed backend on Render for production, localhost for development

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://cv-matching-web-app.onrender.com';

export const API_ENDPOINTS = {
  PREDICT: `${API_BASE_URL}/api/predict/`,
  PREDICT_WITH_FILES: `${API_BASE_URL}/api/predict-with-files/`,
  SUPPORTED_FORMATS: `${API_BASE_URL}/api/supported-formats/`,
};

export default API_BASE_URL;
