@echo off
color 0A
title RAKSH-AID Automatic Database Setup

echo ========================================
echo   RAKSH-AID Automatic Setup
echo ========================================
echo.
echo This will:
echo 1. Create database: rakshaaid_database
echo 2. Create all tables
echo 3. Start backend server
echo 4. Open test page
echo.
echo Press any key to continue...
pause >nul

echo.
echo [Step 1/5] Creating database and tables...
echo.

mysql -u root -pRakhi@2005 -e "DROP DATABASE IF EXISTS rakshaaid_db; DROP DATABASE IF EXISTS rakshaaid_database; CREATE DATABASE rakshaaid_database; USE rakshaaid_database; CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, email VARCHAR(255) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, blood_group VARCHAR(10), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP); CREATE TABLE emergency_contacts (id INT AUTO_INCREMENT PRIMARY KEY, user_email VARCHAR(255) NOT NULL, contact_id BIGINT NOT NULL, name VARCHAR(255) NOT NULL, phone VARCHAR(20) NOT NULL, email VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE, INDEX idx_user_email (user_email)); CREATE TABLE sos_alerts (id INT AUTO_INCREMENT PRIMARY KEY, user_email VARCHAR(255) NOT NULL, latitude DECIMAL(10, 8) NOT NULL, longitude DECIMAL(11, 8) NOT NULL, risk_level VARCHAR(20) NOT NULL, risk_factors TEXT, active BOOLEAN DEFAULT TRUE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE, INDEX idx_user_email (user_email), INDEX idx_created_at (created_at)); CREATE TABLE alert_stats (id INT AUTO_INCREMENT PRIMARY KEY, user_email VARCHAR(255) UNIQUE NOT NULL, total_alerts INT DEFAULT 0, active_alerts INT DEFAULT 0, last_alert_time TIMESTAMP NULL, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE); CREATE TABLE cyber_complaints (id INT AUTO_INCREMENT PRIMARY KEY, user_email VARCHAR(255) NOT NULL, complaint_type VARCHAR(100) NOT NULL, description TEXT NOT NULL, evidence_url VARCHAR(500), status VARCHAR(50) DEFAULT 'Pending', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE, INDEX idx_user_email (user_email), INDEX idx_status (status));"

if %errorlevel% equ 0 (
    echo ✅ Database and tables created successfully!
) else (
    echo ❌ Database creation failed!
    echo.
    echo Please check:
    echo 1. MySQL is running
    echo 2. Password is correct: Rakhi@2005
    echo.
    pause
    exit
)

echo.
echo [Step 2/5] Verifying tables...
echo.

mysql -u root -pRakhi@2005 -e "USE rakshaaid_database; SHOW TABLES;"

echo.
echo [Step 3/5] Installing backend dependencies...
echo.

cd backend
if not exist node_modules (
    call npm install
)

echo.
echo [Step 4/5] Starting backend server...
echo.

start cmd /k "title RAKSH-AID Backend && color 0B && npm start"

cd ..

echo.
echo [Step 5/5] Opening test page...
echo.

timeout /t 3 >nul
start manage-users.html

echo.
echo ========================================
echo   Setup Complete! ✅
echo ========================================
echo.
echo ✅ Database: rakshaaid_database
echo ✅ Tables: users, emergency_contacts, sos_alerts, alert_stats, cyber_complaints
echo ✅ Backend: http://localhost:3000
echo.
echo Next Steps:
echo 1. Wait for backend to start (check the new window)
echo 2. Use manage-users.html to register
echo 3. Or open login.html to register/login
echo.
echo Database Info:
echo - Host: localhost
echo - User: root
echo - Password: Rakhi@2005
echo - Database: rakshaaid_database
echo.

pause
