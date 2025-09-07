# 🚀 React Native CLI Setup Guide - NO EXPO DEPENDENCY

This is your complete beginner guide to run the **pure React Native CLI** version of the Bigg Boss Telugu Vote app. **No Expo costs, smaller APK, full control!**

---

## 📋 **What You'll Need Before Starting**

1. A computer with internet connection
2. A Google account (Gmail account)
3. Android phone or Android Studio emulator for testing
4. **More setup required than Expo, but worth it for zero dependency!**

---

## 🔥 **Step 1: Install Required Software**

### 1.1 Install Node.js
1. Go to: https://nodejs.org/
2. Download **LTS version** (left button)
3. Install and restart computer

### 1.2 Install Java Development Kit (JDK)
1. Go to: https://adoptium.net/
2. Download **JDK 11** (recommended for React Native)
3. Install and note the installation path

### 1.3 Install Android Studio
1. Go to: https://developer.android.com/studio
2. Download Android Studio
3. Install with **default settings**
4. Open Android Studio and go through initial setup
5. Install **Android SDK Platform 33** when prompted

### 1.4 Set Environment Variables
**Windows:**
1. Open System Properties → Advanced → Environment Variables
2. Add new variables:
   - `JAVA_HOME`: Path to JDK (e.g., `C:\Program Files\Eclipse Adoptium\jdk-11.0.19.7-hotspot`)
   - `ANDROID_HOME`: Path to Android SDK (e.g., `C:\Users\YourName\AppData\Local\Android\Sdk`)
3. Add to PATH: `%ANDROID_HOME%\platform-tools`

**Mac:**
1. Edit `~/.bash_profile` or `~/.zshrc`:
```bash
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-11.0.19.7-hotspot/Contents/Home
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
```
2. Run: `source ~/.bash_profile`

---

## 🔥 **Step 2: Firebase Setup (Same as Before)**

### 2.1 Create Firebase Project
1. Go to: https://console.firebase.google.com/
2. Click **"Create a project"**
3. Enter: `bigg-boss-telugu-vote`
4. Enable/disable Analytics (your choice)
5. Wait for creation

### 2.2 Add Android App
1. Click **Android icon** in project overview
2. Package name: `com.biggbossteluguvote` (**exactly this**)
3. App nickname: `Bigg Boss Telugu Vote`
4. **Download `google-services.json`**
5. **IMPORTANT**: Place this file in: 
   `/Users/rahul.balakrishnan/Documents/Claude Code 2/Bigg Boss Telugu Vote 2/BiggBossTeluguVote/android/app/google-services.json`

### 2.3 Set Up Firestore (Same as before)
1. Enable Firestore Database
2. Create collections: `polls`, `contestants`, `news` (see previous guide)
3. Set rules to allow read/write

---

## 💰 **Step 3: AdMob Setup (Same as Before)**

1. Create AdMob account at https://admob.google.com/
2. Add app with package name: `com.biggbossteluguvote`
3. Create Banner and Interstitial ad units
4. **Copy the Ad Unit IDs** - you'll need them!

---

## 🔧 **Step 4: Configure Your App**

### 4.1 Install Dependencies
1. Open terminal/command prompt
2. Navigate to your project:
```bash
cd "/Users/rahul.balakrishnan/Documents/Claude Code 2/Bigg Boss Telugu Vote 2/BiggBossTeluguVote"
```
3. Install dependencies:
```bash
npm install
```

### 4.2 Update AdMob IDs
1. Open: `src/services/ads.ts`
2. Find this section:
```typescript
const AD_UNIT_IDS = {
  banner: __DEV__ ? TestIds.BANNER : 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy',
  interstitial: __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy',
};
```
3. Replace with your actual AdMob IDs from Step 3

### 4.3 Update Android App ID in Manifest
1. Open: `android/app/src/main/AndroidManifest.xml`
2. Find this line:
```xml
<meta-data
  android:name="com.google.android.gms.ads.APPLICATION_ID"
  android:value="ca-app-pub-3940256099942544~3347511713"/>
```
3. Replace the value with your actual AdMob App ID (not ad unit ID!)

---

