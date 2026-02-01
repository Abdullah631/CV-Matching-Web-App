# Testing File Upload Feature - Quick Start

## Setup

### 1. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

This includes the new packages:
- `PyPDF2==3.0.1` - PDF text extraction
- `python-docx==0.8.11` - Word document handling
- `python-pptx==0.6.21` - PowerPoint support

### 2. Start Backend Server

```bash
# From the backend directory
python manage.py runserver
```

Server should be running at `http://localhost:8000`

### 3. Start Frontend

```bash
cd frontend
npm start
```

Frontend should be running at `http://localhost:3000`

## Testing File Uploads

### Test 1: Upload PDF Resume

1. Prepare a PDF file with resume content
2. Go to the application at `http://localhost:3000`
3. Click "📄 File Upload" for CV section
4. Drag and drop the PDF file OR click to browse
5. Click "Analyze Match"
6. Check the preprocessing statistics in results

**Expected Result:**
- Text extracted from PDF
- CV sections detected (experience, skills, education)
- Match scores calculated

### Test 2: Upload Word Document

1. Create a job description in `.docx` format
2. In the JD section, click "📄 File Upload"
3. Upload the Word document
4. Click "Analyze Match"

**Expected Result:**
- Text extracted from DOCX
- JD sections detected (requirements, responsibilities)
- Analysis completed

### Test 3: Mix Text and File

1. Paste CV text in the "📝 Text Input" mode for CV
2. Upload JD as a file in "📄 File Upload" mode
3. Click "Analyze Match"

**Expected Result:**
- Both inputs processed correctly
- Mixed input handled properly
- Results displayed with preprocessing stats

### Test 4: File Validation

#### Test 4a: Unsupported Format
1. Try to upload a `.doc` file (if using newer Python)
2. Should show: "Unsupported format"

#### Test 4b: File Too Large
1. Create a file larger than 10MB
2. Try to upload
3. Should show: "File too large. Maximum 10MB"

#### Test 4c: Empty File
1. Upload empty text file
2. Should show validation error

## API Testing with cURL

### Test File Upload Directly

```bash
# Create sample files
echo "Experienced software engineer with 5 years of Python development" > sample_cv.txt
echo "We are looking for a Python developer with 3+ years experience" > sample_jd.txt

# Test endpoint
curl -X POST http://localhost:8000/api/matches/predict_with_files/ \
  -F "cv_text=@sample_cv.txt" \
  -F "jd_text=@sample_jd.txt"
```

### Test with Actual Files

```bash
# Assuming you have actual PDF/DOCX files
curl -X POST http://localhost:8000/api/matches/predict_with_files/ \
  -F "cv_file=@resume.pdf" \
  -F "jd_file=@job_posting.docx"
```

## Response Inspection

### Sample Response

```json
{
  "overall_match": 75,
  "skill_match": 82,
  "experience_match": 70,
  "education_match": 68,
  "semantic_similarity": 73,
  "preprocessing_stats": {
    "cv": {
      "original_length": 3456,
      "cleaned_length": 2890,
      "word_count": 450,
      "sections_found": ["experience", "skills", "education"]
    },
    "jd": {
      "original_length": 2345,
      "cleaned_length": 1950,
      "word_count": 320,
      "sections_found": ["requirements", "responsibilities"]
    }
  }
}
```

### Check Preprocessing Results

In the frontend, look for "📊 Text Processing Details" section which shows:
- Original text length
- Cleaned text length
- Detected sections
- Text statistics

## Debugging

### Enable Debug Output

**Backend:**
```python
# In api/views.py
print(f"CV Text Length: {len(cv_text)}")
print(f"JD Text Length: {len(jd_text)}")
print(f"Preprocessing Stats: {preprocessing_stats}")
```

**Frontend Console:**
```javascript
// Check browser console (F12)
console.log('File:', file);
console.log('File size:', file.size);
console.log('File type:', file.type);
```

### Common Issues

#### Issue 1: Module Import Error

```
ImportError: No module named 'PyPDF2'
```

