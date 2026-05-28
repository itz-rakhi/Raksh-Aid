@echo off
echo ========================================
echo RAKSH-AID Database Setup
echo ========================================
echo.

echo Step 1: Setting up MySQL database...
echo Rakhi@2005
echo.

mysql -u root -p < backend\database_setup.sql

if %errorlevel% equ 0 (
    echo.
    echo ✅ Database created successfully!
    echo.
    echo Step 2: Starting backend server...
    echo.
    cd backend
    start cmd /k "npm start"
    cd ..
    echo.
    echo ✅ Backend server started in new window!
    echo.
    echo ========================================
    echo Setup Complete!
    echo ========================================
    echo.
    echo Database: rakshaaid_database
    echo Server: http://localhost:3000
    echo.
    echo You can now open index.html in your browser.
    echo.
) else (
    echo.
    echo ❌ Database setup failed!
    echo Please check your MySQL credentials.
    echo.
)

pause
