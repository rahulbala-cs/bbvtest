# Firebase Database Schema Migration Guide

## 🔄 Required Schema Changes

### **NEW Collections** (Must Create):
1. **`config/app`** - App configuration document
2. **`tabConfigs`** - Dynamic tab navigation
3. **`promoVideos`** - YouTube video management  
4. **`twitterFeeds`** - Social media integration
5. **`rssFeeds`** - News feed sources

### **UPDATED Collections** (Modify Existing):
1. **`polls`** - Add `pollId` field, remove `hashtag`
2. **`contestants`** - Add `age`, `profession`, `hometown`
3. **`news`** - Add `source`, `url` fields

---

## ⚡ **QUICKEST SETUP METHOD**

### **Option 1: Automated Setup (Recommended)**

```bash
# Install firebase-admin if not installed
npm install firebase-admin

# Run the automated setup script
node setup-firebase-schema.js
```

This will:
- ✅ Create all required collections
- ✅ Add sample data for testing
- ✅ Set proper field types and indexes
- ✅ Ensure no fields are missed

### **Option 2: Manual Setup via Admin Panel**

```bash
# Start admin panel
cd admin-panel
npm run dev
# Open http://localhost:5173
```

Then configure each section:
1. **App Config** - Set current season, app settings
2. **Polls** - Create voting polls 
3. **Promo Videos** - Add YouTube content
4. **Twitter Feed** - Configure hashtags
5. **Contestants** - Add contestant profiles
6. **News** - Add news items

---

## 📋 **Complete Field Reference**

### **config/app** (New Document)
```json
{
  "currentSeason": 9,
  "appName": "Bigg Boss Telugu Vote",
  "appVersion": "1.0.0", 
  "adMobBannerId": "",
  "adMobInterstitialId": "",
  "adFrequencyCapMinutes": 60,
  "maintenanceMode": false,
  "maintenanceMessage": ""
}
```

### **tabConfigs** (New Collection)
```json
{
  "key": "vote|promos|updates|contestants",
  "label": "Display Name",
  "order": 1,
  "season": 9,
  "isEnabled": true
}
```

### **polls** (Modified)
```json
{
  "title": "Week 1: Vote Now",
  "embedUrl": "https://poll.fm/10967724",
  "pollId": "10967724",  // NEW FIELD
  "week": 1,
  "season": 9,
  "isActive": true
  // REMOVED: hashtag (moved to twitterFeeds)
}
```

### **promoVideos** (New Collection)  
```json
{
  "title": "Video Title",
  "youtubeId": "dQw4w9WgXcQ",
  "thumbnailUrl": "auto-generated",
  "description": "Optional description",
  "duration": "2:30",
  "season": 9,
  "week": 1,
  "isActive": true,
  "publishedAt": "timestamp"
}
```

### **twitterFeeds** (New Collection)
```json
{
  "hashtag": "#biggbosstelugu9", 
  "season": 9,
  "displayCount": 10,
  "isActive": true
}
```

### **contestants** (Enhanced)
```json
{
  "name": "Contestant Name",
  "imageUrl": "https://...",
  "status": "active|eliminated",
  "season": 9,
  "description": "Bio text",
  "age": 28,          // NEW
  "profession": "Actor", // NEW  
  "hometown": "Hyderabad" // NEW
}
```

### **news** (Enhanced)
```json
{
  "title": "News Title",
  "content": "News content", 
  "timestamp": "timestamp",
  "type": "announcement|general|voting|elimination",
  "imageUrl": "optional",
  "source": "RSS Source Name", // NEW
  "url": "https://external-link"  // NEW
}
```

---

## 🚀 **Quick Start Instructions**

1. **Run the setup script:**
   ```bash
   node setup-firebase-schema.js
   ```

2. **Test your app:**
   ```bash
   npm run android
   ```

3. **Access admin panel:**
   ```bash
   cd admin-panel && npm run dev
   ```

4. **Replace sample data** with real content via admin panel

---

## ⚠️ **Important Notes**

- **Backward Compatible**: Old polls will still work
- **Graceful Fallbacks**: App works even with missing data
- **No Data Loss**: Existing contestants/news remain intact
- **Indexes**: The script creates optimal Firestore indexes

## 🔍 **Verify Setup**

After running the script, check Firebase Console:
- [ ] `config/app` document exists
- [ ] `tabConfigs` has 4 documents  
- [ ] `polls` has pollId field
- [ ] `promoVideos` has sample videos
- [ ] `twitterFeeds` has hashtag config
- [ ] Enhanced contestants have new fields

Your database is now ready for the new app features! 🎉
