/**
 * Database Initialization Script
 * Run this script to set up the basic Firestore data structure
 * 
 * Usage: node initialize-database.js
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('./android/app/google-services.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function initializeDatabase() {
  try {
    console.log('🚀 Initializing Bigg Boss Telugu App Database...');

    // 1. Create App Configuration
    console.log('📱 Creating app configuration...');
    await db.collection('config').doc('app').set({
      currentSeason: 9,
      adMobBannerId: '',
      adMobInterstitialId: '',
      adFrequencyCapMinutes: 60,
      appName: 'Bigg Boss Telugu Vote',
      appVersion: '1.0.0',
      maintenanceMode: false,
      maintenanceMessage: '',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 2. Create Default Tab Configuration
    console.log('📋 Creating default tab configuration...');
    const tabs = [
      { key: 'vote', label: 'Vote', order: 1 },
      { key: 'promos', label: 'Promos', order: 2 },
      { key: 'updates', label: 'Latest Updates', order: 3 },
      { key: 'contestants', label: 'Contestants', order: 4 },
    ];

    for (const tab of tabs) {
      await db.collection('tabConfigs').add({
        ...tab,
        season: 9,
        isEnabled: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    // 3. Create Sample Poll
    console.log('🗳️ Creating sample poll...');
    await db.collection('polls').add({
      title: 'Week 1: Vote for your Favorite Contestant',
      embedUrl: 'https://poll.fm/10967724',
      pollId: '10967724',
      week: 1,
      season: 9,
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 4. Create Sample Twitter Feed
    console.log('🐦 Creating Twitter feed configuration...');
    await db.collection('twitterFeeds').add({
      hashtag: '#biggbosstelugu9',
      season: 9,
      displayCount: 10,
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 5. Create Sample Promo Video
    console.log('🎬 Creating sample promo video...');
    await db.collection('promoVideos').add({
      title: 'Bigg Boss Telugu Season 9 - Grand Premiere',
      youtubeId: 'dQw4w9WgXcQ', // Rick Roll as placeholder
      thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      description: 'Watch the grand premiere of Bigg Boss Telugu Season 9!',
      duration: '2:30',
      season: 9,
      week: 1,
      isActive: true,
      publishedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 6. Create Sample News Item
    console.log('📰 Creating sample news item...');
    await db.collection('news').add({
      title: 'Bigg Boss Telugu Season 9 Starts Today!',
      content: 'The most awaited reality show is back with its 9th season. Get ready for entertainment, drama, and surprises!',
      type: 'announcement',
      source: 'Official',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 7. Create Sample Contestants
    console.log('👥 Creating sample contestants...');
    const contestants = [
      { name: 'Contestant 1', profession: 'Actor', age: 28, hometown: 'Hyderabad' },
      { name: 'Contestant 2', profession: 'Singer', age: 25, hometown: 'Visakhapatnam' },
      { name: 'Contestant 3', profession: 'Dancer', age: 30, hometown: 'Vijayawada' },
    ];

    for (const contestant of contestants) {
      await db.collection('contestants').add({
        ...contestant,
        imageUrl: 'https://via.placeholder.com/300x300/4F46E5/FFFFFF?text=' + encodeURIComponent(contestant.name),
        status: 'active',
        season: 9,
        description: `${contestant.profession} from ${contestant.hometown}`,
      });
    }

    console.log('✅ Database initialization completed successfully!');
    console.log('🎉 Your app should now work properly with sample data.');
    console.log('📱 Use the admin panel to manage and update the content.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

// Run the initialization
initializeDatabase();
