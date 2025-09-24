import { AdsConsent } from 'react-native-google-mobile-ads'

export const ConsentService = {
  async ensureConsent(): Promise<boolean> {
    try {
      const info = await AdsConsent.requestInfoUpdate()
      if (info.isConsentFormAvailable) {
        try {
          await AdsConsent.showForm()
        } catch (_) {
          // if showing form fails, don't block ads
        }
        // After showing the form, assume we can proceed requesting ads
        return true
      }
      return info.canRequestAds ?? true
    } catch (e) {
      // If consent flow fails, do not block ads initialization
      return true
    }
  },
  // Backwards-compatible alias used by App.tsx
  async requestConsent(): Promise<boolean> {
    return this.ensureConsent()
  },
}


