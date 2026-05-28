// Sample Data Generator for RAKSH-AID Testing
// Run this in browser console to populate test data

console.log('🧪 RAKSH-AID Test Data Generator');
console.log('================================\n');

// Sample Users
const sampleUsers = [
  { email: 'test1@example.com', name: 'Priya Sharma', password: 'Test@123' },
  { email: 'test2@example.com', name: 'Amit Kumar', password: 'Test@123' },
  { email: 'test3@example.com', name: 'Sneha Patel', password: 'Test@123' }
];

// Sample Emergency Contacts
const sampleContacts = [
  { name: 'Rahul Sharma', phone: '+919876543210', email: 'rahul@example.com' },
  { name: 'Anjali Verma', phone: '+919876543211', email: 'anjali@example.com' },
  { name: 'Vikram Singh', phone: '+919876543212', email: 'vikram@example.com' },
  { name: 'Pooja Reddy', phone: '+919876543213', email: 'pooja@example.com' },
  { name: 'Arjun Mehta', phone: '+919876543214', email: 'arjun@example.com' }
];

// Sample SOS Alerts
const sampleAlerts = [
  {
    id: 1640000000001,
    userId: 'test1@example.com',
    userName: 'Priya Sharma',
    location: { lat: 19.0760, lng: 72.8777 },
    riskLevel: 'CRITICAL',
    riskFactors: ['Late night alert', 'Multiple alerts in 30 minutes'],
    time: new Date('2024-01-15T23:30:00').toISOString(),
    active: true
  },
  {
    id: 1640000000002,
    userId: 'test2@example.com',
    userName: 'Amit Kumar',
    location: { lat: 28.7041, lng: 77.1025 },
    riskLevel: 'HIGH',
    riskFactors: ['Unsafe area detected'],
    time: new Date('2024-01-15T22:15:00').toISOString(),
    active: true
  },
  {
    id: 1640000000003,
    userId: 'test3@example.com',
    userName: 'Sneha Patel',
    location: { lat: 12.9716, lng: 77.5946 },
    riskLevel: 'MEDIUM',
    riskFactors: [],
    time: new Date('2024-01-15T18:45:00').toISOString(),
    active: false
  },
  {
    id: 1640000000004,
    userId: 'test1@example.com',
    userName: 'Priya Sharma',
    location: { lat: 19.0760, lng: 72.8777 },
    riskLevel: 'HIGH',
    riskFactors: ['Late night alert'],
    time: new Date('2024-01-14T23:00:00').toISOString(),
    active: false
  }
];

// Sample Cyber Complaints
const sampleComplaints = [
  {
    id: 1640000000001,
    type: 'Cyberbullying',
    description: 'Receiving threatening messages on social media platform. Multiple accounts are sending abusive content.',
    links: 'https://example.com/evidence1',
    photo: '',
    date: '2024-01-15',
    status: 'Pending'
  },
  {
    id: 1640000000002,
    type: 'Online Fraud',
    description: 'Fake website claiming to sell products. Received payment but no product delivered.',
    links: 'https://fake-site.com',
    photo: '',
    date: '2024-01-14',
    status: 'Pending'
  },
  {
    id: 1640000000003,
    type: 'Identity Theft',
    description: 'Someone created fake profile using my photos and personal information.',
    links: 'https://social-media.com/fake-profile',
    photo: '',
    date: '2024-01-13',
    status: 'Resolved'
  }
];

// Sample Chat Messages
const sampleChatMessages = {
  1640000000001: [
    { text: 'Hi, I need help!', type: 'sent', time: '10:30 AM' },
    { text: 'Hello! I\'m here to help. What\'s your emergency?', type: 'received', time: '10:30 AM' },
    { text: 'I feel unsafe in this area', type: 'sent', time: '10:31 AM' },
    { text: 'Stay calm. I\'ve notified your emergency contacts. Can you move to a safer location?', type: 'received', time: '10:31 AM' }
  ],
  1640000000002: [
    { text: 'Emergency! Need immediate help', type: 'sent', time: '11:00 AM' },
    { text: 'I\'m here. What happened?', type: 'received', time: '11:00 AM' }
  ]
};

