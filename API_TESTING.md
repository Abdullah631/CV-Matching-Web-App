# API Testing Guide

## Using cURL (Command Line)

### Test 1: Predict CV-JD Match

```bash
curl -X POST http://localhost:8000/api/matches/predict/ \
  -H "Content-Type: application/json" \
  -d '{
    "cv_text": "Senior Software Engineer with 5 years experience in Python, Machine Learning, and SQL. Bachelor degree in Computer Science. Skilled in Deep Learning and NLP. Built multiple ML models.",
    "jd_text": "Senior Python Developer - Looking for 4+ years experience with Machine Learning and SQL skills. Bachelor degree required. Deep Learning and NLP knowledge preferred."
  }'
```

### Test 2: Get Match History

```bash
curl http://localhost:8000/api/matches/history/
```

## Using Postman

### Import Configuration

1. Open Postman
2. Create new request
3. Method: POST
4. URL: `http://localhost:8000/api/matches/predict/`
5. Headers: Add `Content-Type: application/json`
6. Body (raw JSON):
```json
{
  "cv_text": "Senior Software Engineer with 5 years experience...",
  "jd_text": "Senior Python Developer - Looking for 4+ years..."
}
```
7. Click Send

### Expected Response

```json
{
  "id": 1,
  "cv_text": "Senior Software Engineer with 5 years experience...",
  "jd_text": "Senior Python Developer - Looking for 4+ years...",
  "skill_match": 85.50,
  "experience_match": 90.00,
  "education_match": 100.00,
  "semantic_similarity": 88.75,
  "overall_match": 91.06,
  "created_at": "2024-01-15T10:30:00Z"
}
```

## Using Python

```python
import requests
import json

# API endpoint
url = "http://localhost:8000/api/matches/predict/"

# Request data
data = {
    "cv_text": "Senior Software Engineer with 5 years experience in Python, Machine Learning, and SQL...",
    "jd_text": "Senior Python Developer - Looking for 4+ years experience with Machine Learning..."
}

# Make request
headers = {"Content-Type": "application/json"}
response = requests.post(url, json=data, headers=headers)

# Print response
print(response.status_code)
print(json.dumps(response.json(), indent=2))
```

## Using JavaScript/Fetch

```javascript
// API endpoint
const url = "http://localhost:8000/api/matches/predict/";

// Request data
const data = {
  cv_text: "Senior Software Engineer with 5 years experience...",
  jd_text: "Senior Python Developer - Looking for 4+ years..."
};

// Make request
fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(data)
})
.then(response => response.json())
.then(result => console.log(result))
.catch(error => console.error("Error:", error));
```

## Sample Test Data

### Sample CV 1 - Good Match
```
Senior Software Engineer

Experience:
- 5 years as Senior Software Engineer at Tech Company
- 3 years as Software Developer at Startup

Skills:
- Python programming
- Java development
- SQL databases
- Machine Learning (Deep Learning, NLP)
- Data analysis and visualization
- Django web framework

Education:
- Bachelor's degree in Computer Science from University X

Projects:
- Built ML models for sentiment analysis
- Developed REST APIs using Django
- Analyzed large datasets for insights
```

### Sample JD 1 - Matching Job Description
```
Senior Software Engineer - Machine Learning

About the Role:
We're looking for an experienced Software Engineer to join our ML team.

Requirements:
- 4+ years of software development experience
- Proficiency in Python
- Strong SQL knowledge
- Experience with Machine Learning and NLP
- Bachelor's degree in Computer Science or related field
- Familiar with Java is a plus

Responsibilities:
- Develop machine learning models
- Build data analysis pipelines
- Design and implement APIs
```

### Sample CV 2 - Fair Match
```
Junior Developer

Experience:
- 2 years as Junior Developer
- Internship experience

Skills:
- Python basics
- HTML/CSS
- JavaScript

Education:
- Bachelor's degree in IT
```

### Sample JD 2 - Mismatched Job Description
```
Senior Data Scientist

Requirements:
- 8+ years data science experience
- PhD in Statistics or Mathematics
- Advanced Python and R
- Deep expertise in ML/AI
- Published research papers

Responsibilities:
- Lead research initiatives
- Develop advanced ML algorithms
- Mentor junior scientists
```

## Response Code Reference

| Code | Meaning |
|------|---------|
| 201 | Created - Successfully predicted |
| 400 | Bad Request - Invalid input data |
| 500 | Server Error - Backend issue |

## Error Examples

### Error: Missing Field
```json
{
  "cv_text": ["This field is required."]
}
```

### Error: Text Too Short
```json
{
  "cv_text": ["CV text must be at least 10 characters long"]
}
```

## Performance Notes

- First request: ~5-10 seconds (BERT model loading)
- Subsequent requests: <1 second
- Result saved to database immediately

## Batch Testing Script

```python
# test_api.py
import requests
import json
import time

BASE_URL = "http://localhost:8000/api"

test_cases = [
    {
        "name": "High Match",
        "cv_text": "Senior Python Developer with 5+ years ML experience...",
        "jd_text": "Senior Python Dev needed, 4+ years ML required..."
    },
    {
        "name": "Low Match",
        "cv_text": "Junior HTML Developer...",
        "jd_text": "Senior Data Scientist with PhD required..."
    }
]

for test in test_cases:
    print(f"\n{'='*50}")
    print(f"Testing: {test['name']}")
    print('='*50)
    
    response = requests.post(
        f"{BASE_URL}/matches/predict/",
        json={
            "cv_text": test["cv_text"],
            "jd_text": test["jd_text"]
        }
    )
    
    if response.status_code == 201:
        result = response.json()
        print(f"Overall Match: {result['overall_match']}%")
        print(f"Skills: {result['skill_match']}%")
        print(f"Experience: {result['experience_match']}%")
        print(f"Education: {result['education_match']}%")
    else:
        print(f"Error: {response.status_code}")
        print(response.json())

# Get history
print(f"\n{'='*50}")
print("Fetching History...")
print('='*50)

response = requests.get(f"{BASE_URL}/matches/history/")
print(f"Total matches: {len(response.json())}")
```

Run with: `python test_api.py`

## Debugging Tips

1. **Check Backend is Running**
   ```bash
   curl http://localhost:8000/api/matches/history/
   ```

2. **Check Request Format**
   - Ensure JSON is valid
   - Check Content-Type header
   - Verify required fields

3. **Check Response Headers**
   ```bash
   curl -i http://localhost:8000/api/matches/predict/
   ```

4. **View Database Records**
   - Go to http://localhost:8000/admin
   - Login and browse Match Results
