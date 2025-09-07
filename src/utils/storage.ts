import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageService = {
  // Keys
  KEYS: {
    LAST_AD_SHOWN: 'lastAdShown',
    USER_PREFERENCES: 'userPreferences',
    PUSH_TOKEN: 'pushToken',
    LAST_VOTE_TIME: 'lastVoteTime',
  },

  // Generic storage methods
  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Error setting item in storage:', error);
    }
  },

  async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('Error getting item from storage:', error);
      return null;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing item from storage:', error);
    }
  },

  // Specific methods
  async setLastAdShown(timestamp: number): Promise<void> {
    await this.setItem(this.KEYS.LAST_AD_SHOWN, timestamp.toString());
  },

  async getLastAdShown(): Promise<number> {
    const timestamp = await this.getItem(this.KEYS.LAST_AD_SHOWN);
    return timestamp ? parseInt(timestamp, 10) : 0;
  },

  async shouldShowAd(frequencyCapMinutes: number = 60): Promise<boolean> {
    const lastAdShown = await this.getLastAdShown();
    const now = Date.now();
    const timeDifference = now - lastAdShown;
    const frequencyCapMs = frequencyCapMinutes * 60 * 1000;
    
    return timeDifference >= frequencyCapMs;
  },

  async setLastVoteTime(timestamp: number): Promise<void> {
    await this.setItem(this.KEYS.LAST_VOTE_TIME, timestamp.toString());
  },

  async getLastVoteTime(): Promise<number> {
    const timestamp = await this.getItem(this.KEYS.LAST_VOTE_TIME);
    return timestamp ? parseInt(timestamp, 10) : 0;
  },

  async setPushToken(token: string): Promise<void> {
    await this.setItem(this.KEYS.PUSH_TOKEN, token);
  },

  async getPushToken(): Promise<string | null> {
    return await this.getItem(this.KEYS.PUSH_TOKEN);
  },
};