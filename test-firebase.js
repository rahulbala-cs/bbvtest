/**
 * Firebase Connection Test
 * 
 * This script tests if Firebase/Firestore is properly configured
 * Run: node test-firebase.js
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, collection, getDocs, limit, query } from 'firebase/firestore';

// Your Firebase config (from google-services.json)
const firebaseConfig = {
  // Add your config here if you want to test from Node.js
  // For now, this is just a template
};

async function testFirestore() {
  try {
    console.log('🔥 Testing Firebase connection...');
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    console.log('✅ Firebase initialized successfully');

    // Test 1: Try to read app config
    console.log('📱 Testing app config read...');
    const configRef = doc(db, 'config', 'app');
    const configSnap = await getDoc(configRef);
    
    if (configSnap.exists()) {
      console.log('✅ App config found:', configSnap.data());
    } else {
      console.log('⚠️ App config not found (this is OK - app will use defaults)');
    }

    // Test 2: Try to list collections
    console.log('📋 Testing collections access...');
    const collections = ['polls', 'tabConfigs', 'promoVideos', 'contestants', 'news'];
    
    for (const collectionName of collections) {
      try {
        const q = query(collection(db, collectionName), limit(1));
        const snapshot = await getDocs(q);
        console.log(`✅ ${collectionName}: ${snapshot.size} documents found`);
      } catch (error) {
        console.log(`⚠️ ${collectionName}: Error -`, error.message);
      }
    }

    console.log('🎉 Firebase test completed!');
    
  } catch (error) {
    console.error('❌ Firebase test failed:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check if google-services.json is properly configured');
    console.log('2. Verify Firestore rules allow read access');
    console.log('3. Ensure Firebase project is active');
  }
}

// Uncomment to run the test:
// testFirestore();
