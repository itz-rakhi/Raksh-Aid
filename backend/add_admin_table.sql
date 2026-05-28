-- Add admin table to existing database

USE rakshaaid_database;

-- Create admin table
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin (password: Admin@19)
INSERT INTO admins (username, password, full_name) 
VALUES ('admin', '$2a$10$8K1p/a0dL3LKzao0gPHd4.WzV5qF5YQYQ5nY5JZ5Z5Z5Z5Z5Z5Z5Z', 'System Administrator')
ON DUPLICATE KEY UPDATE username=username;

-- Verify
SELECT 'Admin table created successfully!' as status;
SHOW TABLES;
