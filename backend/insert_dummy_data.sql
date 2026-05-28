-- Insert 10 dummy users
USE rakshaaid_database;

INSERT INTO users (name, email, password, blood_group) VALUES
('Priya Sharma', 'priya.sharma@example.com', '$2b$10$abcdefghijklmnopqrstuv', 'O+'),
('Rahul Kumar', 'rahul.kumar@example.com', '$2b$10$abcdefghijklmnopqrstuv', 'A+'),
('Anjali Singh', 'anjali.singh@example.com', '$2b$10$abcdefghijklmnopqrstuv', 'B+'),
('Vikram Patel', 'vikram.patel@example.com', '$2b$10$abcdefghijklmnopqrstuv', 'AB+'),
('Sneha Reddy', 'sneha.reddy@example.com', '$2b$10$abcdefghijklmnopqrstuv', 'O-'),
('Arjun Mehta', 'arjun.mehta@example.com', '$2b$10$abcdefghijklmnopqrstuv', 'A-'),
('Kavya Iyer', 'kavya.iyer@example.com', '$2b$10$abcdefghijklmnopqrstuv', 'B-'),
('Rohan Gupta', 'rohan.gupta@example.com', '$2b$10$abcdefghijklmnopqrstuv', 'AB-'),
('Meera Joshi', 'meera.joshi@example.com', '$2b$10$abcdefghijklmnopqrstuv', 'O+'),
('Aditya Verma', 'aditya.verma@example.com', '$2b$10$abcdefghijklmnopqrstuv', 'A+');

-- Insert 10 dummy SOS alerts
INSERT INTO sos_alerts (user_email, latitude, longitude, risk_level, risk_factors, active) VALUES
('priya.sharma@example.com', 28.6139, 77.2090, 'high', 'Dark area, No crowd', TRUE),
('rahul.kumar@example.com', 19.0760, 72.8777, 'medium', 'Late night', FALSE),
('anjali.singh@example.com', 12.9716, 77.5946, 'low', 'Public place', FALSE),
('vikram.patel@example.com', 22.5726, 88.3639, 'high', 'Isolated location', TRUE),
('sneha.reddy@example.com', 17.3850, 78.4867, 'medium', 'Unknown area', FALSE),
('arjun.mehta@example.com', 13.0827, 80.2707, 'high', 'Dark area, Isolated', TRUE),
('kavya.iyer@example.com', 23.0225, 72.5714, 'low', 'Crowded area', FALSE),
('rohan.gupta@example.com', 26.9124, 75.7873, 'medium', 'Late evening', FALSE),
('meera.joshi@example.com', 18.5204, 73.8567, 'high', 'No crowd, Dark', TRUE),
('aditya.verma@example.com', 21.1458, 79.0882, 'low', 'Safe area', FALSE);

-- Insert 10 dummy alert stats
INSERT INTO alert_stats (user_email, total_alerts, active_alerts, last_alert_time) VALUES
('priya.sharma@example.com', 5, 1, NOW() - INTERVAL 2 HOUR),
('rahul.kumar@example.com', 3, 0, NOW() - INTERVAL 1 DAY),
('anjali.singh@example.com', 1, 0, NOW() - INTERVAL 3 DAY),
('vikram.patel@example.com', 7, 1, NOW() - INTERVAL 5 HOUR),
('sneha.reddy@example.com', 2, 0, NOW() - INTERVAL 2 DAY),
('arjun.mehta@example.com', 4, 1, NOW() - INTERVAL 1 HOUR),
('kavya.iyer@example.com', 1, 0, NOW() - INTERVAL 5 DAY),
('rohan.gupta@example.com', 3, 0, NOW() - INTERVAL 4 DAY),
('meera.joshi@example.com', 6, 1, NOW() - INTERVAL 3 HOUR),
('aditya.verma@example.com', 2, 0, NOW() - INTERVAL 6 DAY);

