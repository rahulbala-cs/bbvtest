import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import { StatusBar, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import mobileAds from 'react-native-google-mobile-ads';
import Icon from 'react-native-vector-icons/Ionicons';

import DrawerNavigator from './src/navigation/DrawerNavigator';
import { navigationRef } from './src/navigation/navigationRef';
// import { AdService } from './src/services/ads';
import { NotificationService } from './src/services/notifications';
import { ReviewService } from './src/services/review';
import { COLORS } from './src/config/constants';

export default function App() {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize Google Mobile Ads
        await mobileAds().initialize();
        
        // Initialize ad service - temporarily disabled
        // AdService.initialize();

        // Request notification permissions (force re-prompt helper in dev)
        await NotificationService.requestPermissions();
        
        // Get push token and store it
        const pushToken = await NotificationService.getFCMToken();
        console.log('Push token:', pushToken);

        // Set up notification listeners
        NotificationService.addNotificationListener((notification) => {
          console.log('Notification received:', notification);
        });

        NotificationService.addNotificationResponseListener((response) => {
          console.log('Notification response:', response);
        });

      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };

    initializeApp();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
        {__DEV__ && (
          <View style={{
            height: 80,
            backgroundColor: '#FF0000', // BRIGHT RED
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 5,
            borderColor: '#FFFF00', // YELLOW BORDER
          }}>
            <Text style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: '#FFFFFF',
              textAlign: 'center',
            }}>
              *** TEST HEADER - IF YOU SEE THIS, CODE IS WORKING ***
            </Text>
          </View>
        )}

        <NavigationContainer ref={navigationRef}>
          <DrawerNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  globalHeader: {
    height: 56,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.outline,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    zIndex: 1000,
  },
  globalHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  globalHamburger: {
    padding: 8,
    borderRadius: 8,
  },
});
