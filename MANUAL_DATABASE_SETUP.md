# Manual Database Setup Guide

The automated script requires a Firebase Admin Service Account key. Since you have `google-services.json` (for Android), here's how to set up the database manually:

## 🚀 **EASIEST METHOD: Use Admin Panel**

### **Step 1: Start Admin Panel**
```bash
cd admin-panel
npm run dev
```
Open: `http://localhost:5173`

### **Step 2: Configure Each Section**

#### **1. App Config Tab**
- Current Season: `9`
- App Name: `Bigg Boss Telugu Vote`
- App Version: `1.0.0`
- Ad Frequency Cap: `60`
- Maintenance Mode: `false`

#### **2. Polls Tab**
Create a poll with:
- Title: `Week 1: Vote for your Favorite Contestant`
- Poll ID: `10967724`
- Fallback URL: `https://poll.fm/10967724`
- Week: `1`, Season: `9`

#### **3. Promo Videos Tab**
Add sample videos:
- Title: `Bigg Boss Telugu Season 9 - Grand Premiere`
- YouTube ID: `dQw4w9WgXcQ`
- Description: `Watch the grand premiere!`
- Duration: `2:30`
- Season: `9`, Week: `1`

#### **4. Twitter Feed Tab**
- Hashtag: `#biggbosstelugu9`
- Season: `9`
- Display Count: `10`
- Active: `true`

#### **5. Contestants Tab**
Add sample contestants with:
- Name, Age, Profession, Hometown
- Status: `active`, Season: `9`

#### **6. News Tab**
Add sample news items with different types.

---

## 📋 **ALTERNATIVE: Firebase Console Setup**

If you prefer using Firebase Console directly:

### **1. Go to Firebase Console**
- Open [console.firebase.google.com](https://console.firebase.google.com)
- Select your project
- Go to Firestore Database

### **2. Create Collections**

#### **Create `config` collection:**
1. Click "Start collection"
2. Collection ID: `config`
3. Document ID: `app`
4. Add fields:
   ```
   currentSeason: 9 (number)
   appName: "Bigg Boss Telugu Vote" (string)
   appVersion: "1.0.0" (string)
   adFrequencyCapMinutes: 60 (number)
   maintenanceMode: false (boolean)
   ```

#### **Create `tabConfigs` collection:**
Create 4 documents with these patterns:
```
Document 1:
key: "vote" (string)
label: "Vote" (string)
order: 1 (number)
season: 9 (number)
isEnabled: true (boolean)

Document 2:
key: "promos" (string)
label: "Promos" (string)
order: 2 (number)
season: 9 (number)
isEnabled: true (boolean)

... (repeat for "updates" and "contestants")
```

#### **Update existing `polls` collection:**
Add `pollId` field to existing polls:
```
pollId: "10967724" (string)
```

#### **Create `promoVideos` collection:**
```
title: "Sample Video" (string)
youtubeId: "dQw4w9WgXcQ" (string)
thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg" (string)
season: 9 (number)
isActive: true (boolean)
publishedAt: [current timestamp]
```

#### **Create `twitterFeeds` collection:**
```
hashtag: "#biggbosstelugu9" (string)
season: 9 (number)
displayCount: 10 (number)
isActive: true (boolean)
```

---

## ⚡ **Quick Validation**

After setup, check these in Firebase Console:

- [ ] `config/app` document exists
- [ ] `tabConfigs` has 4 documents (vote, promos, updates, contestants)
- [ ] `polls` documents have `pollId` field
- [ ] `promoVideos` has at least 1 video
- [ ] `twitterFeeds` has 1 active feed
- [ ] App loads without "Cannot read property 'docs' of null" error

---

## 🔧 **Troubleshooting**

**If app still shows errors:**
1. Clear app cache: `adb shell pm clear com.biggboss.teluguvote`
2. Restart Metro: `npm start -- --reset-cache`
3. Rebuild app: `npm run android`

**If admin panel doesn't work:**
1. Check if you're in `admin-panel` directory
2. Run `npm install` in admin-panel
3. Ensure Firebase config is correct

---

## 📱 **Expected Result**

After setup, your app should show:
- ✅ Banner image (no text overlay)
- ✅ Navigation tabs (Vote, Promos, Latest Updates, Contestants)
- ✅ Working poll in Vote tab
- ✅ YouTube videos in Promos tab
- ✅ Twitter feed + News in Updates tab
- ✅ Contestants list ready

The admin panel approach is recommended as it handles all the field types and validation automatically!
