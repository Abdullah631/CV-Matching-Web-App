@echo off
REM Start both servers (requires two terminal windows)
echo.
echo ========================================
echo CV-JD Matcher - Full Stack Startup
echo ========================================
echo.
echo This will open the backend and frontend servers.
echo Please wait for both to start...
echo.

REM Start backend in new window
start "CV-JD Matcher Backend" cmd /k "start_backend.bat"

REM Wait a moment before starting frontend
timeout /t 3 /nobreak

REM Start frontend in new window
start "CV-JD Matcher Frontend" cmd /k "start_frontend.bat"

echo.
echo ========================================
echo Servers starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo ========================================
echo.

pause
