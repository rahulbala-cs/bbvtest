# 🚀 Complete Setup Guide for Beginners

This guide assumes you're starting from scratch. Follow each step carefully!

## 📋 **What You'll Need Before Starting**

1. A computer with internet connection
2. A Google account (Gmail account)
3. A mobile phone for testing
4. Basic text editor (we'll use the one in your system)

---

## 🔥 **Step 1: Create Firebase Project (Backend Database)**

Firebase will store all your app data (polls, contestants, news).

### 1.1 Go to Firebase Console
1. Open your web browser
2. Go to: https://console.firebase.google.com/
3. Click **"Sign in"** with your Google account
4. You'll see the Firebase dashboard

### 1.2 Create New Project
1. Click the big **"Create a project"** button
2. Enter project name: `bigg-boss-telugu-vote` (exactly like this)
3. Click **"Continue"**
4. **Google Analytics**: You can enable or disable (doesn't matter for now)
5. Click **"Create project"**
6. Wait 30-60 seconds for project creation
7. Click **"Continue"** when done

### 1.3 Get Your Firebase Configuration
1. In your Firebase project dashboard, click the **gear icon** (⚙️) next to "Project Overview"
2. Click **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click **"Web app"** button (`</>` icon)
5. Enter app nickname: `Bigg Boss Telugu Vote`
6. Click **"Register app"**
7. **IMPORTANT**: You'll see a code block that looks like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC_some_long_string_here",
  authDomain: "bigg-boss-telugu-vote.firebaseapp.com",
  projectId: "bigg-boss-telugu-vote",
  storageBucket: "bigg-boss-telugu-vote.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```
8. **COPY THIS ENTIRE BLOCK** - you'll need it later!
9. Click **"Continue to console"**

---

## 🗄️ **Step 2: Set Up Database (Firestore)**

### 2.1 Create Firestore Database
1. In your Firebase project, click **"Firestore Database"** in the left menu
2. Click **"Create database"**
3. Choose **"Start in production mode"** (we'll change rules later)
4. Click **"Next"**
5. Choose location: **"asia-south1 (Mumbai)"** (closest to India)
6. Click **"Done"**
7. Wait for database creation (30 seconds)

### 2.2 Create Collections (Data Tables)
We need to create 3 collections: polls, contestants, and news.

#### Create "polls" collection:
1. Click **"Start collection"**
2. Collection ID: `polls` (exactly like this)
3. Click **"Next"**
4. For the first document:
   - Document ID: `sample-poll-1`
   - Add these fields by clicking **"+ Add field"**:
     - **title** (string): `Week 1: Who Should Be Eliminated?`
     - **embedUrl** (string): `https://poll.fm/sample123`
     - **isActive** (boolean): `true`
     - **week** (number): `1`
     - **season** (number): `8`
5. Click **"Save"**

#### Create "contestants" collection:
1. Click **"Start collection"**
2. Collection ID: `contestants`
3. Click **"Next"**
4. For the first document:
   - Document ID: `contestant-1`
   - Add fields:
     - **name** (string): `Sample Contestant`
     - **imageUrl** (string): `https://via.placeholder.com/300x400?text=Contestant`
     - **status** (string): `active`
     - **season** (number): `8`
     - **description** (string): `Sample contestant for testing`
5. Click **"Save"**

#### Create "news" collection:
1. Click **"Start collection"**
2. Collection ID: `news`
3. Click **"Next"**
4. For the first document:
   - Document ID: `news-1`
   - Add fields:
     - **title** (string): `Welcome to Bigg Boss Telugu Vote!`
     - **content** (string): `This is your first news update. More updates coming soon!`
     - **type** (string): `general`
     - **timestamp** (timestamp): Click **"Insert current timestamp"**
5. Click **"Save"**

### 2.3 Update Database Rules (Make it Public)
1. Click **"Rules"** tab at the top
2. You'll see some code. Replace ALL of it with:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```
3. Click **"Publish"**

---

## 📱 **Step 3: Set Up Mobile App Configuration**

### 3.1 Add Android App to Firebase
1. Go back to Project Settings (gear icon ⚙️)
2. In "Your apps" section, click **"Add app"**
3. Click **Android** icon
4. Enter package name: `com.yourcompany.biggbossteluguvote`
5. App nickname: `Bigg Boss Telugu Vote Android`
6. Click **"Register app"**
7. **Download** the `google-services.json` file
8. Click **"Next"** → **"Next"** → **"Continue to console"**

### 3.2 Add iOS App to Firebase
1. In "Your apps" section, click **"Add app"** again
2. Click **iOS** icon
3. Enter bundle ID: `com.yourcompany.biggbossteluguvote`
4. App nickname: `Bigg Boss Telugu Vote iOS`
5. Click **"Register app"**
6. **Download** the `GoogleService-Info.plist` file
7. Click **"Next"** → **"Next"** → **"Continue to console"**

### 3.3 Place Configuration Files
**IMPORTANT**: Place the downloaded files in your project:
1. Copy `google-services.json` to: `/Users/rahul.balakrishnan/Documents/Claude Code 2/Bigg Boss Telugu Vote 2/BiggBossTeluguVote/google-services.json`
2. Copy `GoogleService-Info.plist` to: `/Users/rahul.balakrishnan/Documents/Claude Code 2/Bigg Boss Telugu Vote 2/BiggBossTeluguVote/GoogleService-Info.plist`

---

## 🔧 **Step 4: Update App Configuration**

### 4.1 Update Firebase Config in Your App
1. Open the file: `src/config/firebase.ts`
2. Find this section:
```typescript
const firebaseConfig = {
  // TODO: Replace with your Firebase config
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```
3. Replace it with the config you copied from Step 1.3:
```typescript
const firebaseConfig = {
  apiKey: "AIzaSyC_your_actual_key_here",
  authDomain: "bigg-boss-telugu-vote.firebaseapp.com",
  projectId: "bigg-boss-telugu-vote",
  storageBucket: "bigg-boss-telugu-vote.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```
4. Save the file

### 4.2 Update Admin Panel Firebase Config
1. Open the file: `admin-panel/src/services/firebase.ts`
2. Replace the config there with the SAME config from Step 4.1
3. Save the file

---

## 💰 **Step 5: Set Up Google AdMob (Monetization)**

AdMob will show ads in your app to make money.

### 5.1 Create AdMob Account
1. Go to: https://admob.google.com/
2. Click **"Get started"**
3. Sign in with your Google account
4. Select **"Add new app to AdMob"**
5. Choose **"Android"** platform first
6. App name: `Bigg Boss Telugu Vote`
7. Select **"No"** for "Is your app listed on a supported app store?"
8. Click **"Add app"**

### 5.2 Create Ad Units
You need to create 2 types of ads:

#### Create Banner Ad:
1. Click **"Ad units"** in the left menu
2. Click **"Add ad unit"**
3. Select **"Banner"**
4. Ad unit name: `Bigg Boss Banner`
5. Click **"Create ad unit"**
6. **COPY** the Ad unit ID (looks like: `ca-app-pub-1234567890123456/1234567890`)
7. Save it somewhere - you'll need it!

#### Create Interstitial Ad:
1. Click **"Add ad unit"** again
2. Select **"Interstitial"**
3. Ad unit name: `Bigg Boss Interstitial`
4. Click **"Create ad unit"**
5. **COPY** this Ad unit ID too
6. Save it somewhere

### 5.3 Repeat for iOS
1. Click **"Apps"** in the left menu
2. Click **"Add app"**
3. Choose **"iOS"** platform
4. App name: `Bigg Boss Telugu Vote`
5. Create the same ad units (Banner and Interstitial)

### 5.4 Update App with AdMob IDs
1. Open the file: `src/services/ads.ts`
2. Find this section:
```typescript
const AD_UNIT_IDS = {
  banner: __DEV__ ? TestIds.BANNER : 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy',
  interstitial: __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy',
};
```
3. Replace the `ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy` parts with your actual AdMob IDs:
```typescript
const AD_UNIT_IDS = {
  banner: __DEV__ ? TestIds.BANNER : 'ca-app-pub-1234567890123456/1234567890',
  interstitial: __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-1234567890123456/0987654321',
};
```
4. Save the file

---

## 📲 **Step 6: Set Up Push Notifications**

### 6.1 Enable Cloud Messaging in Firebase
1. Go back to your Firebase project
2. Click **"Cloud Messaging"** in the left menu
3. Click **"Get started"** if you see it
4. Go to **"Project settings"** → **"Cloud Messaging"** tab
5. You'll see your **Server key** - copy it and save it

### 6.2 Create Expo Account
1. Go to: https://expo.dev/
2. Click **"Sign up"**
3. Create account with your email
4. Verify your email

### 6.3 Update Notification Config
1. Open the file: `src/services/notifications.ts`
2. Find this line:
```typescript
projectId: 'your-expo-project-id', // TODO: Replace with your Expo project ID
```
3. You'll get the project ID after running the app (Step 8)

---

## 🖥️ **Step 7: Install Required Software**

### 7.1 Install Node.js (Required for running the app)
1. Go to: https://nodejs.org/
2. Download the **LTS version** (left button)
3. Run the installer and follow the steps
4. Restart your computer after installation

### 7.2 Install Expo CLI
1. Open Terminal (Mac) or Command Prompt (Windows)
2. Type this command and press Enter:
```bash
npm install -g @expo/cli
```
3. Wait for installation to complete

---

## 🏃‍♂️ **Step 8: Run Your App**

### 8.1 Open Terminal in Your Project
1. **Mac**: Open Terminal, then type:
```bash
cd "/Users/rahul.balakrishnan/Documents/Claude Code 2/Bigg Boss Telugu Vote 2/BiggBossTeluguVote"
```
2. **Windows**: Open Command Prompt, then type:
```cmd
cd "C:\path\to\your\project\BiggBossTeluguVote"
```

### 8.2 Install App Dependencies
```bash
npm install --legacy-peer-deps
```
If this fails, try:
```bash
npm install --force
```

### 8.3 Start the App
```bash
npx expo start
```

You'll see a QR code and some options. Note the **Project ID** shown - update it in `src/services/notifications.ts`.

### 8.4 Install Expo Go App on Your Phone
1. **Android**: Download "Expo Go" from Google Play Store
2. **iPhone**: Download "Expo Go" from App Store
3. Open Expo Go and scan the QR code from your terminal
4. Your app should load on your phone!

---

## 🖥️ **Step 9: Run Admin Panel**

### 9.1 Open New Terminal
Keep the first terminal running the mobile app.

### 9.2 Go to Admin Panel Folder
```bash
cd admin-panel
```

### 9.3 Install Admin Panel Dependencies
```bash
npm install
```

### 9.4 Start Admin Panel
```bash
npm run dev
```

### 9.5 Open Admin Panel
1. Open your web browser
2. Go to: http://localhost:3000
3. You should see the admin panel!

---

## 🧪 **Step 10: Test Everything**

### 10.1 Test Mobile App
1. Open the app on your phone
2. You should see 3 tabs: Vote Now, Contestants, News
3. Check if the sample contestant appears in Contestants tab
4. Check if the sample news appears in News tab

### 10.2 Test Admin Panel
1. Go to Contestants tab in admin panel
2. Try adding a new contestant
3. Check if it appears in your mobile app

### 10.3 Test Push Notifications
1. Go to Notifications tab in admin panel
2. Send a test notification
3. It should appear on your phone

---

## 🎯 **Step 11: Make It Live (Final Steps)**

### 11.1 Get Real Crowdsignal Poll
1. Go to: https://crowdsignal.com/
2. Create an account
3. Create a poll: "Who should be eliminated this week?"
4. Add contestant names as options
5. Get the poll URL (looks like: https://poll.fm/12345678)

### 11.2 Update Poll in Admin Panel
1. Go to Polls tab in admin panel
2. Add your real Crowdsignal URL
3. The poll will now appear in your mobile app!

### 11.3 Add Real Contestant Photos
1. Find photos of Bigg Boss Telugu contestants
2. Upload them to a free image hosting service like:
   - Imgur.com
   - Cloudinary.com
   - Or use direct links from official sources
3. Add contestants through admin panel with real photos

### 11.4 Publish News Updates
1. Use the admin panel to publish news
2. Create different types: eliminations, voting reminders, announcements

---

## 🚀 **Step 12: Deploy to App Stores (Optional)**

### For Google Play Store:
1. Create Google Play Developer account ($25 one-time fee)
2. Build your app: `npx expo build:android`
3. Upload the APK file to Google Play Console

### For Apple App Store:
1. Create Apple Developer account ($99/year)
2. Build your app: `npx expo build:ios`
3. Upload to App Store Connect

---

## 🆘 **Common Issues & Solutions**

### "Firebase not initialized"
- Check if you copied the firebase config correctly
- Ensure google-services.json is in the right place

### "Module not found"
- Run: `npm install --force`
- Restart the terminal

### "Can't connect to database"
- Check your internet connection
- Verify Firestore rules allow read/write

### "Ads not showing"
- AdMob ads take 24-48 hours to start showing
- Test ads should work immediately

### App crashes on phone
- Check the terminal for error messages
- Try restarting: Ctrl+C then `npx expo start`

---

## 📞 **Need Help?**

If you get stuck:
1. Check the error messages in terminal
2. Google the exact error message
3. Check Expo documentation: https://docs.expo.dev/
4. Check Firebase documentation: https://firebase.google.com/docs

---

## 🎉 **You're Done!**

Congratulations! You now have:
- ✅ A working mobile app with voting, contestants, and news
- ✅ An admin panel to manage content
- ✅ Push notifications system
- ✅ Ad monetization setup
- ✅ Real-time database with Firebase

Your app is ready to get Bigg Boss Telugu fans voting! 🗳️📱