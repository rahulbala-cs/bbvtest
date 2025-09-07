/**
 * Firebase Schema Setup Script
 * 
 * This script will create all required collections with sample data
 * and ensure your database matches the new app structure.
 * 
 * Prerequisites:
 * 1. npm install firebase-admin
 * 2. Ensure google-services.json is in android/app/
 * 
 * Usage: node setup-firebase-schema.js
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
try {
  const serviceAccountPath = path.join(__dirname, 'android', 'app', 'google-services.json');
  const serviceAccount = require(serviceAccountPath);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  console.log('✅ Firebase Admin initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin:', error.message);
  console.log('\n🔧 Make sure google-services.json exists in android/app/');
  process.exit(1);
}

const db = admin.firestore();

async function setupFirebaseSchema() {
  try {
    console.log('🚀 Setting up Firebase schema for Bigg Boss Telugu App...\n');

    // 1. App Configuration
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
    console.log('   ✅ App config created');

    // 2. Tab Configuration (Dynamic Navigation)
    console.log('\n📋 Creating tab configuration...');
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
      console.log(`   ✅ ${tab.label} tab created`);
    }

    // 3. Sample Poll (with new pollId field)
    console.log('\n🗳️ Creating sample poll...');
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
    console.log('   ✅ Sample poll created');

    // 4. Twitter Feed Configuration
    console.log('\n🐦 Creating Twitter feed configuration...');
    await db.collection('twitterFeeds').add({
      hashtag: '#biggbosstelugu9',
      season: 9,
      displayCount: 10,
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log('   ✅ Twitter feed config created');

    // 5. RSS Feed Configuration
    console.log('\n📰 Creating RSS feed configuration...');
    const rssFeeds = [
      {
        name: 'Telugu Cinema News',
        url: 'https://feeds.feedburner.com/TeluguCinema',
        refreshInterval: 60,
      },
      {
        name: 'Entertainment News',
        url: 'https://feeds.feedburner.com/Entertainment',
        refreshInterval: 120,
      }
    ];

    for (const feed of rssFeeds) {
      await db.collection('rssFeeds').add({
        ...feed,
        isActive: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`   ✅ ${feed.name} RSS feed created`);
    }

    // 6. Sample Promo Videos
    console.log('\n🎬 Creating sample promo videos...');
    const promoVideos = [
      {
        title: 'Bigg Boss Telugu Season 9 - Grand Premiere',
        youtubeId: 'dQw4w9WgXcQ',
        description: 'Watch the grand premiere of Bigg Boss Telugu Season 9!',
        duration: '2:30',
        week: 1,
      },
      {
        title: 'Bigg Boss Telugu Season 9 - Meet the Contestants',
        youtubeId: 'oHg5SJYRHA0',
        description: 'Get to know the contestants of this season.',
        duration: '5:45',
        week: 1,
      }
    ];

    for (const video of promoVideos) {
      await db.collection('promoVideos').add({
        ...video,
        thumbnailUrl: `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`,
        season: 9,
        isActive: true,
        publishedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`   ✅ ${video.title} created`);
    }

    // 7. Sample Contestants (with enhanced fields)
    console.log('\n👥 Creating sample contestants...');
    const contestants = [
      {
        name: 'Ravi Kumar',
        profession: 'Film Actor',
        age: 28,
        hometown: 'Hyderabad',
        description: 'Popular Telugu film actor known for his versatile roles.',
      },
      {
        name: 'Priya Sharma',
        profession: 'Playback Singer',
        age: 25,
        hometown: 'Visakhapatnam',
        description: 'Melodious voice that has won millions of hearts.',
      },
      {
        name: 'Arjun Reddy',
        profession: 'Classical Dancer',
        age: 30,
        hometown: 'Vijayawada',
        description: 'Award-winning Kuchipudi dancer and choreographer.',
      },
      {
        name: 'Lakshmi Devi',
        profession: 'TV Anchor',
        age: 27,
        hometown: 'Warangal',
        description: 'Popular television host and presenter.',
      },
      {
        name: 'Suresh Babu',
        profession: 'Stand-up Comedian',
        age: 32,
        hometown: 'Guntur',
        description: 'Comedy king who can make anyone laugh.',
      }
    ];

    for (const contestant of contestants) {
      await db.collection('contestants').add({
        ...contestant,
        imageUrl: `https://via.placeholder.com/300x300/4F46E5/FFFFFF?text=${encodeURIComponent(contestant.name)}`,
        status: 'active',
        season: 9,
      });
      console.log(`   ✅ ${contestant.name} added`);
    }

    // 8. Sample News Items (with enhanced fields)
    console.log('\n📰 Creating sample news items...');
    const newsItems = [
      {
        title: 'Bigg Boss Telugu Season 9 Premieres Today!',
        content: 'The most awaited reality show is back with its 9th season. Get ready for entertainment, drama, and surprises with new contestants and exciting challenges!',
        type: 'announcement',
        source: 'Official BB Telugu',
      },
      {
        title: 'Meet the 15 Contestants of Season 9',
        content: 'From actors to singers, dancers to comedians - this season brings together a diverse mix of talented individuals from different walks of life.',
        type: 'general',
        source: 'Entertainment News',
      },
      {
        title: 'Voting Lines Are Now Open!',
        content: 'Cast your vote for your favorite contestant. Voting is free and you can vote multiple times throughout the week.',
        type: 'voting',
        source: 'Official BB Telugu',
      }
    ];

    for (const news of newsItems) {
      await db.collection('news').add({
        ...news,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`   ✅ ${news.title} added`);
    }

    console.log('\n🎉 Firebase schema setup completed successfully!');
    console.log('\n📱 Your app is now ready with:');
    console.log('   ✅ App configuration');
    console.log('   ✅ Dynamic tab navigation');
    console.log('   ✅ Sample poll with voting');
    console.log('   ✅ YouTube promo videos');
    console.log('   ✅ Twitter feed integration');
    console.log('   ✅ RSS news feeds');
    console.log('   ✅ 5 sample contestants');
    console.log('   ✅ 3 sample news items');
    
    console.log('\n🛠️ Next steps:');
    console.log('   1. Test your mobile app - it should now work perfectly');
    console.log('   2. Use admin panel (cd admin-panel && npm run dev) to manage content');
    console.log('   3. Replace sample data with real content');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error setting up Firebase schema:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check Firebase project permissions');
    console.log('   2. Verify google-services.json is correct');
    console.log('   3. Ensure Firestore is enabled in Firebase Console');
    process.exit(1);
  }
}

// Check if firebase-admin is installed
try {
  require.resolve('firebase-admin');
} catch (e) {
  console.log('📦 Installing firebase-admin...');
  const { execSync } = require('child_process');
  execSync('npm install firebase-admin', { stdio: 'inherit' });
  console.log('✅ firebase-admin installed successfully\n');
}

// Run the setup
setupFirebaseSchema();
