// React Native Firebase is automatically initialized with google-services.json
// No need to initialize Firebase manually in React Native CLI projects

// Firebase services are accessed directly from their respective modules
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import app from '@react-native-firebase/app';

export const db = firestore();
export { messaging, app };

export default app;