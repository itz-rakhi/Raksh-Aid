const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
});
//Test connection-----
pool.getConnection()
    .then(conn => {
        console.log('✅ MySQL Connected!');
        conn.release();
    })
    .catch(err => {
        console.error('❌ MySQL Error:', err.message);
    });

app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password, bloodGroup } = req.body;
        console.log('📝 Register attempt:', { name, email, bloodGroup });
        
        // Check if user already exists
        const [existing] = await pool.query('SELECT email FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            console.log('❌ Email already exists:', email);
            return res.json({ success: false, error: 'Email already exists' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        await pool.query(
            'INSERT INTO users (name, email, password, blood_group) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, bloodGroup]
        );
        
        console.log('✅ User registered:', email);
        res.json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        console.error('❌ Register error:', error.message);
        console.error('Error code:', error.code);
        if (error.code === 'ER_DUP_ENTRY') {
            res.json({ success: false, error: 'Email already exists' });
        } else {
            res.json({ success: false, error: 'Registration failed: ' + error.message });
        }
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt:', email);
        
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (users.length === 0) {
            console.log('❌ User not found:', email);
            return res.json({ success: false, error: 'Invalid credentials' });
        }
        
        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password);
        
        if (!validPassword) {
            console.log('❌ Invalid password for:', email);
            return res.json({ success: false, error: 'Invalid credentials' });
        }
        
        console.log('✅ Login successful:', email);
        res.json({
            success: true,
            user: { name: user.name, email: user.email, bloodGroup: user.blood_group }
        });
    } catch (error) {
        console.error('❌ Login error:', error.message);
        res.json({ success: false, error: 'Login failed: ' + error.message });
    }
});

app.get('/api/contacts/:email', async (req, res) => {
    try {
        const [contacts] = await pool.query(
            'SELECT contact_id as id, name, phone, email FROM emergency_contacts WHERE user_email = ?',
            [req.params.email]
        );
        res.json({ success: true, contacts });
    } catch (error) {
        res.json({ success: false, contacts: [] });
    }
});

app.post('/api/contacts', async (req, res) => {
    try {
        const { userEmail, contact } = req.body;
        await pool.query(
            'INSERT INTO emergency_contacts (user_email, contact_id, name, phone, email) VALUES (?, ?, ?, ?, ?)',
            [userEmail, contact.id, contact.name, contact.phone, contact.email || '']
        );
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

app.delete('/api/contacts/:email/:id', async (req, res) => {
    try {
        await pool.query(
            'DELETE FROM emergency_contacts WHERE user_email = ? AND contact_id = ?',
            [req.params.email, req.params.id]
        );
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false });
    }
});

app.post('/api/sos-alert', async (req, res) => {
    try {
        const { userEmail, location, riskLevel, riskFactors } = req.body;
        
        // Insert SOS alert
        await pool.query(
            'INSERT INTO sos_alerts (user_email, latitude, longitude, risk_level, risk_factors, active) VALUES (?, ?, ?, ?, ?, ?)',
            [userEmail, location.lat, location.lng, riskLevel, JSON.stringify(riskFactors), true]
        );
        
        // Update alert stats
        await pool.query(
            'INSERT INTO alert_stats (user_email, total_alerts, active_alerts, last_alert_time) VALUES (?, 1, 1, NOW()) ON DUPLICATE KEY UPDATE total_alerts = total_alerts + 1, active_alerts = active_alerts + 1, last_alert_time = NOW()',
            [userEmail]
        );
        
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

app.get('/api/alert-stats/:email', async (req, res) => {
    try {
        const [stats] = await pool.query(
            'SELECT total_alerts as total, active_alerts as active FROM alert_stats WHERE user_email = ?',
            [req.params.email]
        );
        res.json({ success: true, stats: stats[0] || { total: 0, active: 0 } });
    } catch (error) {
        res.json({ success: false, stats: { total: 0, active: 0 } });
    }
});

app.get('/api/sos-alerts/:email', async (req, res) => {
    try {
        const [alerts] = await pool.query(
            'SELECT * FROM sos_alerts WHERE user_email = ? ORDER BY created_at DESC',
            [req.params.email]
        );
        res.json({ success: true, alerts });
    } catch (error) {
        res.json({ success: false, alerts: [] });
    }
});

// Admin endpoints
app.get('/api/admin/users', async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, name, email, blood_group, created_at FROM users ORDER BY created_at DESC');
        res.json({ success: true, users });
    } catch (error) {
        res.json({ success: false, users: [] });
    }
});

app.get('/api/admin/all-alerts', async (req, res) => {
    try {
        const [alerts] = await pool.query(
            'SELECT s.*, u.name as user_name FROM sos_alerts s LEFT JOIN users u ON s.user_email = u.email ORDER BY s.created_at DESC'
        );
        res.json({ success: true, alerts });
    } catch (error) {
        res.json({ success: false, alerts: [] });
    }
});

app.get('/api/admin/alert-stats', async (req, res) => {
    try {
        const [stats] = await pool.query(
            'SELECT a.*, u.name as user_name FROM alert_stats a LEFT JOIN users u ON a.user_email = u.email ORDER BY a.total_alerts DESC'
        );
        res.json({ success: true, stats });
    } catch (error) {
        res.json({ success: false, stats: [] });
    }
});

app.get('/api/admin/cyber-complaints', async (req, res) => {
    try {
        const [complaints] = await pool.query(
            'SELECT c.*, u.name as user_name FROM cyber_complaints c LEFT JOIN users u ON c.user_email = u.email ORDER BY c.created_at DESC'
        );
        res.json({ success: true, complaints });
    } catch (error) {
        res.json({ success: false, complaints: [] });
    }
});

app.post('/api/cyber-complaint', async (req, res) => {
    try {
        const { userEmail, complaintType, description, evidenceUrl } = req.body;
        console.log('📝 Cyber complaint received:', { userEmail, complaintType });
        
        await pool.query(
            'INSERT INTO cyber_complaints (user_email, complaint_type, description, evidence_url, status) VALUES (?, ?, ?, ?, ?)',
            [userEmail, complaintType, description, evidenceUrl || '', 'Pending']
        );
        
        console.log('✅ Complaint saved to database');
        res.json({ success: true, message: 'Complaint registered' });
    } catch (error) {
        console.error('❌ Error saving complaint:', error.message);
        res.json({ success: false, error: error.message });
    }
});

app.post('/api/volunteers', async (req, res) => {
    try {
        const { name, phone, license, vehicle, city, availability, gender } = req.body;
        const [existing] = await pool.query('SELECT id FROM volunteers WHERE phone = ?', [phone]);
        if (existing.length > 0) return res.json({ success: false, error: 'Phone number already registered' });
        const [result] = await pool.query(
            'INSERT INTO volunteers (name, phone, license_no, vehicle_type, city, availability, gender) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, phone, license, vehicle, city, availability, gender]
        );
        res.json({ success: true, id: result.insertId });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

app.get('/api/volunteers', async (req, res) => {
    try {
        const { gender } = req.query;
        const query = gender
            ? 'SELECT * FROM volunteers WHERE gender = ? ORDER BY registered_on DESC'
            : 'SELECT * FROM volunteers ORDER BY registered_on DESC';
        const params = gender ? [gender] : [];
        const [volunteers] = await pool.query(query, params);
        res.json({ success: true, volunteers });
    } catch (error) {
        res.json({ success: false, volunteers: [] });
    }
});

app.patch('/api/volunteers/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        await pool.query('UPDATE volunteers SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

app.delete('/api/volunteers/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM volunteers WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
