# 🚀 START HERE - How to Run Your Application

## Step 1: Choose Your Method

### 👨‍💻 For Windows Users (Easiest)
Go to your project folder and **double-click this file**:
```
start_all.bat
```

It will automatically:
- Start Django backend on port 8000
- Start React frontend on port 3000
- Open your browser

**Done!** Skip to "Step 2: Test the Application"

---

### 👨‍💻 For Manual Setup (Any OS)

#### Terminal 1 - Start Backend
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

You should see:
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

#### Terminal 2 - Start Frontend
```bash
cd frontend
npm install
npm start
```

You should see:
```
Compiled successfully!
You can now view cv-matcher in the browser.
```

---

## Step 2: Test the Application

### Open Your Browser
Go to: **http://localhost:3000**

You should see:
- 📄 CV-JD Matcher title at the top
- Two text input areas
- "Analyze Match" button

### Try Your First Analysis

1. **Copy this sample CV:**
```
Senior Software Engineer

Experience:
5 years as Senior Software Engineer
Skills: Python, Java, SQL, Machine Learning, Deep Learning
Education: Bachelor's in Computer Science

I have developed multiple machine learning models and worked 
with Python for data analysis and NLP tasks.
```

2. **Paste it in the first text area (Your CV / Resume)**

3. **Copy this sample Job Description:**
```
Senior Software Engineer - Machine Learning

Requirements:
- 4+ years software engineering experience
- Proficiency in Python
- SQL database knowledge
- Machine Learning and NLP experience
- Bachelor's degree in Computer Science or related field

We're looking for a senior engineer to join our ML team.
```

4. **Paste it in the second text area (Job Description)**

5. **Click "Analyze Match"**

### See Your Results!
Within 10 seconds you should see:
- Overall Match Percentage (e.g., 85%)
- 4 detailed scores:
  - 🛠️ Skill Match
  - 💼 Experience Match
  - 🎓 Education Match
  - 🧠 Semantic Similarity
- A detailed breakdown with bars

---

## Step 3: Try More Features

### View Match History
1. Click "View History" button
2. See your previous analyses
3. Each shows overall score and previews

### Test with Your Own Data
1. Paste your real CV
2. Paste a real job description
3. Analyze!

---

## ⚠️ Common Issues & Solutions

### Issue: Browser shows "Cannot reach localhost:3000"
**Solution:** 
- Is Terminal 2 (frontend) running?
- Should show "Compiled successfully!"
- If not running, go to `cd frontend` and run `npm start`

### Issue: "Connection refused" error in browser
**Solution:**
- Is Terminal 1 (backend) running?
- Should show "Starting development server..."
- If not running, go to `cd backend`, activate venv, and run `python manage.py runserver`

### Issue: Takes 10+ seconds on first "Analyze"
**Solution:**
- This is NORMAL!
- The ML model (BERT) is loading from the internet (~130MB)
- Only happens first time
- Future analyses will be <1 second
- **Just wait, don't close the page**

### Issue: "npm: command not found"
**Solution:**
- Node.js not installed
- Download from https://nodejs.org/
- Install and restart your terminal
- Try `npm start` again

### Issue: "ModuleNotFoundError: No module named 'django'"
**Solution:**
- Virtual environment not activated
- Windows: Run `venv\Scripts\activate`
- macOS/Linux: Run `source venv/bin/activate`
- Then try `python manage.py runserver`

### Issue: "Port 8000 already in use"
**Solution:**
- Another app using port 8000
- Use different port: `python manage.py runserver 8001`
- Then visit http://localhost:8001

---

## 📊 Testing Checklist

After starting the app, verify:

- [ ] Browser opens to http://localhost:3000
- [ ] Title "CV-JD Matcher" visible
- [ ] Can type in CV text area
- [ ] Can type in JD text area
- [ ] "Analyze Match" button is clickable
- [ ] "View History" button is visible
- [ ] Click Analyze (wait 10 seconds first time)
- [ ] Results appear with overall percentage
- [ ] Four metric cards display
- [ ] Score breakdown bars show
- [ ] Color scheme looks professional (blue/gray)

If all checked ✅, **you're ready to go!**

---

## 🎯 Next Steps

1. **Explore the Application**
   - Try different CV/JD combinations
   - Notice how scores change
   - Check the color indicators (green/orange/red)

2. **Read the Documentation**
   - README.md - Complete guide
   - API_TESTING.md - Learn the API
   - PROJECT_SUMMARY.md - Understand architecture

3. **Customize (Optional)**
   - Change colors in CSS files
   - Add more skills to predictor
   - Modify database settings

4. **Deploy (Later)**
   - Follow deployment guide in README.md
   - Use production server (gunicorn)
   - Switch to PostgreSQL database

---

## 📞 Need Help?

### Check These Files
1. **INSTALLATION_CHECKLIST.md** - Detailed setup verification
2. **QUICKSTART.md** - Step-by-step guide
3. **API_TESTING.md** - API documentation
4. **README.md** - Comprehensive guide

### Common Questions
- **"How do I stop the servers?"** → Press Ctrl+C in each terminal
- **"How do I use my own model?"** → Replace the .pkl file
- **"Can I deploy this?"** → Yes! See README.md
- **"Can I customize colors?"** → Yes! Edit CSS files in src/components/

---

## 🎉 Success!

Once you see results appearing:

```
✅ Backend running on http://localhost:8000
✅ Frontend running on http://localhost:3000
✅ Can analyze CV-JD matches
✅ Results displaying correctly
✅ History feature working
```

## Congratulations! Your CV-JD Matcher is live! 🚀

---

## 💡 Pro Tips

1. **First Prediction Slow?** 
   - Normal! BERT model loading
   - Future predictions <1 second

2. **Want to Test API?**
   - Visit http://localhost:8000/api/matches/history/
   - Use Postman or cURL
   - See API_TESTING.md for examples

3. **Want to View Database?**
   - Go to http://localhost:8000/admin
   - Create superuser: `python manage.py createsuperuser`
   - Login and browse results

4. **Want to Debug Issues?**
   - Open browser DevTools (F12)
   - Check Console and Network tabs
   - Check terminal output

---

## 🚀 You're All Set!

Everything is configured and ready. Just run the startup script or commands above, and enjoy your AI-powered CV-JD Matcher!

**Happy analyzing!** 📄✨

---

**Version**: 1.0  
**Status**: Ready to Use  
**Last Updated**: February 2026  
**Support**: Check documentation files
