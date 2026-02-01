# Quick Start Guide

## Prerequisites

- Python 3.8+ (Backend)
- Node.js 14+ & npm (Frontend)
- Git (optional)

## One-Time Setup

### Step 1: Backend Setup (5-10 minutes)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start Django server
python manage.py runserver
```

**Expected Output:**
```
Starting development server at http://127.0.0.1:8000/
```

### Step 2: Frontend Setup (5-10 minutes)

In a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start React development server
npm start
```

**Expected Output:**
```
Compiled successfully!
You can now view cv-matcher in the browser.
  Local:            http://localhost:3000
```

## Daily Usage

### Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
# Activate venv if not already active
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

Both servers should now be running:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

## Testing the Application

1. Open http://localhost:3000 in your browser
2. Copy and paste sample CV text (e.g., below)
3. Copy and paste sample JD text
4. Click "Analyze Match"
5. View results

### Sample CV:
```
Senior Software Engineer

I have 5 years of experience as a software engineer specializing in Python and Machine Learning. 
My skills include:
- Python, Java, SQL
- Deep Learning and NLP
- Data Analysis and ML model development
- Django and REST API development

Education:
- Bachelor's degree in Computer Science

I have worked on multiple data analysis projects and built machine learning models.
```

### Sample JD:
```
Senior Software Engineer - Machine Learning

Requirements:
- 4+ years experience with Python
- Knowledge of Machine Learning and NLP
- Experience with SQL databases
- Bachelor's degree required

We're looking for a senior engineer experienced in Python development and ML projects.
```

## Stopping the Application

Press `Ctrl+C` in each terminal window.

## Common Issues

### Issue: "Port 8000 already in use"
**Solution:** Use a different port
```bash
python manage.py runserver 8001
```

### Issue: "CORS error or can't connect to backend"
**Solution:** Make sure both servers are running. Check:
1. Django server: http://localhost:8000/api/matches/history/
2. React server should open automatically

### Issue: "Module not found" (Python)
**Solution:** Make sure virtual environment is activated
```bash
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

### Issue: "npm: command not found"
**Solution:** Install Node.js from https://nodejs.org/

### Issue: Slow first request
**Solution:** First request downloads BERT model (~130MB). Wait 30 seconds on first predict.

## Next Steps

1. ✅ Verify both servers are running
2. ✅ Test with sample CV and JD
3. ✅ Try the History feature
4. ✅ Review scoring in Results section
5. 📖 Read README.md for detailed documentation

## Production Deployment

When ready to deploy:
1. Set `DEBUG=False` in Django settings
2. Use a production database (PostgreSQL recommended)
3. Use a production server (gunicorn, uWSGI)
4. Build React: `npm run build`
5. Serve React build folder statically from Django

See README.md for detailed deployment instructions.
