# 🚀 RAKSH-AID - Tech Stack

## Frontend Technologies

### Core Technologies
- **HTML5** - Structure and markup
- **CSS3** - Styling, animations, gradients, flexbox, grid
- **JavaScript (ES6+)** - Client-side logic and interactivity
- **Vanilla JS** - No frontend frameworks (pure JavaScript)

### UI/UX Libraries
- **Font Awesome 6.4.0** - Icons and visual elements
- **Leaflet.js 1.9.4** - Interactive maps and location tracking
- **OpenStreetMap** - Map tiles and geocoding

### APIs & Services
- **Geolocation API** - Real-time location tracking
- **Web Speech API** - Voice command SOS trigger
- **MediaDevices API** - Camera access for safety tracking
- **LocalStorage API** - Client-side data persistence
- **Fetch API** - HTTP requests to backend
- **BroadcastChannel API** - Real-time admin updates

### Email Integration
- **EmailJS** - Automated emergency email alerts

## Backend Technologies

### Server
- **Node.js** - JavaScript runtime environment
- **Express.js 4.18.2** - Web application framework
- **CORS** - Cross-origin resource sharing

### Database
- **MySQL 8.0+** - Relational database management system
- **mysql2 3.6.5** - MySQL client for Node.js (with promises)

### Security
- **bcryptjs 2.4.3** - Password hashing and encryption
- **dotenv 16.3.1** - Environment variable management

## Database Schema

### Tables (5)
1. **users** - User accounts and profiles
2. **emergency_contacts** - User emergency contacts
3. **sos_alerts** - SOS alert history with location
4. **alert_stats** - Aggregated alert statistics
5. **cyber_complaints** - Cyber crime reports

## Development Tools

### IDE & Extensions
- **Visual Studio Code** - Code editor
- **MySQL Extension** - Database management in VSCode

### Version Control
- **Git** - Version control system

### Package Management
- **npm** - Node package manager

## Architecture

### Design Pattern
- **Client-Server Architecture**
- **RESTful API** - Backend API endpoints
- **MVC Pattern** - Model-View-Controller separation

### Data Flow
```
Frontend (HTML/CSS/JS)
    ↓
API Service (api-service.js)
    ↓
Backend Server (Express.js)
    ↓
MySQL Database
```

## Key Features & Technologies

### 1. Authentication System
- Bcrypt password hashing
- LocalStorage session management
- Admin and user role separation

### 2. Real-time Location Tracking
- Geolocation API
- Leaflet.js maps
- OpenStreetMap integration
- Reverse geocoding

### 3. SOS Alert System
- Risk analysis algorithm
- SMS integration
- Email alerts (EmailJS)
- Real-time notifications

### 4. Admin Dashboard
- Real-time data visualization
- User management
- Alert monitoring
- Complaint tracking

### 5. Communication Features
- Chat system
- Voice commands
- Email notifications
- SMS alerts

### 6. Safety Features
- Camera tracking
- Photo gallery
- Mental health support
- Blood bank locator
- Cyber help center

## API Endpoints

### User APIs
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/contacts/:email` - Get contacts
- `POST /api/contacts` - Add contact
- `DELETE /api/contacts/:email/:id` - Delete contact

### Alert APIs
- `POST /api/sos-alert` - Create SOS alert
- `GET /api/alert-stats/:email` - Get user stats
- `GET /api/sos-alerts/:email` - Get user alerts

### Admin APIs
- `GET /api/admin/users` - All users
- `GET /api/admin/all-alerts` - All alerts
- `GET /api/admin/alert-stats` - All stats
- `GET /api/admin/cyber-complaints` - All complaints

## Environment Variables

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=Rakhi@2005
DB_NAME=rakshaaid_database
PORT=3000
```

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## System Requirements

### Development
- Node.js 14+
- MySQL 8.0+
- Windows 10/11 or Linux/macOS

### Production
- Web server (Apache/Nginx)
- MySQL database
- Node.js runtime
- SSL certificate (for HTTPS)

## Security Features

1. **Password Encryption** - Bcrypt hashing
2. **SQL Injection Prevention** - Parameterized queries
3. **XSS Protection** - Input sanitization
4. **CORS Configuration** - Controlled access
5. **Environment Variables** - Sensitive data protection

## Performance Optimizations

1. **Database Indexing** - Fast queries
2. **Connection Pooling** - Efficient DB connections
3. **Async/Await** - Non-blocking operations
4. **LocalStorage Caching** - Reduced API calls
5. **Lazy Loading** - On-demand resource loading

---

**Total Technologies Used: 20+**

**Development Time: Optimized for rapid deployment**

**License: MIT**
