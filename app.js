let contacts = [];
let currentUser = null;

// Load user-specific contacts from MySQL
async function loadUserContacts() {
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.email) {
        try {
            contacts = await apiService.getContacts(currentUser.email);
            console.log('Contacts loaded:', contacts);
        } catch (error) {
            console.error('Error loading contacts:', error);
            contacts = [];
        }
    }
}

let map, marker, userLocation, circle;

document.addEventListener('DOMContentLoaded', async () => {
    await loadUserContacts();
    loadContacts();
    loadAlertStats();
    setupEventListeners();
    getUserLocation();
    initMap();
    setupCameraListeners();
});

function setupEventListeners() {
    document.getElementById('sosBtn').addEventListener('click', triggerSOS);
    document.getElementById('addContactBtn').addEventListener('click', addContact);
    document.getElementById('shareLocationBtn').addEventListener('click', shareLocation);
    document.getElementById('viewFullMapBtn').addEventListener('click', () => {
        window.location.href = 'map.html';
    });
}

function setupCameraListeners() {
    const captureBtn = document.getElementById('capturePhotoBtn');
    const closeBtn = document.getElementById('closeCameraBtn');
    
    if (captureBtn) {
        captureBtn.addEventListener('click', capturePhoto);
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeCameraTracking);
    }
}

function triggerSOS() {
    const sosBtn = document.getElementById('sosBtn');
    sosBtn.style.animation = 'pulse 0.5s ease-in-out 3';

    getUserLocation().then(location => {
        userLocation = location;
        const riskLevel = analyzeRisk(location);
        sendSOSToContacts(location, riskLevel);
        updateAlertStats();
        alert('🚨 SOS Alert Sent!\n\nEmergency message with your location has been sent to all contacts.');
    }).catch(error => {
        alert('⚠️ Unable to get location. Please enable location services.');
        console.error(error);
    });
}

function analyzeRisk(location) {
    const hour = new Date().getHours();
    const alertHistory = JSON.parse(localStorage.getItem('alertHistory')) || [];
    
    let riskScore = 0;
    let riskFactors = [];
    
    // Time-based risk (10pm - 5am = high risk)
    if (hour >= 22 || hour <= 5) {
        riskScore += 3;
        riskFactors.push('Late night alert');
    }
    
    // Check for multiple alerts in short time
    const recentAlerts = alertHistory.filter(alert => {
        const alertTime = new Date(alert.time);
        const timeDiff = (new Date() - alertTime) / 1000 / 60; // minutes
        return timeDiff <= 30;
    });
    
    if (recentAlerts.length >= 2) {
        riskScore += 5;
        riskFactors.push('Multiple alerts in 30 minutes');
    }
    
    // Check unsafe zones
    const unsafeZones = JSON.parse(localStorage.getItem('unsafeZones')) || [];
    const isInUnsafeZone = unsafeZones.some(zone => {
        const distance = getDistanceFromLatLon(location.lat, location.lng, zone.lat, zone.lng);
        return distance < 0.5; // within 500m
    });
    
    if (isInUnsafeZone) {
        riskScore += 4;
        riskFactors.push('Unsafe area detected');
    }
    
    // Store alert in history
    alertHistory.push({ time: new Date().toISOString(), location });
    localStorage.setItem('alertHistory', JSON.stringify(alertHistory));
    
    // Save to MySQL database
    if (currentUser && currentUser.email) {
        console.log('Saving SOS alert to database...');
        apiService.saveSOSAlert(
            currentUser.email,
            location,
            riskScore >= 7 ? 'CRITICAL' : riskScore >= 4 ? 'HIGH' : 'MEDIUM',
            riskFactors
        ).then(() => {
            console.log('SOS alert saved to database successfully');
        }).catch(err => {
            console.error('Error saving SOS alert:', err);
        });
    } else {
        console.warn('No user logged in, SOS alert not saved to database');
    }
    
    // Also store in format expected by admin dashboard
    const sosAlerts = JSON.parse(localStorage.getItem('sosAlerts')) || [];
    const alertData = {
        id: Date.now(),
        userId: currentUser ? currentUser.email : 'unknown',
        userName: currentUser ? currentUser.name : 'Unknown User',
        location: location,
        riskLevel: riskScore >= 7 ? 'CRITICAL' : riskScore >= 4 ? 'HIGH' : 'MEDIUM',
        riskFactors: riskFactors,
        time: new Date().toISOString(),
        active: true
    };
    sosAlerts.push(alertData);
    localStorage.setItem('sosAlerts', JSON.stringify(sosAlerts));
    console.log('SOS Alert saved:', alertData);
    console.log('Total alerts in storage:', sosAlerts.length);
    
    return {
        score: riskScore,
        level: riskScore >= 7 ? 'CRITICAL' : riskScore >= 4 ? 'HIGH' : 'MEDIUM',
        factors: riskFactors
    };
}

