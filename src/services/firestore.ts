import firestore from '@react-native-firebase/firestore';
import { Contestant, Poll, NewsItem, PromoVideo, TwitterFeed, RSSFeed, TabConfig, AppConfig } from '../types';

const db = firestore();

export const FirestoreService = {
  // Polls
  async getActivePoll(): Promise<Poll | null> {
    try {
      const snapshot = await db.collection('polls')
        .where('isActive', '==', true)
        .limit(1)
        .get();
      
      if (snapshot.empty) return null;
      
      const doc = snapshot.docs[0];
      const data = doc.data();
      
      return {
        id: doc.id,
        title: data.title,
        embedUrl: data.embedUrl,
        isActive: data.isActive,
        week: data.week,
        season: data.season,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      };
    } catch (error) {
      console.error('Error fetching active poll:', error);
      return null;
    }
  },

  subscribeToActivePoll(callback: (poll: Poll | null) => void) {
    return db.collection('polls')
      .where('isActive', '==', true)
      .limit(1)
      .onSnapshot((snapshot) => {
        if (!snapshot || snapshot.empty) {
          callback(null);
          return;
        }
        
        const doc = snapshot.docs[0];
        const data = doc.data();
        
        const poll: Poll = {
          id: doc.id,
          title: data.title,
          embedUrl: data.embedUrl,
          pollId: data.pollId,
          isActive: data.isActive,
          week: data.week,
          season: data.season,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        };
        
        callback(poll);
      }, (error) => {
        console.error('Error in active poll subscription:', error);
        callback(null);
      });
  },

  // Contestants
  async getContestants(): Promise<Contestant[]> {
    try {
      const snapshot = await db.collection('contestants')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        imageUrl: doc.data().imageUrl,
        status: doc.data().status,
        season: doc.data().season,
        description: doc.data().description,
      })).sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } catch (error) {
      console.error('Error fetching contestants:', error);
      return [];
    }
  },

  subscribeToContestants(season: number, callback: (contestants: Contestant[]) => void) {
    return db.collection('contestants')
      .onSnapshot((snapshot) => {
        if (!snapshot || snapshot.empty) {
          callback([]);
          return;
        }
        
        const contestants = snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          imageUrl: doc.data().imageUrl,
          status: doc.data().status,
          season: doc.data().season,
          description: doc.data().description,
          age: doc.data().age,
          profession: doc.data().profession,
          hometown: doc.data().hometown,
        }))
        .filter(c => Number(c.season) === Number(season))
        .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        
        callback(contestants);
      }, (error) => {
        console.error('Error in contestants subscription:', error);
        callback([]);
      });
  },

  // News
  async getNews(): Promise<NewsItem[]> {
    try {
      const snapshot = await db.collection('news')
        .orderBy('timestamp', 'desc')
        .limit(50)
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
        content: doc.data().content,
        timestamp: doc.data().timestamp.toDate(),
        type: doc.data().type,
        imageUrl: doc.data().imageUrl,
      }));
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
    }
  },

  subscribeToNews(callback: (news: NewsItem[]) => void) {
    return db.collection('news')
      .orderBy('timestamp', 'desc')
      .limit(50)
      .onSnapshot((snapshot) => {
        if (!snapshot || snapshot.empty) {
          callback([]);
          return;
        }
        
        const news = snapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title,
          content: doc.data().content,
          timestamp: doc.data().timestamp.toDate(),
          type: doc.data().type,
          imageUrl: doc.data().imageUrl,
          source: doc.data().source,
          url: doc.data().url,
        }));
        
        callback(news);
      }, (error) => {
        console.error('Error in news subscription:', error);
        callback([]);
      });
  },

  // App Configuration
  async getAppConfig(): Promise<AppConfig | null> {
    try {
      const doc = await db.collection('config').doc('app').get();
      if (!doc.exists) return null;
      
      const data = doc.data()!;
      return {
        id: doc.id,
        currentSeason: data.currentSeason,
        adMobBannerId: data.adMobBannerId,
        adMobInterstitialId: data.adMobInterstitialId,
        adFrequencyCapMinutes: data.adFrequencyCapMinutes,
        appName: data.appName,
        appVersion: data.appVersion,
        maintenanceMode: data.maintenanceMode,
        maintenanceMessage: data.maintenanceMessage,
      };
    } catch (error) {
      console.error('Error fetching app config:', error);
      return null;
    }
  },

  // Tab Configuration
  async getTabConfigs(season: number): Promise<TabConfig[]> {
    try {
      const snapshot = await db.collection('tabConfigs')
        .where('season', '==', season)
        .where('isEnabled', '==', true)
        .orderBy('order')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        key: doc.data().key,
        label: doc.data().label,
        isEnabled: doc.data().isEnabled,
        order: doc.data().order,
        season: doc.data().season,
      }));
    } catch (error) {
      console.error('Error fetching tab configs:', error);
      return [];
    }
  },

  subscribeToTabConfigs(season: number, callback: (tabs: TabConfig[]) => void) {
    return db.collection('tabConfigs')
      .where('season', '==', season)
      .where('isEnabled', '==', true)
      .orderBy('order')
      .onSnapshot((snapshot) => {
        if (!snapshot || snapshot.empty) {
          callback([]);
          return;
        }
        
        const tabs = snapshot.docs.map(doc => ({
          id: doc.id,
          key: doc.data().key,
          label: doc.data().label,
          isEnabled: doc.data().isEnabled,
          order: doc.data().order,
          season: doc.data().season,
        }));
        
        callback(tabs);
      }, (error) => {
        console.error('Error in tab configs subscription:', error);
        callback([]);
      });
  },

  // Promo Videos
  async getPromoVideos(season: number): Promise<PromoVideo[]> {
    try {
      const snapshot = await db.collection('promoVideos')
        .where('season', '==', season)
        .where('isActive', '==', true)
        .orderBy('publishedAt', 'desc')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
        youtubeId: doc.data().youtubeId,
        thumbnailUrl: doc.data().thumbnailUrl,
        description: doc.data().description,
        duration: doc.data().duration,
        publishedAt: doc.data().publishedAt.toDate(),
        isActive: doc.data().isActive,
        season: doc.data().season,
        week: doc.data().week,
      }));
    } catch (error) {
      console.error('Error fetching promo videos:', error);
      return [];
    }
  },

  subscribeToPromoVideos(season: number, callback: (videos: PromoVideo[]) => void) {
    return db.collection('promoVideos')
      .where('season', '==', season)
      .where('isActive', '==', true)
      .orderBy('publishedAt', 'desc')
      .onSnapshot((snapshot) => {
        if (!snapshot || snapshot.empty) {
          callback([]);
          return;
        }
        
        const videos = snapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title,
          youtubeId: doc.data().youtubeId,
          thumbnailUrl: doc.data().thumbnailUrl,
          description: doc.data().description,
          duration: doc.data().duration,
          publishedAt: doc.data().publishedAt.toDate(),
          isActive: doc.data().isActive,
          season: doc.data().season,
          week: doc.data().week,
        }));
        
        callback(videos);
      }, (error) => {
        console.error('Error in promo videos subscription:', error);
        callback([]);
      });
  },

  // Twitter Feed Config
  async getTwitterFeed(season: number): Promise<TwitterFeed | null> {
    try {
      const snapshot = await db.collection('twitterFeeds')
        .where('season', '==', season)
        .where('isActive', '==', true)
        .limit(1)
        .get();
      
      if (snapshot.empty) return null;
      
      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        hashtag: doc.data().hashtag,
        isActive: doc.data().isActive,
        season: doc.data().season,
        displayCount: doc.data().displayCount,
      };
    } catch (error) {
      console.error('Error fetching twitter feed:', error);
      return null;
    }
  },

  // RSS Feeds
  async getRSSFeeds(): Promise<RSSFeed[]> {
    try {
      const snapshot = await db.collection('rssFeeds')
        .where('isActive', '==', true)
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        url: doc.data().url,
        isActive: doc.data().isActive,
        refreshInterval: doc.data().refreshInterval,
        lastFetched: doc.data().lastFetched?.toDate(),
      }));
    } catch (error) {
      console.error('Error fetching RSS feeds:', error);
      return [];
    }
  },
};