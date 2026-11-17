@echo off
cd /d "%~dp0"
where node >nul 2>&1
if errorlevel 1 (
  echo Please install Node.js LTS from https://nodejs.org/
  pause
  exit /b 1
)
echo Starting Northstar... two terminal windows will open.
start "Northstar API" /D "%~dp0backend" cmd /k "npm install && npm run dev"
start "Northstar Website" /D "%~dp0frontend" cmd /k "npm install && npm run dev"
echo Once the servers start, open http://localhost:5173
pause
