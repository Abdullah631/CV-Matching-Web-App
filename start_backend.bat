@echo off
REM Start Django Backend Server
cd backend

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies if needed
echo Installing/updating dependencies...
pip install -r requirements.txt

REM Run migrations
echo Running migrations...
python manage.py migrate

REM Start server
echo.
echo ========================================
echo Starting Django Server...
echo Backend will be available at: http://localhost:8000
echo ========================================
echo.
python manage.py runserver

pause
