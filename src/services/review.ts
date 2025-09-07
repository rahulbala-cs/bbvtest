import { Platform, Linking } from 'react-native'
import { StorageService } from '../utils/storage'

// Simple in-app review strategy without extra deps
// Play Store app URL
const PLAY_STORE_URL = 'market://details?id=com.biggboss.teluguvote'
const PLAY_STORE_WEB_URL = 'https://play.google.com/store/apps/details?id=com.biggboss.teluguvote'

export const ReviewService = {
  // Keys in storage
  KEY_LAST_PROMPT: 'review:last_prompt_time',
  KEY_COMPLETED: 'review:completed',
  KEY_INTERACTION_COUNT: 'review:interaction_count',

  async incrementInteraction() {
    const current = parseInt((await StorageService.getItem(this.KEY_INTERACTION_COUNT)) || '0', 10)
    await StorageService.setItem(this.KEY_INTERACTION_COUNT, String(current + 1))
  },

  async shouldPrompt(): Promise<boolean> {
    const completed = await StorageService.getItem(this.KEY_COMPLETED)
    if (completed === 'true') return false

    const lastPromptRaw = await StorageService.getItem(this.KEY_LAST_PROMPT)
    const lastPrompt = lastPromptRaw ? parseInt(lastPromptRaw, 10) : 0
    const now = Date.now()

    // Cooldown: 14 days between prompts
    const COOLDOWN_MS = 14 * 24 * 60 * 60 * 1000
    if (now - lastPrompt < COOLDOWN_MS) return false

    // Require at least 5 meaningful interactions
    const interactions = parseInt((await StorageService.getItem(this.KEY_INTERACTION_COUNT)) || '0', 10)
    return interactions >= 5
  },

  async openStorePage() {
    try {
      const url = Platform.OS === 'android' ? PLAY_STORE_URL : PLAY_STORE_WEB_URL
      const canOpen = await Linking.canOpenURL(url)
      await Linking.openURL(canOpen ? url : PLAY_STORE_WEB_URL)
      await StorageService.setItem(this.KEY_COMPLETED, 'true')
    } catch (err) {
      // ignore
    }
  },

  async recordPromptShown() {
    await StorageService.setItem(this.KEY_LAST_PROMPT, String(Date.now()))
  },
}


