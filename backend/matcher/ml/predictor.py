import joblib
import re
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import os

# Load once (global) - model path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODEL_PATH = os.path.join(BASE_DIR, "overall_match_regression_model.pkl")

try:
    reg_model = joblib.load(MODEL_PATH)
    bert_model = SentenceTransformer("all-MiniLM-L6-v2")
except FileNotFoundError:
    raise FileNotFoundError(f"Model file not found at {MODEL_PATH}. Please ensure the pickle file is in the project root.")

SKILLS = [
    "python", "java", "sql", "machine learning", "deep learning", "nlp",
    "data analysis", "recruitment", "accounting", "sales", "management",
    "c++", "javascript", "typescript", "react", "angular", "vue",
    "node.js", "express", "django", "flask", "spring", "asp.net",
    "aws", "azure", "gcp", "docker", "kubernetes", "git",
    "agile", "scrum", "devops", "ci/cd", "testing", "qa"
]


def clean_text(text):
    """Clean and normalize text"""
    text = text.lower()
    text = re.sub(r'[^a-z0-9 ]', ' ', text)
    return re.sub(r'\s+', ' ', text).strip()


def extract_skills(text):
    """Extract skills from text"""
    return list(set(skill for skill in SKILLS if skill in text))


def extract_experience(text):
    """Extract years of experience from text"""
    match = re.search(r'(\d+)\+?\s*(years|yrs|year|yr)', text)
    return int(match.group(1)) if match else 0


def extract_degree(text):
    """Extract education degree from text"""
    if "phd" in text or "ph.d" in text:
        return "PhD"
    if "master" in text or "msc" in text or "m.sc" in text:
        return "Master"
    if "bachelor" in text or "bsc" in text or "b.sc" in text:
        return "Bachelor"
    return "Other"


DEGREE_RANK = {"Other": 0, "Bachelor": 1, "Master": 2, "PhD": 3}


def education_score(cv, jd):
    """Calculate education matching score"""
    if DEGREE_RANK[jd] == 0:
        return 50
    if DEGREE_RANK[cv] >= DEGREE_RANK[jd]:
        return 100
    return 70


def predict_match(cv_text, jd_text):
    """Predict CV-JD matching score"""
    cv = clean_text(cv_text)
    jd = clean_text(jd_text)

    cv_skills = extract_skills(cv)
    jd_skills = extract_skills(jd)

    skill_pct = (
        len(set(cv_skills) & set(jd_skills)) / len(jd_skills)
        if jd_skills else 0
    ) * 100

    exp_pct = min(extract_experience(cv) / max(extract_experience(jd), 1), 1) * 100
    edu_pct = education_score(extract_degree(cv), extract_degree(jd))

    cv_vec = bert_model.encode([cv])
    jd_vec = bert_model.encode([jd])
    semantic = cosine_similarity(cv_vec, jd_vec)[0][0] * 100

    X = np.array([[skill_pct, exp_pct, edu_pct, semantic]])
    overall = float(reg_model.predict(X)[0])

    return {
        "skill_match": round(skill_pct, 2),
        "experience_match": round(exp_pct, 2),
        "education_match": round(edu_pct, 2),
        "semantic_similarity": round(semantic, 2),
        "overall_match": round(overall, 2)
    }
