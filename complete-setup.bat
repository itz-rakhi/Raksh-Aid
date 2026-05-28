@echo off
color 0A
echo ========================================
echo    RAKSH-AID Complete Setup
echo ========================================
echo.

echo [1/4] Setting up MySQL database...
echo.
echo Please enter your MySQL root password when prompted.
echo.

mysql -u root -p -e "DROP DATABASE IF EXISTS rakshaaid_db; DROP DATABASE IF EXISTS rakshaaid_database; CREATE DATABASE rakshaaid_database; USE rakshaaid_database; source backend/database_setup.sql;"

if %errorlevel% neq 0 (
    echo.
    echo ❌ Database setup failed!
    echo.
    echo Trying alternative method...
    mysql -u root -p < backend\database_setup.sql
)

if %errorlevel% equ 0 (
    echo.
    echo ✅ Database created successfully!
    echo.
    
    echo [2/4] Verifying database...
    mysql -u root -p -e "USE rakshaaid_database; SHOW TABLES;"
    
    echo.
    echo [3/4] Installing backend dependencies...
    cd backend
    call npm install
    
    echo.
    echo [4/4] Starting backend server...
    echo.
    echo ========================================
    echo    Backend Server Starting...
    echo ========================================
    echo.
    start cmd /k "title RAKSH-AID Backend Server && color 0B && npm start"
    
    cd ..
    
    echo.
    echo ========================================
    echo    Setup Complete! ✅
    echo ========================================
    echo.
    echo Database: rakshaaid_database
    echo Backend: http://localhost:3000
    echo.
    echo Next Steps:
    echo 1. Wait for backend server to start
    echo 2. Open test-login.html to test
    echo 3. Open login.html to register/login
    echo 4. Open index.html to use the app
    echo.
    
    timeout /t 3 >nul
    start test-login.html
    
) else (
    echo.
    echo ❌ Setup failed!
    echo.
    echo Please check:
    echo 1. MySQL is installed and running
    echo 2. Password is correct
    echo 3. You have admin privileges
    echo.
)

pause
