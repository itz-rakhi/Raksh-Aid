# RAKSH-AID - Emergency Safety Web App

A modern, responsive emergency safety web application with SOS alerts, contact management, and location tracking.

## ⚠️ IMPORTANT: Setup Required

**The app requires a Google Maps API key to work. Follow the setup instructions below.**

## Features

- **SOS Button**: Large, prominent emergency button that sends alerts to saved contacts
- **Contact Management**: Add, view, and delete emergency contacts
- **Emergency Services**: Quick access to Police (100), Ambulance (102), Fire (101), and Women Helpline (1091)
- **Google Maps Integration**: Real-time location tracking and sharing
- **Nearby Services**: Find hospitals, police stations, fire stations, and pharmacies
- **Responsive Design**: Works on desktop and mobile devices
- **Local Storage**: Contacts are saved locally in the browser

## Setup Instructions

### 1. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable these APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
   - Geolocation API
4. Create credentials (API Key)
5. Copy your API key

### 2. Configure the App

**In `index.html`** - Find this line at the bottom:
```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap" async defer></script>
```
Replace `YOUR_API_KEY` with your actual API key.

**In `map.html`** - Find this line at the bottom:
```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places,geometry&callback=initMap" async defer></script>
```
Replace `YOUR_API_KEY` with your actual API key.

### 3. Run the App

**Option 1: Direct Open**
- Simply open `index.html` in a web browser

**Option 2: Local Server (Recommended)**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (if you have http-server installed)
npx http-server
```
Then visit `http://localhost:8000`

### 4. Allow Permissions

- Allow location access when prompted
- The map will load with your current location

## Usage

1. **Add Emergency Contacts**: Enter name and phone number, click "Add Contact"
2. **Trigger SOS**: Press the red SOS button to send emergency alerts
3. **Call Emergency Services**: Click on any emergency service card to call
4. **Share Location**: Use the "Share My Location" button to send your location
5. **View Full Map**: Click "View Full Map" to see nearby emergency services
6. **Filter Services**: On map page, click filters to find hospitals, police, fire stations, or pharmacies

## Technologies Used

- HTML5
- CSS3 (Flexbox, Grid, Animations)
- Vanilla JavaScript
- Google Maps JavaScript API
- Places API
- LocalStorage API
- Geolocation API
- Font Awesome Icons

## Troubleshooting

**Map shows gray area or error:**
- Verify API key is correctly added in both HTML files
- Check if all required APIs are enabled in Google Cloud Console
- Ensure billing is enabled (Google requires it even for free tier)

**Location not working:**
- Allow location permissions in browser
- Use HTTPS or localhost (required for geolocation)

**Nearby services not showing:**
- Ensure Places API is enabled
- Check browser console for errors

## Notes

- Contacts are stored locally in your browser
- Location tracking requires HTTPS in production
- Emergency numbers are for India (customize for your region)
- Google Maps free tier: $200 credit/month (~28,000 map loads)

## Files

- `index.html` - Main page with SOS button and contacts
- `map.html` - Full map page with nearby services
- `styles.css` - Styling and animations
- `app.js` - Main application logic
- `setup-guide.md` - Detailed setup instructions
- `README.md` - This file
