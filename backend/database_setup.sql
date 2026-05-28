-- Complete Database Setup for RAKSH-AID
-- Drop old database and create new one

DROP DATABASE IF EXISTS rakshaaid_db;
DROP DATABASE IF EXISTS rakshaaid_database;

CREATE DATABASE rakshaaid_database;
USE rakshaaid_database;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    blood_group VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Emergency contacts table
CREATE TABLE emergency_contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    contact_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE,
    INDEX idx_user_email (user_email)
);

-- SOS alerts table
CREATE TABLE sos_alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    risk_level VARCHAR(20) NOT NULL,
    risk_factors TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE,
    INDEX idx_user_email (user_email),
    INDEX idx_created_at (created_at)
);

-- Alert stats table
CREATE TABLE alert_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(255) UNIQUE NOT NULL,
    total_alerts INT DEFAULT 0,
    active_alerts INT DEFAULT 0,
    last_alert_time TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
);

-- Volunteers table
CREATE TABLE volunteers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    license_no VARCHAR(50) NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL,
    city VARCHAR(100) NOT NULL,
    availability VARCHAR(50) NOT NULL,
    gender ENUM('male', 'female') NOT NULL,
    status ENUM('Pending Verification', 'Verified', 'Rejected') DEFAULT 'Pending Verification',
    registered_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_gender (gender),
    INDEX idx_status (status),
    INDEX idx_city (city)
);

-- Cyber complaints table
CREATE TABLE cyber_complaints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    complaint_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    evidence_url VARCHAR(500),
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE,
    INDEX idx_user_email (user_email),
    INDEX idx_status (status)
);

-- Show all tables
SHOW TABLES;

-- Verify table structures
DESCRIBE users;
DESCRIBE emergency_contacts;
DESCRIBE sos_alerts;
DESCRIBE alert_stats;
DESCRIBE cyber_complaints;
DESCRIBE volunteers;