-- Insert 20 dummy volunteers (10 male, 10 female)
INSERT INTO volunteers (name, phone, license_no, vehicle_type, city, availability, gender, status, registered_on) VALUES
('Rajesh Patil',      '9823041567', 'MH12 2019 0045231', 'Car',           'Mumbai, Andheri',     '24/7',              'male',   'Verified',             NOW() - INTERVAL 30 DAY),
('Suresh Nair',       '9711023456', 'KL07 2020 0078432', 'Auto Rickshaw', 'Pune, Kothrud',       'Day (6AM-6PM)',      'male',   'Verified',             NOW() - INTERVAL 25 DAY),
('Amit Tiwari',       '8801234567', 'UP32 2018 0034512', 'SUV',           'Delhi, Dwarka',       'Night (6PM-6AM)',    'male',   'Verified',             NOW() - INTERVAL 20 DAY),
('Deepak Yadav',      '9934512678', 'BR01 2021 0056789', 'Car',           'Patna, Boring Road',  'Weekends Only',     'male',   'Pending Verification', NOW() - INTERVAL 10 DAY),
('Manoj Desai',       '9012345678', 'GJ01 2019 0091234', 'Van',           'Ahmedabad, Satellite','24/7',              'male',   'Verified',             NOW() - INTERVAL 18 DAY),
('Kiran Reddy',       '8123456789', 'TS09 2020 0067891', 'Bike',          'Hyderabad, Banjara',  'Day (6AM-6PM)',      'male',   'Pending Verification', NOW() - INTERVAL 5 DAY),
('Sanjay Kulkarni',   '7890123456', 'MH14 2017 0023456', 'Car',           'Nashik, College Road','Night (6PM-6AM)',    'male',   'Verified',             NOW() - INTERVAL 40 DAY),
('Ravi Shankar',      '9567891234', 'TN22 2021 0089012', 'Auto Rickshaw', 'Chennai, T Nagar',    '24/7',              'male',   'Pending Verification', NOW() - INTERVAL 3 DAY),
('Prakash Jain',      '9345678901', 'RJ14 2018 0045678', 'SUV',           'Jaipur, Vaishali',    'Weekends Only',     'male',   'Verified',             NOW() - INTERVAL 15 DAY),
('Nikhil Bose',       '8234567890', 'WB02 2020 0012345', 'Car',           'Kolkata, Salt Lake',  'Day (6AM-6PM)',      'male',   'Pending Verification', NOW() - INTERVAL 7 DAY),
('Priya Sharma',      '9876543210', 'MH01 2020 0012345', 'Car',           'Mumbai, Bandra',      '24/7',              'female', 'Verified',             NOW() - INTERVAL 28 DAY),
('Anjali Mehta',      '8765432109', 'DL04 2019 0098765', 'SUV',           'Delhi, Lajpat Nagar', 'Day (6AM-6PM)',      'female', 'Verified',             NOW() - INTERVAL 22 DAY),
('Sneha Iyer',        '7654321098', 'KA03 2021 0054321', 'Car',           'Bangalore, Koramangala','Night (6PM-6AM)', 'female', 'Pending Verification', NOW() - INTERVAL 8 DAY),
('Kavya Nair',        '9543210987', 'KL11 2018 0076543', 'Auto Rickshaw', 'Kochi, Ernakulam',    'Weekends Only',     'female', 'Verified',             NOW() - INTERVAL 35 DAY),
('Meera Joshi',       '8432109876', 'MH04 2020 0032109', 'Car',           'Pune, Aundh',         '24/7',              'female', 'Verified',             NOW() - INTERVAL 12 DAY),
('Divya Pillai',      '9321098765', 'TN07 2019 0065432', 'Van',           'Chennai, Anna Nagar', 'Day (6AM-6PM)',      'female', 'Pending Verification', NOW() - INTERVAL 4 DAY),
('Pooja Verma',       '8210987654', 'UP80 2021 0087654', 'Car',           'Lucknow, Gomti Nagar','Night (6PM-6AM)',    'female', 'Verified',             NOW() - INTERVAL 19 DAY),
('Ritu Singh',        '9109876543', 'RJ01 2020 0043210', 'SUV',           'Jaipur, Malviya Nagar','Weekends Only',    'female', 'Pending Verification', NOW() - INTERVAL 6 DAY),
('Lakshmi Reddy',     '8098765432', 'TS01 2018 0021098', 'Car',           'Hyderabad, Jubilee',  '24/7',              'female', 'Verified',             NOW() - INTERVAL 45 DAY),
('Nisha Gupta',       '9987654321', 'WB06 2021 0009876', 'Auto Rickshaw', 'Kolkata, Park Street','Day (6AM-6PM)',      'female', 'Pending Verification', NOW() - INTERVAL 2 DAY),
-- Neral & Karjat volunteers (5 male, 5 female)
('Ganesh Bhoir',      '9823100001', 'MH25 2018 0011101', 'Auto Rickshaw', 'Neral, Station Road',  '24/7',             'male',   'Verified',             NOW() - INTERVAL 14 DAY),
('Santosh Kale',      '9823100002', 'MH25 2019 0011102', 'Car',           'Neral, Market Area',   'Day (6AM-6PM)',     'male',   'Verified',             NOW() - INTERVAL 11 DAY),
('Vijay Mhatre',      '9823100003', 'MH25 2020 0011103', 'Bike',          'Neral, Ambivali Road', 'Night (6PM-6AM)',   'male',   'Pending Verification', NOW() - INTERVAL 4 DAY),
('Ramesh Patkar',     '9823100004', 'MH25 2017 0011104', 'Van',           'Karjat, Main Bazar',   '24/7',             'male',   'Verified',             NOW() - INTERVAL 20 DAY),
('Sunil Tare',        '9823100005', 'MH25 2021 0011105', 'SUV',           'Karjat, Ulhas Nagar',  'Weekends Only',    'male',   'Verified',             NOW() - INTERVAL 9 DAY),
('Sunita Bhoir',      '9823100006', 'MH25 2019 0011106', 'Car',           'Neral, Station Road',  '24/7',             'female', 'Verified',             NOW() - INTERVAL 16 DAY),
('Rekha Kale',        '9823100007', 'MH25 2020 0011107', 'Auto Rickshaw', 'Neral, Market Area',   'Day (6AM-6PM)',     'female', 'Verified',             NOW() - INTERVAL 13 DAY),
('Manisha Mhatre',    '9823100008', 'MH25 2018 0011108', 'Car',           'Neral, Ambivali Road', 'Night (6PM-6AM)',   'female', 'Pending Verification', NOW() - INTERVAL 5 DAY),
('Lata Patkar',       '9823100009', 'MH25 2021 0011109', 'Van',           'Karjat, Main Bazar',   'Weekends Only',    'female', 'Verified',             NOW() - INTERVAL 22 DAY),
('Sushma Tare',       '9823100010', 'MH25 2017 0011110', 'SUV',           'Karjat, Ulhas Nagar',  '24/7',             'female', 'Verified',             NOW() - INTERVAL 8 DAY);

