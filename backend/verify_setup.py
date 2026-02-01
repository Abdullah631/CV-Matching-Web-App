#!/usr/bin/env python
"""
Quick verification script to test if the project is set up correctly.
Run this from the backend directory after activating the virtual environment.
"""

import os
import sys
import subprocess

def check_python():
    """Check Python version"""
    print("✓ Checking Python version...", end=" ")
    version = sys.version_info
    if version.major >= 3 and version.minor >= 8:
        print(f"✅ Python {version.major}.{version.minor}.{version.micro}")
        return True
    else:
        print(f"❌ Python {version.major}.{version.minor} (Need 3.8+)")
        return False

def check_django():
    """Check Django installation"""
    print("✓ Checking Django...", end=" ")
    try:
        import django
        print(f"✅ Django {django.VERSION[0]}.{django.VERSION[1]}.{django.VERSION[2]}")
        return True
    except ImportError:
        print("❌ Django not installed. Run: pip install -r requirements.txt")
        return False

def check_drf():
    """Check Django REST Framework"""
    print("✓ Checking Django REST Framework...", end=" ")
    try:
        import rest_framework
        print(f"✅ DRF installed")
        return True
    except ImportError:
        print("❌ DRF not installed")
        return False

def check_ml_model():
    """Check ML model file"""
    print("✓ Checking ML model file...", end=" ")
    model_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "overall_match_regression_model.pkl"))
    if os.path.exists(model_path):
        size_mb = os.path.getsize(model_path) / (1024 * 1024)
        print(f"✅ Found ({size_mb:.1f} MB)")
        return True
    else:
        print(f"❌ Not found at {model_path}")
        return False

def check_database():
    """Check database setup"""
    print("✓ Checking database...", end=" ")
    db_path = os.path.join(os.path.dirname(__file__), "db.sqlite3")
    if os.path.exists(db_path):
        size_kb = os.path.getsize(db_path) / 1024
        print(f"✅ SQLite DB exists ({size_kb:.0f} KB)")
        return True
    else:
        print("⚠️  Database not initialized yet (will be created on first run)")
        return True  # Not an error, will be created

def check_predictor():
    """Check ML predictor module"""
    print("✓ Checking ML predictor module...", end=" ")
    try:
        from matcher.ml.predictor import predict_match
        print(f"✅ Predictor loaded")
        return True
    except ImportError as e:
        print(f"❌ Error: {e}")
        return False

def check_settings():
    """Check Django settings"""
    print("✓ Checking Django settings...", end=" ")
    try:
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cvmatcher.settings')
        import django
        django.setup()
        print(f"✅ Settings valid")
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    """Run all checks"""
    print("\n" + "="*60)
    print("CV-JD Matcher Backend Verification")
    print("="*60 + "\n")

    checks = [
        ("Python Version", check_python),
        ("Django Installation", check_django),
        ("Django REST Framework", check_drf),
        ("ML Model File", check_ml_model),
        ("Database Setup", check_database),
        ("ML Predictor Module", check_predictor),
        ("Django Settings", check_settings),
    ]

    results = []
    for name, check_func in checks:
        try:
            result = check_func()
            results.append((name, result))
        except Exception as e:
            print(f"❌ Error: {e}")
            results.append((name, False))

    print("\n" + "="*60)
    print("Summary")
    print("="*60)

    passed = sum(1 for _, result in results if result)
    total = len(results)

    for name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {name}")

    print(f"\nResult: {passed}/{total} checks passed")

    if passed == total:
        print("\n🎉 All checks passed! Backend is ready to run.")
        print("Start with: python manage.py runserver")
        return 0
    else:
        print("\n⚠️  Some checks failed. Review the issues above.")
        print("Make sure to:")
        print("1. Activate virtual environment: venv\\Scripts\\activate")
        print("2. Install dependencies: pip install -r requirements.txt")
        print("3. Run migrations: python manage.py migrate")
        return 1

if __name__ == "__main__":
    sys.exit(main())
