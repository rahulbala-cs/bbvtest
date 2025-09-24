/**
 * @format
 */

import 'react-native-reanimated';
import 'react-native-gesture-handler';
import '@react-native-firebase/app';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';

// Register background handler BEFORE app mounts
messaging().setBackgroundMessageHandler(async remoteMessage => {
  // Minimal background handler to ensure messages are delivered when app is killed
  // Add custom logging or analytics here if needed
});

AppRegistry.registerComponent(appName, () => App);