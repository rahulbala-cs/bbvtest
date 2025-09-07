export interface Contestant {
  id: string;
  name: string;
  imageUrl: string;
  status: 'active' | 'eliminated';
  season: number;
  description?: string;
  age?: number;
  profession?: string;
  hometown?: string;
}

export interface Poll {
  id: string;
  title: string;
  embedUrl: string;
  pollId?: string; // For JavaScript embed format (e.g., "10967724")
  isActive: boolean;
  week: number;
  season: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
  type: 'elimination' | 'general' | 'voting' | 'announcement';
  imageUrl?: string;
  source?: string;
  url?: string;
}

export interface PromoVideo {
  id: string;
  title: string;
  youtubeId: string;
  thumbnailUrl?: string;
  description?: string;
  duration?: string;
  publishedAt: Date;
  isActive: boolean;
  season: number;
  week?: number;
}

export interface TwitterFeed {
  id: string;
  hashtag: string;
  isActive: boolean;
  season: number;
  displayCount: number;
}

export interface RSSFeed {
  id: string;
  name: string;
  url: string;
  isActive: boolean;
  refreshInterval: number; // in minutes
  lastFetched?: Date;
}

export interface TabConfig {
  id: string;
  key: 'vote' | 'promos' | 'updates' | 'contestants';
  label: string;
  isEnabled: boolean;
  order: number;
  season: number;
}

export interface AppConfig {
  id: string;
  currentSeason: number;
  adMobBannerId: string;
  adMobInterstitialId: string;
  adMobInlineBannerId?: string;
  adFrequencyCapMinutes: number;
  adsEnabled?: boolean;
  inlineAdEnabled?: boolean;
  appName: string;
  appVersion: string;
  maintenanceMode: boolean;
  maintenanceMessage?: string;
}