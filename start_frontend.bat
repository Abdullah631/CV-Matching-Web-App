@echo off
REM Start React Frontend Server
cd frontend

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

REM Start development server
echo.
echo ========================================
echo Starting React Frontend...
echo Frontend will be available at: http://localhost:3000
echo ========================================
echo.
call npm start

pause
