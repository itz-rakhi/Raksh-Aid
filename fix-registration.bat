@echo off
color 0E
title Fix Registration Issue

echo ========================================
echo   Fixing Registration Issue
echo ========================================
echo.

echo Step 1: Checking if backend is running...
echo.

curl http://localhost:3000/api/contacts/test@test.com >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Backend is NOT running!
    echo.
    echo Starting backend server...
    cd backend
    start cmd /k "title RAKSH-AID Backend && color 0B && npm start"
    cd ..
    echo.
    echo ✅ Backend server started in new window
    echo Please wait 5 seconds for it to initialize...
    timeout /t 5 >nul
) else (
    echo ✅ Backend is running
)

echo.
echo Step 2: Clearing users table...
echo.

mysql -u root -pRakhi@2005 -e "USE rakshaaid_database; DELETE FROM users; ALTER TABLE users AUTO_INCREMENT = 1;"

if %errorlevel% equ 0 (
    echo ✅ Users table cleared successfully!
) else (
    echo ❌ Failed to clear users table
    echo.
    echo Trying to recreate database...
    mysql -u root -pRakhi@2005 -e "DROP DATABASE IF EXISTS rakshaaid_database; CREATE DATABASE rakshaaid_database; USE rakshaaid_database; CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, email VARCHAR(255) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, blood_group VARCHAR(10), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP); CREATE TABLE emergency_contacts (id INT AUTO_INCREMENT PRIMARY KEY, user_email VARCHAR(255) NOT NULL, contact_id BIGINT NOT NULL, name VARCHAR(255) NOT NULL, phone VARCHAR(20) NOT NULL, email VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE); CREATE TABLE sos_alerts (id INT AUTO_INCREMENT PRIMARY KEY, user_email VARCHAR(255) NOT NULL, latitude DECIMAL(10, 8) NOT NULL, longitude DECIMAL(11, 8) NOT NULL, risk_level VARCHAR(20) NOT NULL, risk_factors TEXT, active BOOLEAN DEFAULT TRUE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE); CREATE TABLE alert_stats (id INT AUTO_INCREMENT PRIMARY KEY, user_email VARCHAR(255) UNIQUE NOT NULL, total_alerts INT DEFAULT 0, active_alerts INT DEFAULT 0, last_alert_time TIMESTAMP NULL, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE); CREATE TABLE cyber_complaints (id INT AUTO_INCREMENT PRIMARY KEY, user_email VARCHAR(255) NOT NULL, complaint_type VARCHAR(100) NOT NULL, description TEXT NOT NULL, evidence_url VARCHAR(500), status VARCHAR(50) DEFAULT 'Pending', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE);"
    echo ✅ Database recreated!
)

echo.
echo Step 3: Verifying database...
echo.

mysql -u root -pRakhi@2005 -e "USE rakshaaid_database; SELECT COUNT(*) as user_count FROM users;"

echo.
echo ========================================
echo   Fix Complete! ✅
echo ========================================
echo.
echo Now you can:
echo 1. Open login.html
echo 2. Click Register tab
echo 3. Enter your details
echo 4. Register successfully!
echo.

timeout /t 3 >nul
start login.html

pause
