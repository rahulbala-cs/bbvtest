import {
  BannerAd,
  BannerAdSize,
  TestIds,
  InterstitialAd,
  AdEventType,
} from 'react-native-google-mobile-ads';

// Ad unit IDs - replace with your actual AdMob IDs
const AD_UNIT_IDS = {
  banner: __DEV__ ? TestIds.BANNER : 'ca-app-pub-0266697578250731/6968635270',
  interstitial: __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-0266697578250731/7274653380',
  inlineBanner: __DEV__ ? TestIds.BANNER : 'ca-app-pub-0266697578250731/9541739987',
};

// Interstitial ad instance (v13+ uses createForAdRequest)
const interstitial = InterstitialAd.createForAdRequest(AD_UNIT_IDS.interstitial);

export const AdService = {
  BANNER_AD_UNIT_ID: AD_UNIT_IDS.banner,
  INLINE_BANNER_AD_UNIT_ID: AD_UNIT_IDS.inlineBanner,

  // Interstitial ads
  loadInterstitialAd() {
    return new Promise<void>((resolve, reject) => {
      const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
        unsubscribeLoaded();
        resolve();
      });

      const unsubscribeError = interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
        unsubscribeError();
        reject(error);
      });

      interstitial.load();
    });
  },

  async showInterstitialAd(): Promise<boolean> {
    try {
      if (!interstitial.loaded) {
        await this.loadInterstitialAd();
      }

      return new Promise((resolve) => {
        const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
          unsubscribeClosed();
          // Preload next ad
          this.loadInterstitialAd().catch(console.error);
          resolve(true);
        });

        const unsubscribeError = interstitial.addAdEventListener(AdEventType.ERROR, () => {
          unsubscribeError();
          resolve(false);
        });

        interstitial.show();
      });
    } catch (error) {
      console.error('Error showing interstitial ad:', error);
      return false;
    }
  },

  // Initialize ads
  initialize() {
    // Preload first interstitial ad
    this.loadInterstitialAd().catch(console.error);
  },
};