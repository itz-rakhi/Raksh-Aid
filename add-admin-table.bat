@echo off
echo Adding admin table to database...

mysql -u root -pRakhi@2005 -e "USE rakshaaid_database; CREATE TABLE IF NOT EXISTS admins (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(100) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, full_name VARCHAR(255) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);"

if %errorlevel% equ 0 (
    echo ✅ Admin table created!
    echo.
    echo Restarting backend to load new endpoints...
    call restart-backend.bat
    echo.
    echo ✅ Done! Admin dashboard is now connected to database.
) else (
    echo ❌ Failed to create admin table
)

pause
