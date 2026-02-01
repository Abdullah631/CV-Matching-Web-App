# Installation & Setup Checklist

## ✅ Pre-Requisites Verification

### Required Software
- [ ] Python 3.8 or higher installed
  ```bash
  python --version
  ```
- [ ] Node.js and npm installed
  ```bash
  node --version
  npm --version
  ```

### File Location
- [ ] `overall_match_regression_model.pkl` exists in root directory
  ```
  c:\Users\abdul\OneDrive\Desktop\uni\fyp\cvmodel\overall_match_regression_model.pkl
  ```

---

## 🔧 Installation Steps

### Step 1: Backend Installation
- [ ] Open terminal in `backend` folder
- [ ] Create virtual environment:
  ```bash
  python -m venv venv
  ```
- [ ] Activate virtual environment:
  ```bash
  # Windows
  venv\Scripts\activate
  # macOS/Linux
  source venv/bin/activate
  ```
- [ ] Install Python dependencies:
  ```bash
  pip install -r requirements.txt
  ```
  Expected time: 5-10 minutes
  Expected files: `venv/` folder created

- [ ] Run database migrations:
  ```bash
  python manage.py migrate
  ```
  Expected: "Operations to perform: 0" or creates migrations

### Step 2: Frontend Installation
- [ ] Open new terminal in `frontend` folder
- [ ] Install Node dependencies:
  ```bash
  npm install
  ```
  Expected time: 3-5 minutes
  Expected files: `node_modules/` folder created

---

## 🚀 Starting the Application

### Method 1: Windows Batch Files (Easiest)
- [ ] Double-click `start_all.bat` in project root
  OR
- [ ] Double-click `start_backend.bat` in project root
- [ ] In new terminal, double-click `start_frontend.bat`

### Method 2: Manual Start
- [ ] Terminal 1 - Start Backend:
  ```bash
  cd backend
  venv\Scripts\activate  # Windows
  python manage.py runserver
  ```
  Expected: "Starting development server at http://127.0.0.1:8000/"

- [ ] Terminal 2 - Start Frontend:
  ```bash
  cd frontend
  npm start
  ```
  Expected: Browser opens to "http://localhost:3000"

---

## ✅ Verification Checklist

### Backend Verification
- [ ] Terminal shows "Starting development server at http://127.0.0.1:8000/"
- [ ] Django admin panel accessible at http://localhost:8000/admin
- [ ] API working at http://localhost:8000/api/matches/history/

### Frontend Verification
- [ ] React app opens in browser at http://localhost:3000
- [ ] Page shows "CV-JD Matcher" title with navbar
- [ ] Input forms are visible
- [ ] "Analyze Match" button is clickable
- [ ] "View History" button is visible

### Database Verification
- [ ] `db.sqlite3` file created in `backend/` folder
- [ ] Admin panel accessible with username/password

---

## 🧪 Testing the Application

### Test 1: Basic Analysis
- [ ] Paste sample CV text in first textarea
- [ ] Paste sample JD text in second textarea
- [ ] Click "Analyze Match"
- [ ] Results should appear within 10 seconds (first time may take longer)
- [ ] Overall match percentage displayed
- [ ] Four metric cards shown (Skills, Experience, Education, Semantic)

### Test 2: Error Handling
- [ ] Leave CV text empty, try to submit
  - [ ] Error message appears
- [ ] Try with very short text (e.g., "test")
  - [ ] Validation error shown

### Test 3: History Feature
- [ ] Run at least 2 analyses
- [ ] Click "View History" button
- [ ] Previous matches should be listed
- [ ] Each match shows overall score and preview

---

## ⚙️ Configuration (Optional)

### Change Port Numbers
- [ ] Edit backend port:
  ```bash
  # Instead of :8000, use :8001
  python manage.py runserver 8001
  ```
- [ ] Edit frontend port:
  ```bash
  # Windows
  set PORT=3001
  npm start
  # macOS/Linux
  PORT=3001 npm start
  ```

