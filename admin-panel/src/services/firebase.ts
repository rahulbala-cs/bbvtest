import { initializeApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getMessaging } from 'firebase/messaging'

const firebaseConfig = {
  // TODO: Replace with your Firebase config
  apiKey: "AIzaSyBJ6EVpyY9gG1i8zVxS_WVpOd_6yQ8H25s",
  authDomain: "bigg-boss-telugu-vote.firebaseapp.com",
  projectId: "bigg-boss-telugu-vote",
  storageBucket: "bigg-boss-telugu-vote.firebasestorage.app",
  messagingSenderId: "721871577189",
  appId: "1:721871577189:web:9c019811622ccd86d6a68c"
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const messaging = getMessaging(app)

// Uncomment for local development
// if (process.env.NODE_ENV === 'development') {
//   connectFirestoreEmulator(db, 'localhost', 8080)
// }

export default app