import joblib
import re
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import os

# =========================
# LOAD MODELS (GLOBAL)
# =========================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODEL_PATH = os.path.join(BASE_DIR, "overall_match_regression_model.pkl")

try:
    reg_model = joblib.load(MODEL_PATH)
    bert_model = SentenceTransformer("all-MiniLM-L6-v2")
except FileNotFoundError:
    raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")

# =========================
# CONSTANTS
# =========================

SKILLS = [
    # IT / Data
    "python", "java", "sql", "machine learning", "deep learning",
    "nlp", "data analysis", "tensorflow", "pytorch",
    "data engineering", "data visualization", "power bi", "tableau",
    "big data", "spark", "hadoop", "cloud computing",
    "aws", "azure", "gcp", "docker", "kubernetes",
    "devops", "ci cd", "git", "github",
    "api development", "rest api", "microservices",
    "cybersecurity", "penetration testing",

    # Software / Engineering
    "software development", "web development", "frontend development",
    "backend development", "full stack development",
    "react", "angular", "vue",
    "django", "flask", "spring boot",
    "system design", "object oriented programming",

    # Business / HR
    "recruitment", "talent acquisition", "payroll",
    "performance management", "training",
    "hr analytics", "employee engagement",
    "organizational development", "workforce planning",
    "policy development", "conflict resolution",

    # Finance
    "accounting", "auditing", "financial analysis", "taxation",
    "budgeting", "forecasting", "risk management",
    "investment analysis", "financial modeling",
    "cost control", "compliance",

    # Marketing / Sales
    "digital marketing", "seo", "content marketing",
    "sales", "lead generation",
    "social media marketing", "email marketing",
    "brand management", "market research",
    "crm", "customer acquisition",

    # Design / Creative
    "ui ux design", "graphic design", "figma",
    "adobe photoshop", "adobe illustrator",
    "video editing", "motion graphics",

    # Operations / Management
    "project management", "agile", "scrum",
    "kanban", "lean management",
    "supply chain management", "operations management",
    "quality assurance", "process improvement",

    # Healthcare / Life Sciences
    "clinical research", "healthcare management",
    "medical data analysis", "biostatistics",
    "public health",

    # Education / Research
    "teaching", "curriculum development",
    "academic research", "technical writing",
    "documentation",

    # Legal / Compliance
    "legal research", "contract management",
    "regulatory compliance", "corporate governance",

    # General / Professional
    "communication", "management", "leadership",
    "problem solving", "critical thinking",
    "time management", "team collaboration",
    "decision making", "adaptability", "negotiation"
]

DEGREE_RANK = {"Other": 0, "Bachelor": 1, "Master": 2, "PhD": 3}

# =========================
# GUARDRAIL CONSTANTS
# =========================

SKILL_MIN = 20          # %
SEMANTIC_MIN = 40       # %
MAX_MISMATCH_SCORE = 45 # %

# =========================
# PREPROCESSING
# =========================

def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9 ]', ' ', text)
    return re.sub(r'\s+', ' ', text).strip()


def extract_skills(text):
    return list(set(skill for skill in SKILLS if skill in text))

# =========================
# EXPERIENCE
# =========================

def extract_experience_years(text):
    text = text.lower()

    year_match = re.search(r'(\d+(\.\d+)?)\s*(years|yrs|year|yr)', text)
    if year_match:
        return float(year_match.group(1))

    month_match = re.search(r'(\d+)\s*(months|month|mos|mo)', text)
    if month_match:
        return round(int(month_match.group(1)) / 12, 2)

    if any(w in text for w in ["intern", "internship", "fresher", "entry level", "entry-level"]):
        return 0.5

    return 0.0


def experience_semantic_score(cv_text, jd_text):
    keywords = ["experience", "intern", "internship", "worked", "employment", "job", "role"]

    def filter_exp(text):
        return " ".join([w for w in text.split() if w in keywords])

    cv_exp = filter_exp(cv_text)
    jd_exp = filter_exp(jd_text)

    if not cv_exp or not jd_exp:
        return 0.3

    cv_vec = bert_model.encode([cv_exp])
    jd_vec = bert_model.encode([jd_exp])
    return float(cosine_similarity(cv_vec, jd_vec)[0][0])


def experience_score(cv_text, jd_text):
    cv_years = extract_experience_years(cv_text)
    jd_years = extract_experience_years(jd_text)

    numeric_score = min(cv_years / max(jd_years, 0.5), 1.0)
    semantic_score = experience_semantic_score(cv_text, jd_text)

    rule_boost = 0.9 if cv_years <= 1 and jd_years <= 1 else 0.5

    final = (0.4 * numeric_score) + (0.4 * semantic_score) + (0.2 * rule_boost)
    return round(final * 100, 2)

# =========================
# EDUCATION
# =========================

def extract_degree(text):
    if "phd" in text or "ph.d" in text:
        return "PhD"
    if "master" in text or "msc" in text or "m.sc" in text:
        return "Master"
    if "bachelor" in text or "bsc" in text or "b.sc" in text:
        return "Bachelor"
    return "Other"


def education_score(cv, jd):
    if DEGREE_RANK[jd] == 0:
        return 50
    if DEGREE_RANK[cv] >= DEGREE_RANK[jd]:
        return 100
    return 70

# =========================
# DOMAIN GUARDRAIL (KEY FIX)
# =========================

def apply_domain_guardrail(skill, semantic, overall):
    # Strong domain mismatch
    if skill < SKILL_MIN and semantic < SEMANTIC_MIN:
        return min(overall, MAX_MISMATCH_SCORE)

    # Extreme mismatch (absolute rejection)
    if skill == 0 and semantic < 30:
        return min(overall, 30)

    return overall

# =========================
# MAIN PREDICTOR
# =========================

def predict_match(cv_text, jd_text):
    cv = clean_text(cv_text)
    jd = clean_text(jd_text)

    # Skills
    cv_skills = extract_skills(cv)
    jd_skills = extract_skills(jd)
    skill_pct = (len(set(cv_skills) & set(jd_skills)) / len(jd_skills) if jd_skills else 0) * 100

    # Experience
    exp_pct = experience_score(cv, jd)

    # Education
    edu_pct = education_score(extract_degree(cv), extract_degree(jd))

    # Semantic
    cv_vec = bert_model.encode([cv])
    jd_vec = bert_model.encode([jd])
    semantic = cosine_similarity(cv_vec, jd_vec)[0][0] * 100

    # Regression prediction
    X = np.array([[skill_pct, exp_pct, edu_pct, semantic]])
    raw_overall = float(reg_model.predict(X)[0])

    # APPLY GUARDRAIL ✅
    overall = apply_domain_guardrail(skill_pct, semantic, raw_overall)

    return {
        "skill_match": round(skill_pct, 2),
        "experience_match": round(exp_pct, 2),
        "education_match": round(edu_pct, 2),
        "semantic_similarity": round(semantic, 2),
        "overall_match": round(overall, 2)
    }
