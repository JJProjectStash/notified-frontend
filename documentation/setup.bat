@echo off
REM Notified Frontend Setup Script for Windows

echo.
echo ==============================================
echo   Notified Frontend Setup
echo ==============================================
echo.

REM Check Node.js
echo [1/5] Checking Node.js...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed
    echo Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)
node -v
echo [OK] Node.js detected
echo.

REM Install dependencies
echo [2/5] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)
echo [OK] Dependencies installed
echo.

REM Create .env file
echo [3/5] Setting up environment...
if not exist ".env" (
    copy .env.example .env
    echo [OK] .env file created
    echo [WARNING] Please edit .env with your API URL
) else (
    echo [INFO] .env file already exists
)
echo.

REM Setup Husky
echo [4/5] Setting up Git hooks...
call npm run prepare 2>nul
echo [OK] Git hooks configured
echo.

REM Format code
echo [5/5] Formatting code...
call npm run format
echo [OK] Code formatted
echo.

echo ==============================================
echo   Setup Complete!
echo ==============================================
echo.
echo Next steps:
echo   1. Edit .env with your API URL
echo   2. Run: npm run dev
echo   3. Open: http://localhost:5173
echo.
echo Happy coding!
echo.
pause