**Solution:**
```bash
pip install PyPDF2==3.0.1 python-docx==0.8.11 python-pptx==0.6.21
```

#### Issue 2: File Extraction Returns Empty

**Possible Causes:**
- PDF is scanned image (no text layer)
- File is corrupted
- Encoding issue with text file

**Solution:**
- Ensure PDF has selectable text
- Try with different file format
- Use plain text for testing

#### Issue 3: Frontend Shows Error

Check browser console (F12 → Console tab) for:
- Network errors (check if backend is running)
- File validation errors
- Request payload issues

## Test Files Creation

### Create Sample CV Text File

```bash
cat > sample_cv.txt << 'EOF'
John Doe
john.doe@email.com | +1-234-567-8900
LinkedIn: linkedin.com/in/johndoe

OBJECTIVE
Experienced Full-Stack Developer seeking Senior Developer position

EXPERIENCE
Software Engineer at TechCorp (2020-Present)
- Developed Python Django REST APIs
- Built React frontend components
- Implemented ML model integration

Junior Developer at StartupXYZ (2018-2020)
- Maintained legacy PHP codebase
- Created database schemas
- Supported production issues

EDUCATION
B.S. Computer Science, University Name (2018)
GPA: 3.8/4.0

SKILLS
- Languages: Python, JavaScript, Java
- Frameworks: Django, React, Spring
- Databases: PostgreSQL, MongoDB
- Tools: Docker, Git, AWS

CERTIFICATIONS
- AWS Certified Solutions Architect
- Google Cloud Certified Associate Cloud Engineer
EOF
```

### Create Sample JD Text File

```bash
cat > sample_jd.txt << 'EOF'
Senior Python Developer
Location: Remote
Salary: $120k-$150k

ABOUT THE ROLE
We are seeking a talented Senior Python Developer to join our backend team. You will work on scalable APIs and microservices.

RESPONSIBILITIES
- Design and develop Python/Django REST APIs
- Collaborate with frontend team on API contracts
- Implement automated testing
- Participate in code reviews
- Mentor junior developers

REQUIREMENTS
- 5+ years of Python development experience
- Strong knowledge of Django and REST frameworks
- Experience with PostgreSQL and NoSQL databases
- Proficiency in Git and CI/CD pipelines
- BS in Computer Science or related field

NICE TO HAVE
- AWS or GCP cloud experience
- Docker and Kubernetes knowledge
- GraphQL experience
- Agile/Scrum experience

BENEFITS
- Competitive salary
- Health insurance
- 401(k) matching
- Remote work flexibility
- Professional development budget
EOF
```

## Verify Installation

### Check Backend

```bash
# In backend directory
python manage.py shell
>>> from matcher.ml.file_extractor import FileExtractor
>>> from matcher.ml.preprocessor import TextPreprocessor
>>> print("✓ File extraction module loaded")
>>> print("✓ Text preprocessing module loaded")
```

### Check Frontend

```bash
# In frontend directory
npm list axios
npm list react
```

Should show:
```
axios@1.x.x
react@18.x.x
```

## Performance Baseline

Time these operations to establish baseline:

1. **PDF Upload (1 page)**
   - Expected: < 1 second
   - Baseline: [Record your time]

2. **DOCX Upload**
   - Expected: < 0.5 seconds
   - Baseline: [Record your time]

3. **Full Analysis (Text + File)**
   - Expected: < 3 seconds
   - Baseline: [Record your time]

## Next Steps After Testing

1. ✅ Verify file uploads work
2. ✅ Check preprocessing stats display
3. ✅ Test all file formats
4. ✅ Test error scenarios
5. ✅ Deploy to production environment

## Support

For issues or questions:
1. Check [FILE_UPLOAD_GUIDE.md](FILE_UPLOAD_GUIDE.md) for detailed documentation
2. Review backend logs: `python manage.py runserver` output
3. Check browser console: F12 → Console tab
4. Verify all dependencies installed: `pip list`

Happy testing! 🚀