### Customize Color Scheme
- [ ] Edit `frontend/src/components/Navbar.css`
- [ ] Edit `frontend/src/components/MatcherForm.css`
- [ ] Edit `frontend/src/components/ResultsDisplay.css`
- [ ] Change color hex values (e.g., `#0066cc` for blue)

---

## 🐛 Troubleshooting Checklist

### Issue: "Port 8000 already in use"
- [ ] Use different port: `python manage.py runserver 8001`
- [ ] OR: Find process using port:
  ```bash
  netstat -ano | findstr :8000  # Windows
  lsof -i :8000  # macOS/Linux
  ```

### Issue: "ModuleNotFoundError: No module named 'django'"
- [ ] Virtual environment not activated
- [ ] Run: `venv\Scripts\activate` (Windows)
- [ ] Check pip packages: `pip list`

### Issue: "npm: command not found"
- [ ] Node.js not installed
- [ ] Download from https://nodejs.org/
- [ ] Restart terminal after installation

### Issue: CORS error in browser console
- [ ] Backend not running
- [ ] Check http://localhost:8000/api/matches/history/
- [ ] Ensure backend is on :8000

### Issue: Slow first request
- [ ] Normal behavior
- [ ] BERT model downloading (~130MB)
- [ ] Wait up to 30 seconds for first prediction
- [ ] Subsequent requests will be fast

### Issue: "Connection refused" error
- [ ] Both servers must be running
- [ ] Check terminal 1: Django running?
- [ ] Check terminal 2: React running?

---

## 📝 Documentation Reference

| Document | Purpose |
|----------|---------|
| README.md | Complete documentation & features |
| QUICKSTART.md | Quick setup guide |
| PROJECT_SUMMARY.md | Overview & next steps |
| API_TESTING.md | API testing & examples |
| requirements.txt | Backend dependencies |
| package.json | Frontend dependencies |

---

## 🎉 Success Indicators

Your application is ready when:
- [ ] Backend server running on http://localhost:8000
- [ ] Frontend app visible at http://localhost:3000
- [ ] All UI components displaying correctly
- [ ] Form submissions working without errors
- [ ] Results displaying with all metrics
- [ ] History feature showing previous analyses
- [ ] No console errors in browser DevTools

---

## 📱 Testing on Different Devices

### Desktop
- [ ] Chrome: Full functionality
- [ ] Firefox: Full functionality
- [ ] Edge: Full functionality

### Mobile
- [ ] iPhone/Safari: Responsive layout
- [ ] Android/Chrome: Responsive layout
- [ ] Touch controls: Buttons work on tap

---

## 🔒 Security Checklist (For Production)

Before deploying to production:
- [ ] Change `SECRET_KEY` in settings.py
- [ ] Set `DEBUG = False`
- [ ] Create `.env` file with secure variables
- [ ] Use PostgreSQL instead of SQLite
- [ ] Configure ALLOWED_HOSTS
- [ ] Set up HTTPS/SSL certificate
- [ ] Use environment variables for sensitive data
- [ ] Implement authentication if needed
- [ ] Set up proper CORS origins
- [ ] Use production database backups

---

## 📊 Performance Checklist

- [ ] Page loads in < 2 seconds
- [ ] First prediction takes ~5-10 seconds (model load)
- [ ] Subsequent predictions < 1 second
- [ ] History loads quickly
- [ ] No memory leaks (check DevTools)
- [ ] Responsive on slow 3G connection

---

## ✅ Final Verification

Run this test in a terminal:

```bash
# Test backend
curl http://localhost:8000/api/matches/history/

# Test frontend (should see HTML)
curl http://localhost:3000
```

Both should return successful responses (200 status code).

---

## 🎓 Learning Next Steps

1. Review the code structure
2. Read inline comments
3. Understand the ML prediction flow
4. Test API with different data
5. Customize color scheme
6. Deploy to cloud platform

---

## 📞 Getting Help

If you encounter issues:
1. Check relevant documentation file
2. Review error messages carefully
3. Check browser console (F12 → Console)
4. Check terminal output for error details
5. Verify both servers are running
6. Try restarting both servers

Good luck! 🚀
