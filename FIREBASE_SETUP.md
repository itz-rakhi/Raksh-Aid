# Firebase Setup Guide for RAKSH-AID

## Step 1: Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Enter project name: `raksh-aid` (or any name you prefer)
4. Disable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Firestore Database

1. In Firebase Console, click "Firestore Database" in left menu
2. Click "Create database"
3. Select "Start in test mode" (we'll secure it later)
4. Choose location closest to you
5. Click "Enable"

## Step 3: Enable Authentication

1. Click "Authentication" in left menu
2. Click "Get started"
3. Click "Email/Password" under Sign-in method
4. Enable "Email/Password"
5. Click "Save"

## Step 4: Get Firebase Configuration

1. Click the gear icon ⚙️ next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps"
4. Click the web icon `</>`
5. Register app with nickname: "RAKSH-AID Web"
6. Copy the firebaseConfig object

## Step 5: Update firebase-config.js

1. Open `firebase-config.js` in your project
2. Replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "AIza...",  // Copy from Firebase Console
    authDomain: "raksh-aid-xxxxx.firebaseapp.com",
    projectId: "raksh-aid-xxxxx",
    storageBucket: "raksh-aid-xxxxx.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:xxxxx",
    databaseURL: "https://raksh-aid-xxxxx-default-rtdb.firebaseio.com"
};
```

## Step 6: Deploy to Firebase Hosting

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project folder:
   ```bash
   cd "c:\Users\rakhi\OneDrive\major project\rakshaaid"
   firebase init
   ```
   - Select: Hosting
   - Use existing project: Select your project
   - Public directory: `.` (current directory)
   - Single-page app: Yes
   - Don't overwrite index.html

4. Deploy:
   ```bash
   firebase deploy
   ```

5. Your app will be live at: `https://your-project-id.web.app`

## Step 7: Share with Friends

Share the deployed URL with your friends:
- They can register and login from their phones
- Admin can see all users in real-time
- All data syncs across devices

## Security Rules (Optional - After Testing)

Update Firestore rules for better security:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    match /alerts/{alertId} {
      allow read, write: if request.auth != null;
    }
    match /contacts/{contactId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Troubleshooting

- **Error: Firebase not defined** - Make sure Firebase scripts are loaded before your code
- **Permission denied** - Check Firestore rules are in test mode
- **Auth error** - Verify Email/Password authentication is enabled

## Cost

Firebase free tier includes:
- 50,000 reads/day
- 20,000 writes/day
- 1GB storage
- 10GB bandwidth/month

Perfect for your project! 🎉
