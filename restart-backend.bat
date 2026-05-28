@echo off
echo Killing existing backend on port 3000...

for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do taskkill /F /PID %%a

echo.
echo Starting backend...
cd backend
start cmd /k "title RAKSH-AID Backend && npm start"
cd ..

echo.
echo ✅ Backend restarted!
timeout /t 2 >nul