// Function to generate test data
function generateTestData() {
  console.log('📝 Generating test data...\n');
  
  // 1. Add sample contacts for each user
  sampleUsers.forEach(user => {
    const userContactsKey = `contacts_${user.email}`;
    const contacts = sampleContacts.slice(0, 3).map((contact, index) => ({
      ...contact,
      id: Date.now() + index
    }));
    localStorage.setItem(userContactsKey, JSON.stringify(contacts));
    console.log(`✅ Added ${contacts.length} contacts for ${user.name}`);
  });
  
  // 2. Add SOS alerts
  localStorage.setItem('sosAlerts', JSON.stringify(sampleAlerts));
  console.log(`✅ Added ${sampleAlerts.length} SOS alerts`);
  
  // 3. Add cyber complaints for users
  sampleUsers.forEach((user, index) => {
    const userComplaintsKey = `cyberComplaints_${user.email}`;
    const complaints = [sampleComplaints[index]];
    localStorage.setItem(userComplaintsKey, JSON.stringify(complaints));
    console.log(`✅ Added complaint for ${user.name}`);
  });
  
  // 4. Add chat messages for first user
  const userMessagesKey = `chatMessages_${sampleUsers[0].email}`;
  localStorage.setItem(userMessagesKey, JSON.stringify(sampleChatMessages));
  console.log(`✅ Added chat messages for ${sampleUsers[0].name}`);
  
  // 5. Add alert statistics
  const alertData = {
    total: sampleAlerts.length,
    active: sampleAlerts.filter(a => a.active).length,
    lastTime: sampleAlerts[0].time
  };
  localStorage.setItem('alertData', JSON.stringify(alertData));
  console.log(`✅ Added alert statistics`);
  
  // 6. Set current user (for testing)
  localStorage.setItem('currentUser', JSON.stringify({
    email: sampleUsers[0].email,
    name: sampleUsers[0].name,
    uid: 'test-uid-001'
  }));
  console.log(`✅ Set current user: ${sampleUsers[0].name}`);
  
  console.log('\n✨ Test data generation complete!');
  console.log('\n📊 Summary:');
  console.log(`   Users: ${sampleUsers.length}`);
  console.log(`   Contacts per user: 3`);
  console.log(`   Total SOS Alerts: ${sampleAlerts.length}`);
  console.log(`   Active Alerts: ${alertData.active}`);
  console.log(`   Cyber Complaints: ${sampleUsers.length}`);
  console.log('\n🔄 Refresh the page to see the data!');
}

// Function to clear all test data
function clearTestData() {
  console.log('🗑️ Clearing all test data...\n');
  
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('contacts_') || 
        key.startsWith('cyberComplaints_') || 
        key.startsWith('chatMessages_') ||
        key.startsWith('cameraPhotos_') ||
        key === 'sosAlerts' || 
        key === 'alertData' ||
        key === 'currentUser') {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
  
  console.log(`✅ Removed ${keysToRemove.length} items`);
  console.log('✨ Test data cleared!');
  console.log('🔄 Refresh the page to see changes!');
}

// Function to generate random SOS alert
function generateRandomAlert() {
  const users = ['test1@example.com', 'test2@example.com', 'test3@example.com'];
  const names = ['Priya Sharma', 'Amit Kumar', 'Sneha Patel'];
  const locations = [
    { lat: 19.0760, lng: 72.8777, city: 'Mumbai' },
    { lat: 28.7041, lng: 77.1025, city: 'Delhi' },
    { lat: 12.9716, lng: 77.5946, city: 'Bangalore' }
  ];
  const riskLevels = ['CRITICAL', 'HIGH', 'MEDIUM'];
  
  const randomIndex = Math.floor(Math.random() * users.length);
  const location = locations[randomIndex];
  
  const alert = {
    id: Date.now(),
    userId: users[randomIndex],
    userName: names[randomIndex],
    location: { lat: location.lat, lng: location.lng },
    riskLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)],
    riskFactors: ['Test alert'],
    time: new Date().toISOString(),
    active: true
  };
  
  const alerts = JSON.parse(localStorage.getItem('sosAlerts')) || [];
  alerts.push(alert);
  localStorage.setItem('sosAlerts', JSON.stringify(alerts));
  
  console.log('✅ Random alert generated:', alert);
  console.log('🔄 Refresh admin dashboard to see new alert!');
}

// Export functions to window for console access
window.generateTestData = generateTestData;
window.clearTestData = clearTestData;
window.generateRandomAlert = generateRandomAlert;

// Display usage instructions
console.log('\n📖 Usage Instructions:');
console.log('======================');
console.log('1. Generate test data:');
console.log('   generateTestData()');
console.log('\n2. Clear all test data:');
console.log('   clearTestData()');
console.log('\n3. Generate random SOS alert:');
console.log('   generateRandomAlert()');
console.log('\n4. View sample users:');
console.log('   Email: test1@example.com');
console.log('   Password: Test@123');
console.log('\n5. Admin login:');
console.log('   Username: admin');
console.log('   Password: Admin@19');
console.log('\n💡 Tip: Run generateTestData() first to populate the app with sample data!');
