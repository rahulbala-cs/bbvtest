import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import { Platform, PermissionsAndroid } from 'react-native';
import { StorageService } from '../utils/storage';

export const NotificationService = {
  async requestPermissions(): Promise<boolean> {
    try {
      // Android < 13: no runtime permission required
      if (Platform.OS === 'android') {
        const apiLevel = Number(Platform.Version) || 0
        if (apiLevel >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          )
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            return false
          }
        }
        // On Android, FCM does not require requestPermission; treat as enabled
        return true
      }

      // iOS: request permission
      const authStatus = await messaging().requestPermission()
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL

      return enabled
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  },

  // Helper for QA to clear current token/permission state
  async resetPermissionsForTesting(): Promise<void> {
    try {
      await messaging().deleteToken();
      await StorageService.removeItem(StorageService.KEYS.PUSH_TOKEN);
    } catch (_) {}
  },

  async getFCMToken(): Promise<string | null> {
    try {
      const hasPermissions = await this.requestPermissions();
      if (!hasPermissions) {
        return null;
      }

      const token = await messaging().getToken();
      if (token) {
        await StorageService.setPushToken(token);
        // Persist token in Firestore for admin broadcasting
        try {
          await firestore().collection('deviceTokens').doc(token).set({
            token,
            platform: Platform.OS,
            updatedAt: firestore.FieldValue.serverTimestamp(),
          }, { merge: true });
        } catch (err) {
          console.error('Error saving device token:', err);
        }
        // Subscribe to a global topic so admin can broadcast easily
        try { await messaging().subscribeToTopic('all-users'); } catch (_) {}
      }
      // Handle token refresh
      messaging().onTokenRefresh(async (newToken) => {
        await StorageService.setPushToken(newToken);
        try {
          await firestore().collection('deviceTokens').doc(newToken).set({
            token: newToken,
            platform: Platform.OS,
            updatedAt: firestore.FieldValue.serverTimestamp(),
          }, { merge: true });
        } catch (err) {
          console.error('Error updating device token:', err);
        }
        try { await messaging().subscribeToTopic('all-users'); } catch (_) {}
      });

      return token;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  },

  async scheduleLocalNotification(title: string, body: string, data?: any) {
    // For local notifications, you might want to use a different library
    // or implement your own local notification system
    console.log('Local notification:', { title, body, data });
  },

  addNotificationListener(handler: (message: FirebaseMessagingTypes.RemoteMessage) => void) {
    // Listen to messages when app is in foreground
    return messaging().onMessage(handler);
  },

  addNotificationResponseListener(
    handler: (message: FirebaseMessagingTypes.RemoteMessage) => void
  ) {
    // Listen to messages when app is opened from background/killed state
    messaging().onNotificationOpenedApp(handler);
    
    // Check if app was opened from a notification when app was killed
    messaging()
      .getInitialNotification()
      .then(handler);

    return () => {}; // Return empty cleanup function
  },

  async setupBackgroundHandler() {
    // Handle background messages
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });
  },
};