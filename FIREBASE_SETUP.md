# Firebase Setup Guide

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `bigg-boss-telugu-vote`
4. Enable Google Analytics (optional)
5. Create project

## 2. Enable Required Services

### Firestore Database
1. Go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Start in production mode
4. Choose your database location (asia-south1 for India)

### Authentication (Optional)
1. Go to "Authentication" in the left sidebar
2. Click "Get started"
3. Enable sign-in methods if needed

### Cloud Messaging
1. Go to "Cloud Messaging" in the left sidebar
2. Enable the API if prompted

## 3. Get Configuration Files

### For Mobile App
1. Add an Android app:
   - Package name: `com.yourcompany.biggbossteluguvote`
   - Download `google-services.json`
   - Place in project root

2. Add an iOS app:
   - Bundle ID: `com.yourcompany.biggbossteluguvote`
   - Download `GoogleService-Info.plist`
   - Place in project root

### For Web Admin Panel
1. Add a web app
2. Copy the configuration object
3. Update `admin-panel/src/services/firebase.ts`

## 4. Create Firestore Collections

### Collection: `polls`
Create documents with this structure:
```json
{
  "title": "Week 5: Who Should Be Eliminated? Vote Now!",
  "embedUrl": "https://poll.fm/12345678",
  "isActive": true,
  "week": 5,
  "season": 8,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

### Collection: `contestants`
Create documents with this structure:
```json
{
  "name": "Contestant Name",
  "imageUrl": "https://example.com/photo.jpg",
  "status": "active",
  "season": 8,
  "description": "Brief description about the contestant"
}
```

### Collection: `news`
Create documents with this structure:
```json
{
  "title": "Breaking: Contestant X Eliminated!",
  "content": "In tonight's episode, Contestant X was eliminated from the Bigg Boss house...",
  "timestamp": "2024-01-15T20:00:00Z",
  "type": "elimination",
  "imageUrl": "https://example.com/news-image.jpg"
}
```

## 5. Set Firestore Security Rules

Go to Firestore → Rules and set:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to all documents
    match /{document=**} {
      allow read: if true;
    }
    
    // Allow write access only from admin panel (add auth rules as needed)
    match /{document=**} {
      allow write: if false; // Update with proper authentication
    }
  }
}
```

## 6. Update Configuration Files

### Mobile App (`src/config/firebase.ts`)
```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### Admin Panel (`admin-panel/src/services/firebase.ts`)
Use the same configuration.

## 7. Test the Setup

1. Start your mobile app: `npm start`
2. Start your admin panel: `cd admin-panel && npm run dev`
3. Add a test contestant through the admin panel
4. Verify it appears in the mobile app

## 8. Production Setup

### Security Rules
Update Firestore rules to include proper authentication:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access
    match /{document=**} {
      allow read: if true;
    }
    
    // Admin write access only
    match /{document=**} {
      allow write: if request.auth != null && 
                     request.auth.token.admin == true;
    }
  }
}
```

### Environment Variables
Set up environment variables for sensitive data:
- `FIREBASE_API_KEY`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_APP_ID`

## 9. Push Notifications Setup

1. Go to Project Settings → Cloud Messaging
2. Generate a new private key for Admin SDK
3. Use this key for sending notifications from your backend
4. Configure FCM in your mobile app

## Troubleshooting

### Common Issues:

1. **"Default app hasn't been initialized"**
   - Ensure firebase config is correct
   - Check if google-services.json/GoogleService-Info.plist are in place

2. **"Missing or insufficient permissions"**
   - Check Firestore security rules
   - Ensure proper authentication is set up

3. **Push notifications not working**
   - Verify FCM is enabled
   - Check device permissions
   - Test with Firebase Console → Cloud Messaging

4. **Build errors on mobile**
   - Run `npx expo install --fix` to fix dependency issues
   - Clear cache: `npx expo start --clear`

For more help, check [Firebase Documentation](https://firebase.google.com/docs)