## 📱 **Step 5: Run Your App**

### 5.1 Start Metro Server
```bash
npm start
```
Keep this terminal open!

### 5.2 Run on Android Device
**Option A: Real Android Phone (Recommended)**
1. Enable **Developer Options** on your phone:
   - Go to Settings → About Phone
   - Tap **Build Number** 7 times
2. Enable **USB Debugging** in Developer Options
3. Connect phone to computer via USB
4. Open new terminal and run:
```bash
npx react-native run-android
```

**Option B: Android Emulator**
1. Open Android Studio
2. Click **AVD Manager** (Android Virtual Device)
3. Create new virtual device (Pixel 4, API 33)
4. Start the emulator
5. Run: `npx react-native run-android`

---

## 🖥️ **Step 6: Run Admin Panel (Same as Before)**

1. Open new terminal
2. Navigate to admin panel:
```bash
cd admin-panel
```
3. Install dependencies:
```bash
npm install
```
4. Start admin panel:
```bash
npm run dev
```
5. Open: http://localhost:3000

---

## 🧪 **Step 7: Test Everything**

### 7.1 What Should Work
- ✅ 3 tabs: Vote Now, Contestants, News
- ✅ Firebase data loading
- ✅ Push notifications (after setup)
- ✅ AdMob test ads showing
- ✅ Admin panel controls

### 7.2 Add Test Data
1. Use admin panel to add:
   - Sample poll with real Crowdsignal URL
   - Contestant profiles with photos
   - News updates

---

## 🚀 **Step 8: Build Release APK**

When ready to publish:

### 8.1 Generate Release Keystore
```bash
cd android/app
keytool -genkeypair -v -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```
Enter a strong password and remember it!

### 8.2 Build Release APK
```bash
cd ../..
npx react-native build-android --mode=release
```

### 8.3 Find Your APK
Look in: `android/app/build/outputs/apk/release/app-release.apk`

This APK is ready for Google Play Store! 📱

---

## 🆚 **React Native CLI vs Expo - What Changed**

### ✅ **Benefits You Now Have:**
- **No Expo service costs** - completely free
- **Smaller APK size** - faster downloads for users  
- **Full native control** - can modify anything
- **Direct Google Play deployment** - no Expo account needed
- **Better performance** - native modules only

### 🔄 **What's Different:**
- **More setup** - but this guide covers everything
- **Android Studio required** - but you need it anyway for publishing
- **Manual dependency management** - but better control
- **Direct Firebase integration** - more powerful

### 📦 **Technical Changes Made:**
- Removed all `expo-*` dependencies
- Replaced `expo-image` → `react-native-fast-image`
- Replaced `expo-status-bar` → React Native `StatusBar`
- Replaced `expo-notifications` → `@react-native-firebase/messaging`
- Direct Android configuration instead of `app.json`

---

## 🆘 **Troubleshooting Common Issues**

### "Metro server not found"
```bash
npx react-native start --reset-cache
```

### "Android build failed"
1. Clean build: `cd android && ./gradlew clean`
2. Try: `npx react-native run-android --reset-cache`

### "Firebase not connecting"
- Check `google-services.json` is in `android/app/`
- Verify package name matches: `com.biggbossteluguvote`

### "AdMob ads not showing"
- Test ads work immediately
- Real ads take 24-48 hours to appear
- Check AdMob app ID in AndroidManifest.xml

### "Push notifications not working"
- Verify FCM is enabled in Firebase Console
- Check Android permissions in AndroidManifest.xml

---

## 🎉 **Congratulations!**

You now have:
- ✅ **Pure React Native app** with zero Expo dependency
- ✅ **Smaller, faster APK** ready for Google Play Store
- ✅ **Full control** over your app's native features
- ✅ **No ongoing service costs** from Expo
- ✅ **Professional-grade setup** used by top apps

Your app will perform better and cost nothing to maintain! 🚀

---

## 📞 **Still Need Help?**

- Check React Native docs: https://reactnative.dev/docs/environment-setup
- Firebase React Native: https://rnfirebase.io/
- Common errors: Google the exact error message

**Your app is now completely independent and ready for the Google Play Store!** 🤖📱