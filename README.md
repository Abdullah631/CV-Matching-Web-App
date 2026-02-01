# CV-JD Matcher - Full Stack Application

A professional full-stack application that uses AI and machine learning to match CVs with job descriptions.

## Project Structure

```
cvmodel/
├── backend/                          # Django REST API
│   ├── cvmatcher/                   # Django project settings
│   ├── api/                         # REST API application
│   ├── matcher/ml/                  # ML model integration
│   ├── manage.py                    # Django management script
│   ├── requirements.txt             # Python dependencies
│   └── overall_match_regression_model.pkl  # Pre-trained ML model
│
└── frontend/                         # React application
    ├── src/
    │   ├── components/              # React components
    │   ├── App.js                   # Main app component
    │   └── index.js                 # React entry point
    ├── public/
    │   └── index.html               # HTML template
    └── package.json                 # Node dependencies
```

## Features

✨ **AI-Powered Matching**
- Skills matching analysis
- Experience level comparison
- Education qualification analysis
- Semantic similarity using BERT embeddings

📊 **Results Dashboard**
- Overall match percentage
- Detailed breakdown of each metric
- Visual score representations
- Color-coded match indicators

📜 **Match History**
- View previous analyses
- Quick score summaries
- Full CV and JD preview

📱 **Responsive Design**
- Works on desktop, tablet, and mobile
- Professional color scheme (Blue/Gray)
- Smooth animations and transitions

## Setup Instructions

### Backend Setup

#### 1. Navigate to backend directory
```bash
cd backend
```

#### 2. Create virtual environment
```bash
python -m venv venv
```

#### 3. Activate virtual environment
- **Windows:**
  ```bash
  venv\Scripts\activate
  ```
- **macOS/Linux:**
  ```bash
  source venv/bin/activate
  ```

#### 4. Install dependencies
```bash
pip install -r requirements.txt
```

#### 5. Run database migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

#### 6. Create superuser (optional, for admin panel)
```bash
python manage.py createsuperuser
```

#### 7. Start Django development server
```bash
python manage.py runserver
```

The backend will be available at: **http://localhost:8000**

### Frontend Setup

#### 1. Navigate to frontend directory
```bash
cd frontend
```

#### 2. Install dependencies
```bash
npm install
```

#### 3. Start development server
```bash
npm start
```

The frontend will automatically open at: **http://localhost:3000**

## Usage

1. **Open the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api/

2. **Analyze a CV-JD Pair**
   - Paste your CV text in the first textarea
   - Paste the job description in the second textarea
   - Click "Analyze Match"
   - View detailed results with metrics

3. **View History**
   - Click "View History" button
   - See previous matches and their scores
   - Review match summaries

## API Endpoints

### POST `/api/matches/predict/`
Predict CV-JD match scores

**Request:**
```json
{
  "cv_text": "Your CV text...",
  "jd_text": "Job description text..."
}
```

**Response:**
```json
{
  "id": 1,
  "cv_text": "...",
  "jd_text": "...",
  "skill_match": 75.50,
  "experience_match": 80.00,
  "education_match": 100.00,
  "semantic_similarity": 82.15,
  "overall_match": 84.41,
  "created_at": "2024-01-15T10:30:00Z"
}
```

### GET `/api/matches/history/`
Get recent match results (last 50)

**Response:**
```json
[
  {
    "id": 1,
    "cv_text": "...",
    "jd_text": "...",
    "skill_match": 75.50,
    "experience_match": 80.00,
    "education_match": 100.00,
    "semantic_similarity": 82.15,
    "overall_match": 84.41,
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

## Technology Stack

### Backend
- **Django 4.2** - Web framework
- **Django REST Framework** - REST API
- **scikit-learn** - Machine learning
- **sentence-transformers** - NLP/BERT embeddings
- **joblib** - Model serialization
- **SQLite** - Database

### Frontend
- **React 18** - UI library
- **Axios** - HTTP client
- **CSS3** - Styling (custom, no framework required)

## Scoring Methodology

The application uses a trained regression model that combines four metrics:

1. **Skill Match (0-100%)**
   - Extracts skills from both CV and JD
   - Calculates percentage of matched skills

2. **Experience Match (0-100%)**
   - Extracts years of experience from both documents
   - Compares against required years

3. **Education Match (0-100%)**
   - Ranks degrees: Other (0) → Bachelor (1) → Master (2) → PhD (3)
   - Awards 100% if CV meets or exceeds JD requirement
   - Awards 70% if CV is below requirement but has some education

4. **Semantic Similarity (0-100%)**
   - Uses BERT embeddings to understand document meaning
   - Compares semantic relevance between CV and JD
   - Provides deep learning-based contextual matching

**Overall Match = Regression Model Output**
- Combines all four metrics
- Provides a unified match percentage
- Trained on historical data

## Troubleshooting

### Port Already in Use
If port 8000 or 3000 is already in use:

```bash
# Django (use different port)
python manage.py runserver 8001

# React (will prompt for different port)
npm start
```

### CORS Errors
Ensure backend is running and CORS is properly configured:
- Backend should be at `http://localhost:8000`
- Frontend proxy is set to the same address

### Model File Not Found
Ensure `overall_match_regression_model.pkl` is in the project root:
```
cvmodel/overall_match_regression_model.pkl
```

### Slow First Request
First request may be slow due to BERT model initialization. Subsequent requests will be faster.

## Customization

### Color Scheme
Edit component CSS files to change colors:
- Primary Blue: `#0066cc`
- Primary Dark: `#1a3a52`
- Success Green: `#27ae60`
- Warning Orange: `#f39c12`
- Error Red: `#e74c3c`

### Skills List
Add/remove skills in `backend/matcher/ml/predictor.py`:
```python
SKILLS = [
    "python", "java", "sql", ...  # Add more skills
]
```

### Model Retraining
To use a new model:
1. Save the trained model as `overall_match_regression_model.pkl`
2. Place it in the project root
3. Ensure it follows the same input/output format

## Performance Notes

- **Backend**: Single-threaded for development. Use gunicorn for production.
- **Frontend**: Optimized React components with minimal re-renders
- **ML Model**: BERT embeddings loaded once on startup for efficiency
- **Database**: SQLite for development. Use PostgreSQL for production.

## Deployment

For production deployment, refer to:
- Django: https://docs.djangoproject.com/en/4.2/howto/deployment/
- React: https://create-react-app.dev/deployment/

## License

This project is provided as-is for educational purposes.
