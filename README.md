# Bigg Boss Telugu Vote App

A React Native app built with Expo that allows fans to vote in weekly polls for the Bigg Boss Telugu show, view contestant profiles, read news updates, and receive push notifications.

## Features

- 🗳️ **Voting Hub**: Embedded Crowdsignal polls for weekly elimination voting
- 👥 **Contestant Profiles**: Grid view of all contestants with status tracking
- 📰 **News & Updates**: Latest elimination and show news
- 📱 **Push Notifications**: Real-time voting reminders and updates
- 💰 **AdMob Integration**: Banner and interstitial ads for monetization
- 🔄 **Real-time Updates**: Firebase Firestore integration for live data

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **Firebase Firestore** for backend data
- **Firebase Cloud Messaging** for push notifications
- **Google AdMob** for monetization
- **React Navigation** for navigation
- **Expo Image** for optimized image loading

## Setup Instructions

### 1. Install Dependencies

Due to npm cache issues, you may need to install dependencies manually:

```bash
# Using npm (may need --force flag)
npm install --force

# Or using yarn if you have it
yarn install
```

### 2. Firebase Configuration

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Add your Firebase config to `src/config/firebase.ts`
3. Enable Firestore Database
4. Enable Cloud Messaging
5. Create the following Firestore collections:
   - `polls` - for voting polls
   - `contestants` - for contestant data
   - `news` - for news updates

### 3. Google AdMob Setup

1. Create an AdMob account at [https://admob.google.com/](https://admob.google.com/)
2. Create ad units for banner and interstitial ads
3. Update the ad unit IDs in `src/services/ads.ts`

### 4. Expo Configuration

1. Update your Expo project ID in `src/services/notifications.ts`
2. Configure app.json with your app details

### 5. Push Notifications Setup

1. Configure Firebase Cloud Messaging in your Firebase console
2. Set up notification sending endpoint (see admin panel)

## Running the App

```bash
# Start the development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator  
npm run android

# Run on web
npm run web
```

## Admin Panel

The admin panel is located in the `admin-panel/` directory and provides:

- Poll management (activate/deactivate voting polls)
- Contestant management (add/edit/delete contestants)
- News management (publish news updates)
- Push notification sender

### Running the Admin Panel

```bash
cd admin-panel
npm install
npm run dev
```

## Firebase Collections Structure

### Polls Collection (`polls`)
```typescript
{
  title: string
  embedUrl: string
  isActive: boolean
  week: number
  season: number
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Contestants Collection (`contestants`)
```typescript
{
  name: string
  imageUrl: string
  status: 'active' | 'eliminated'
  season: number
  description?: string
}
```

### News Collection (`news`)
```typescript
{
  title: string
  content: string
  timestamp: timestamp
  type: 'elimination' | 'general' | 'voting' | 'announcement'
  imageUrl?: string
}
```

## Deployment

### Mobile App
1. Build for production: `expo build:android` / `expo build:ios`
2. Upload to Google Play Store / Apple App Store

### Admin Panel
1. Build: `npm run build`
2. Deploy to your preferred hosting service (Vercel, Netlify, etc.)

## Environment Variables

Create a `.env` file with:
```
EXPO_PROJECT_ID=your-expo-project-id
FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_PROJECT_ID=your-firebase-project-id
ADMOB_BANNER_ID=your-admob-banner-id
ADMOB_INTERSTITIAL_ID=your-admob-interstitial-id
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes. Please respect Bigg Boss Telugu's intellectual property and trademarks.