function getDistanceFromLatLon(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

async function sendSOSToContacts(location, riskLevel) {
    if (contacts.length === 0) {
        alert('⚠️ No emergency contacts added. Please add contacts first.');
        return;
    }
    
    const riskEmoji = riskLevel.level === 'CRITICAL' ? '🔴' : riskLevel.level === 'HIGH' ? '🟠' : '🟡';
    const locationUrl = `https://www.openstreetmap.org/?mlat=${location.lat}&mlon=${location.lng}#map=15/${location.lat}/${location.lng}`;
    const sosMessage = `${riskEmoji} EMERGENCY ALERT - ${riskLevel.level} RISK!\nI need immediate help!\n\n📍 Location: ${locationUrl}\n\n⚠️ Risk: ${riskLevel.factors.join(', ') || 'Emergency situation'}\nTime: ${new Date().toLocaleString()}`;
    
    // Save alert to Firebase if available
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (typeof firebase !== 'undefined' && currentUser && currentUser.uid) {
        try {
            await firebase.firestore().collection('alerts').add({
                userId: currentUser.uid,
                userName: currentUser.name,
                location: location,
                riskLevel: riskLevel.level,
                riskFactors: riskLevel.factors,
                time: new Date().toISOString(),
                active: true
            });
        } catch (error) {
            console.error('Error saving alert to Firebase:', error);
        }
    }
    
    // Save to chat (user-specific)
    const userMessagesKey = currentUser && currentUser.email ? `chatMessages_${currentUser.email}` : 'chatMessages';
    let chatMessages = JSON.parse(localStorage.getItem(userMessagesKey)) || {};
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const fromName = currentUser ? currentUser.name : 'Someone';
    
    contacts.forEach((contact, index) => {
        if (!chatMessages[contact.id]) chatMessages[contact.id] = [];
        chatMessages[contact.id].push({ text: sosMessage, type: 'sent', time: currentTime });
        
        // Send via SMS with delay for each contact
        setTimeout(() => {
            const smsUrl = `sms:${contact.phone}?body=${encodeURIComponent(sosMessage)}`;
            window.location.href = smsUrl;
        }, index * 1000);
        
        // Send automated Email if email exists
        if (contact.email && typeof sendEmergencyEmail === 'function') {
            setTimeout(() => {
                const senderEmail = currentUser && currentUser.email ? currentUser.email : '';
                sendEmergencyEmail(
                    contact.email,
                    contact.name,
                    fromName,
                    senderEmail,
                    { url: locationUrl, lat: location.lat, lng: location.lng }
                ).then(success => {
                    if (success) {
                        console.log(`Email sent to ${contact.name} (${contact.email})`);
                    } else {
                        console.error(`Failed to send email to ${contact.email}`);
                    }
                });
            }, 100);
        }
    });
    
    localStorage.setItem(userMessagesKey, JSON.stringify(chatMessages));
    
    // Broadcast alert to admin dashboard
    try {
        const broadcast = new BroadcastChannel('admin-updates');
        const alertBroadcast = {
            type: 'sosAlert',
            alert: {
                userId: currentUser ? currentUser.email : 'unknown',
                userName: currentUser ? currentUser.name : 'Unknown User',
                riskLevel: riskLevel.level,
                location: location,
                time: new Date().toISOString()
            },
            timestamp: new Date().toISOString()
        };
        broadcast.postMessage(alertBroadcast);
        console.log('Alert broadcast sent:', alertBroadcast);
    } catch (e) {
        console.log('BroadcastChannel not supported');
    }
}

function addContact() {
    const nameInput = document.getElementById('contactName');
    const phoneInput = document.getElementById('contactPhone');
    const emailInput = document.getElementById('contactEmail');
    
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const email = emailInput.value.trim();
    
    if (!name || !phone) {
        alert('Please enter both name and phone number');
        return;
    }
    
    if (!currentUser || !currentUser.email) {
        alert('⚠️ Please login to add contacts');
        return;
    }
    
    const contact = {
        id: Date.now(),
        name: name,
        phone: phone,
        email: email || ''
    };
    
    contacts.push(contact);
    apiService.addContact(currentUser.email, contact)
        .then(() => {
            console.log('Contact added successfully');
            loadContacts();
        })
        .catch(error => {
            console.error('Error adding contact:', error);
            alert('⚠️ Failed to add contact. Please check if backend server is running.');
            contacts.pop();
        });
    
    nameInput.value = '';
    phoneInput.value = '';
    emailInput.value = '';
}

function deleteContact(id) {
    if (!currentUser || !currentUser.email) {
        alert('⚠️ Please login to delete contacts');
        return;
    }
    
    if (!confirm('Delete this contact?')) {
        return;
    }
    
    contacts = contacts.filter(contact => contact.id !== id);
    apiService.deleteContact(currentUser.email, id)
        .catch(error => {
            console.error('Error deleting contact:', error);
        });
    loadContacts();
}

function callContact(phone) {
    window.location.href = `tel:${phone}`;
}

function loadContacts() {
    const contactsList = document.getElementById('contactsList');
    const contactCount = document.getElementById('contactCount');
    
    if (contactCount) {
        contactCount.textContent = `${contacts.length} contact${contacts.length !== 1 ? 's' : ''}`;
    }
    
    if (contacts.length === 0) {
        contactsList.innerHTML = '<p style="color: #999; text-align: center;">No emergency contacts added yet</p>';
        return;
    }
    
    contactsList.innerHTML = contacts.map(contact => `
        <div class="contact-item">
            <div class="contact-info">
                <div class="contact-name">${contact.name}</div>
                <div class="contact-phone">${contact.phone}</div>
                ${contact.email ? `<div class="contact-email" style="font-size: 0.85rem; color: #666;"><i class="fas fa-envelope"></i> ${contact.email}</div>` : ''}
            </div>
            <div class="contact-actions">
                <button class="call-btn" onclick="callContact('${contact.phone}')"><i class="fas fa-phone"></i> Call</button>
                <button class="delete-btn" onclick="deleteContact(${contact.id})"><i class="fas fa-trash"></i> Delete</button>
            </div>
        </div>
    `).join('');
}

function callNumber(number) {
    if (confirm(`Call ${number}?`)) {
        window.location.href = `tel:${number}`;
    }
}

function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation not supported'));
            return;
        }
        
        navigator.geolocation.getCurrentPosition(
            position => {
                const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                resolve(location);
            },
            error => reject(error),
            { enableHighAccuracy: true }
        );
    });
}

function initMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.error('Map element not found');
        return;
    }
    
    getUserLocation().then(location => {
        userLocation = location;
        console.log('User location:', location);
        
        map = L.map('map').setView([location.lat, location.lng], 15);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(map);
        
        marker = L.marker([location.lat, location.lng]).addTo(map);
        marker.bindPopup('<strong>You are here</strong>').openPopup();
        
        circle = L.circle([location.lat, location.lng], {
            color: '#4285F4',
            fillColor: '#4285F4',
            fillOpacity: 0.15,
            radius: 100
        }).addTo(map);
        
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}`)
            .then(response => response.json())
            .then(data => {
                const address = data.display_name.split(',').slice(0, 2).join(',');
                const locationInfo = document.getElementById('locationInfo');
                if (locationInfo) {
                    locationInfo.innerHTML = `<i class="fas fa-map-marker-alt"></i><span>${address}</span>`;
                }
            })
            .catch(err => console.error('Geocoding error:', err));
        
        navigator.geolocation.watchPosition(position => {
            const newLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            if (marker) marker.setLatLng([newLocation.lat, newLocation.lng]);
            if (circle) circle.setLatLng([newLocation.lat, newLocation.lng]);
            userLocation = newLocation;
        }, null, { enableHighAccuracy: true, maximumAge: 0 });
        
    }).catch(error => {
        console.error('Map error:', error);
        const mapElement = document.getElementById('map');
        if (mapElement) {
            mapElement.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #999; flex-direction: column; gap: 10px; padding: 20px; text-align: center;"><i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #dc3545;"></i><p><strong>Location Access Required</strong></p><p style="font-size: 0.85rem;">Please enable location services in your browser settings</p></div>';
        }
    });
}

function shareLocation() {
    if (!userLocation) {
        alert('Getting your location...');
        getUserLocation().then(location => {
            userLocation = location;
            shareLocationLink(location);
        });
        return;
    }
    
    shareLocationLink(userLocation);
}

function shareLocationLink(location) {
    const locationUrl = `https://www.openstreetmap.org/?mlat=${location.lat}&mlon=${location.lng}#map=15/${location.lat}/${location.lng}`;
    const message = `🚨 Emergency! I need help. My location: ${locationUrl}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Emergency Location',
            text: message,
            url: locationUrl
        }).catch(err => {
            copyToClipboard(locationUrl);
        });
    } else {
        copyToClipboard(locationUrl);
    }
}

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            alert('✅ Location link copied to clipboard!');
        }).catch(() => {
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
}

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        alert('✅ Location link copied!');
    } catch (err) {
        alert('❌ Unable to copy. Please share manually.');
    }
    document.body.removeChild(textarea);
}



function updateAlertStats() {
    let alertData = JSON.parse(localStorage.getItem('alertData')) || { total: 0, active: 0, lastTime: null };
    alertData.total += 1;
    alertData.active += 1;
    alertData.lastTime = new Date().toISOString();
    localStorage.setItem('alertData', JSON.stringify(alertData));
    
    document.getElementById('totalAlerts').textContent = alertData.total;
    document.getElementById('activeAlerts').textContent = alertData.active;
    
    // Update stats from database
    if (currentUser && currentUser.email) {
        apiService.getAlertStats(currentUser.email)
            .then(stats => {
                document.getElementById('totalAlerts').textContent = stats.total || 0;
                document.getElementById('activeAlerts').textContent = stats.active || 0;
            })
            .catch(err => console.error('Error loading alert stats:', err));
    }
}

function loadAlertStats() {
    console.log('Loading alert stats for user:', currentUser);
    if (currentUser && currentUser.email) {
        console.log('Fetching stats from API for:', currentUser.email);
        apiService.getAlertStats(currentUser.email)
            .then(stats => {
                console.log('Alert stats received:', stats);
                document.getElementById('totalAlerts').textContent = stats.total || 0;
                document.getElementById('activeAlerts').textContent = stats.active || 0;
            })
            .catch(err => {
                console.error('Error loading alert stats:', err);
                let alertData = JSON.parse(localStorage.getItem('alertData')) || { total: 0, active: 0 };
                document.getElementById('totalAlerts').textContent = alertData.total;
                document.getElementById('activeAlerts').textContent = alertData.active;
            });
    } else {
        console.log('No user logged in, using localStorage');
        let alertData = JSON.parse(localStorage.getItem('alertData')) || { total: 0, active: 0 };
        document.getElementById('totalAlerts').textContent = alertData.total;
        document.getElementById('activeAlerts').textContent = alertData.active;
    }
}



function updateTime() {
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        const now = new Date();
        timeElement.textContent = now.toLocaleTimeString();
    }
}

setInterval(updateTime, 1000);
updateTime();

const scrollTopBtn = document.getElementById('scrollTopBtn');
if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Voice Command SOS
const voiceBtn = document.getElementById('voiceBtn');
let recognition;

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
        voiceBtn.classList.add('listening');
    };
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        console.log('Voice command:', transcript);
        
        if ((transcript.includes('help') && transcript.includes('raksha')) || 
            transcript.includes('help me raksha') || 
            transcript.includes('raksha help')) {
            alert('🎤 Voice command detected: "' + transcript + '"\nTriggering SOS...');
            triggerSOS();
        } else {
            alert('🎤 Voice command not recognized.\nPlease say: "Help me Raksha"');
        }
    };
    
    recognition.onend = () => {
        voiceBtn.classList.remove('listening');
    };
    
    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        voiceBtn.classList.remove('listening');
    };
    
    voiceBtn.addEventListener('click', () => {
        recognition.start();
    });
} else {
    voiceBtn.style.display = 'none';
}

// Multi-language support
const translations = {
    en: { 'sos': 'SOS', 'emergency-alert': 'Emergency Alert' },
    hi: { 'sos': 'एसओएस', 'emergency-alert': 'आपातकालीन चेतावनी' },
    mr: { 'sos': 'एसओएस', 'emergency-alert': 'आपत्कालीन सूचना' }
};

function changeLanguage() {
    const lang = document.getElementById('languageSelect').value;
    document.querySelectorAll('[data-lang]').forEach(el => {
        const key = el.getAttribute('data-lang');
        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
    localStorage.setItem('selectedLanguage', lang);
}

const savedLang = localStorage.getItem('selectedLanguage');
if (savedLang) {
    document.getElementById('languageSelect').value = savedLang;
    changeLanguage();
}

// Camera Tracking Functionality
let cameraStream = null;
let capturedPhotos = [];

function openCameraTracking() {
    console.log('Opening camera...');
    const modal = document.getElementById('cameraModal');
    const video = document.getElementById('cameraVideo');
    
    if (!modal || !video) {
        alert('❌ Camera elements not found. Please refresh the page.');
        return;
    }
    
    modal.classList.add('active');
    modal.style.display = 'flex';
    
    console.log('Requesting camera access...');
    
    navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' },
        audio: false 
    })
    .then(stream => {
        console.log('✅ Camera access granted!');
        cameraStream = stream;
        video.srcObject = stream;
        loadCapturedPhotos();
    })
    .catch(error => {
        console.error('❌ Camera access error:', error);
        let errorMsg = '⚠️ Unable to access camera.\n\n';
        
        if (error.name === 'NotAllowedError') {
            errorMsg += 'Permission denied. Please:\n1. Click the camera icon in address bar\n2. Allow camera access\n3. Refresh and try again';
        } else if (error.name === 'NotFoundError') {
            errorMsg += 'No camera found on this device.';
        } else if (error.name === 'NotReadableError') {
            errorMsg += 'Camera is being used by another app.';
        } else {
            errorMsg += 'Error: ' + error.message;
        }
        
        alert(errorMsg);
        modal.classList.remove('active');
        modal.style.display = 'none';
    });
}

function capturePhoto() {
    const video = document.getElementById('cameraVideo');
    const canvas = document.getElementById('cameraCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    
    const photoData = canvas.toDataURL('image/jpeg');
    const timestamp = new Date().toLocaleString();
    
    capturedPhotos.push({ data: photoData, time: timestamp });
    saveCapturedPhotos();
    displayCapturedPhotos();
    
    alert('✅ Photo captured and saved!');
}

function displayCapturedPhotos() {
    const container = document.getElementById('capturedPhotos');
    container.innerHTML = capturedPhotos.map((photo, index) => `
        <div style="position: relative;">
            <img src="${photo.data}" style="width: 100%; border-radius: 8px; border: 2px solid #28a745;">
            <div style="position: absolute; bottom: 5px; left: 5px; background: rgba(0,0,0,0.7); color: white; padding: 3px 6px; border-radius: 4px; font-size: 0.7rem;">
                ${photo.time}
            </div>
        </div>
    `).join('');
}

function saveCapturedPhotos() {
    if (currentUser && currentUser.email) {
        const userPhotosKey = `cameraPhotos_${currentUser.email}`;
        localStorage.setItem(userPhotosKey, JSON.stringify(capturedPhotos));
    }
}

function loadCapturedPhotos() {
    if (currentUser && currentUser.email) {
        const userPhotosKey = `cameraPhotos_${currentUser.email}`;
        capturedPhotos = JSON.parse(localStorage.getItem(userPhotosKey)) || [];
        displayCapturedPhotos();
    }
}

function closeCameraTracking() {
    console.log('Closing camera...');
    const modal = document.getElementById('cameraModal');
    const video = document.getElementById('cameraVideo');
    
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => {
            track.stop();
            console.log('Camera track stopped');
        });
        cameraStream = null;
    }
    
    if (video) {
        video.srcObject = null;
    }
    
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
    }
}
