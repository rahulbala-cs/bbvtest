# Database Setup Guide

## Issue Resolution
The "Cannot read property 'docs' of null" error has been fixed with better Firestore error handling. The app now works with fallback defaults when collections don't exist.

## Quick Setup via Admin Panel

1. **Start the Admin Panel**
   ```bash
   cd admin-panel
   npm run dev
   ```
   Open `http://localhost:5173`

2. **Configure App Settings**
   - Go to "App Config" tab
   - Set Current Season: `9`
   - Save configuration

3. **Create a Poll**
   - Go to "Polls" tab
   - Create a new poll with:
     - Title: "Week 1: Vote for your Favorite Contestant"
     - Poll ID: `10967724`
     - Fallback URL: `https://poll.fm/10967724`
     - Week: `1`, Season: `9`

4. **Add Sample Content (Optional)**
   - **Promo Videos**: Add YouTube videos in "Promo Videos" tab
   - **Twitter Feed**: Configure hashtag in "Twitter Feed" tab
   - **Contestants**: Add contestants in "Contestants" tab
   - **News**: Add news items in "News" tab

## Sample Data Structure

If you prefer to add data directly to Firestore console:

### App Config (`config/app`)
```json
{
  "currentSeason": 9,
  "appName": "Bigg Boss Telugu Vote",
  "appVersion": "1.0.0",
  "adFrequencyCapMinutes": 60,
  "maintenanceMode": false
}
```

### Tab Configs (`tabConfigs` collection)
```json
[
  {"key": "vote", "label": "Vote", "order": 1, "season": 9, "isEnabled": true},
  {"key": "promos", "label": "Promos", "order": 2, "season": 9, "isEnabled": true},
  {"key": "updates", "label": "Latest Updates", "order": 3, "season": 9, "isEnabled": true},
  {"key": "contestants", "label": "Contestants", "order": 4, "season": 9, "isEnabled": true}
]
```

### Sample Poll (`polls` collection)
```json
{
  "title": "Week 1: Vote for your Favorite Contestant",
  "embedUrl": "https://poll.fm/10967724",
  "pollId": "10967724",
  "week": 1,
  "season": 9,
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

## App Status
✅ **Fixed**: Firestore null reference errors
✅ **Added**: Fallback defaults for missing collections
✅ **Updated**: Admin panel with new content management
✅ **Ready**: App works immediately with or without data

The app will now show the default tabs and banner even when Firestore collections are empty!