-- Insert 10 dummy cyber complaints
INSERT INTO cyber_complaints (user_email, complaint_type, description, evidence_url, status) VALUES
('priya.sharma@example.com', 'Cyberbullying', 'Receiving threatening messages on social media', 'https://example.com/evidence1.jpg', 'Under Investigation'),
('rahul.kumar@example.com', 'Online Fraud', 'Fake payment link received via SMS', 'https://example.com/evidence2.jpg', 'Pending'),
('anjali.singh@example.com', 'Identity Theft', 'Someone created fake profile using my photos', 'https://example.com/evidence3.jpg', 'Resolved'),
('vikram.patel@example.com', 'Harassment', 'Continuous spam calls and messages', NULL, 'Pending'),
('sneha.reddy@example.com', 'Phishing', 'Received fake bank email asking for credentials', 'https://example.com/evidence4.jpg', 'Under Investigation'),
('arjun.mehta@example.com', 'Cyberstalking', 'Being followed and monitored online', 'https://example.com/evidence5.jpg', 'Pending'),
('kavya.iyer@example.com', 'Online Fraud', 'Lost money in fake investment scheme', 'https://example.com/evidence6.jpg', 'Under Investigation'),
('rohan.gupta@example.com', 'Hacking', 'Email account compromised', NULL, 'Resolved'),
('meera.joshi@example.com', 'Cyberbullying', 'Defamatory posts about me online', 'https://example.com/evidence7.jpg', 'Pending'),
('aditya.verma@example.com', 'Data Breach', 'Personal information leaked online', 'https://example.com/evidence8.jpg', 'Under Investigation');
