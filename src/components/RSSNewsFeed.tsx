import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Image,
} from 'react-native';
import { NewsItem } from '../types';
import { FirestoreService } from '../services/firestore';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../config/constants';

interface RSSNewsFeedProps { rssUrl?: string }
const RSSNewsFeed: React.FC<RSSNewsFeedProps> = ({ rssUrl }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (rssUrl) {
      loadRss(rssUrl);
    } else {
      loadNews();
    }
  }, [rssUrl]);

  const loadNews = async () => {
    try {
      const newsData = await FirestoreService.getNews();
      setNews(newsData);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRss = async (url: string) => {
    try {
      const response = await fetch(url)
      const xml = await response.text()

      const stripCdata = (s: string) => s.replace(/<!\[CDATA\[|\]\]>/g, '')
      const decode = (s: string) =>
        stripCdata(s)
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&nbsp;/g, ' ')
          .replace(/<[^>]*>/g, '') // strip any remaining tags like <a href>

      const extract = (source: string, tag: string) => {
        const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i')
        const match = source.match(regex)
        return match ? decode(match[1].trim()) : ''
      }

      const itemsRaw = xml.split('<item>').slice(1).map(seg => '<item>' + seg)
      const host = (url.match(/^https?:\/\/([^/]+)/)?.[1]) || 'news'
      const mapped: NewsItem[] = itemsRaw.slice(0, 20).map((chunk, idx) => {
        const title = extract(chunk, 'title') || 'Update'
        const descriptionRaw = extract(chunk, 'description')
        // Try to pull an image URL from multiple possible locations
        let imageUrl: string | undefined
        const mediaMatch = chunk.match(/<media:content[^>]+url=["']([^"']+)["']/i)
        const enclosureMatch = chunk.match(/<enclosure[^>]+url=["']([^"']+)["'][^>]*type=["']image\//i)
        const imgMatch = descriptionRaw.match(/<img[^>]+src=["']([^"']+)["']/i)
        if (mediaMatch) imageUrl = mediaMatch[1]
        else if (enclosureMatch) imageUrl = enclosureMatch[1]
        else if (imgMatch) imageUrl = imgMatch[1]
        const description = decode(descriptionRaw)
        const link = extract(chunk, 'link')
        const pub = extract(chunk, 'pubDate')
        return {
          id: String(idx),
          title,
          content: description,
          timestamp: pub ? new Date(pub) : new Date(),
          type: 'general',
          imageUrl,
          source: host,
          url: link || undefined,
        }
      })

      const sorted = mapped.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      setNews(sorted)
    } catch (error) {
      console.error('Error loading RSS:', error)
      setNews([])
    } finally {
      setLoading(false)
    }
  }


  const handleNewsItemPress = async (item: NewsItem) => {
    if (item.url) {
      try {
        const canOpen = await Linking.canOpenURL(item.url);
        if (canOpen) {
          await Linking.openURL(item.url);
        }
      } catch (error) {
        console.error('Error opening news URL:', error);
      }
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const getTypeColor = (type: NewsItem['type']) => {
    switch (type) {
      case 'elimination':
        return COLORS.error;
      case 'voting':
        return COLORS.primary;
      case 'announcement':
        return COLORS.info;
      default:
        return COLORS.accent;
    }
  };

  const renderNewsItem = ({ item }: { item: NewsItem }) => (
    <TouchableOpacity
      style={styles.newsItem}
      onPress={() => handleNewsItemPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.newsHeader}>
        <View style={[styles.typeBadge, { backgroundColor: getTypeColor(item.type) }]}>
          <Text style={styles.typeText}>
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </Text>
        </View>
        <Text style={styles.timestamp}>
          {formatDate(item.timestamp)}
        </Text>
      </View>
      
      <Text style={styles.newsTitle} numberOfLines={2}>
        {item.title}
      </Text>
      
      <Text style={styles.newsContent} numberOfLines={3}>
        {item.content}
      </Text>
      
      {item.source && (
        <View style={styles.sourceContainer}>
          <Text style={styles.sourceText}>
            Source: {item.source}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading latest news...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Latest News & Updates</Text>
      </View>
      
      <View style={styles.listContent}>
        {news.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📰</Text>
            <Text style={styles.emptyTitle}>No News Available</Text>
            <Text style={styles.emptyMessage}>
              Check back later for the latest updates!
            </Text>
          </View>
        ) : (
          news.map((item) => (
            <View key={item.id}>
              {renderNewsItem({ item })}
            </View>
          ))
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.md,
    maxHeight: 400, // Limit height to prevent excessive scrolling
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    alignItems: 'center',
  },
  headerTitle: {
    ...TYPOGRAPHY.titleMedium,
    color: COLORS.textInverse,
  },
  listContent: {
    padding: SPACING.sm,
  },
  newsItem: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  typeBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  typeText: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.textInverse,
    fontWeight: '600',
  },
  timestamp: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.textTertiary,
  },
  newsTitle: {
    ...TYPOGRAPHY.titleMedium,
    color: COLORS.text,
    marginBottom: SPACING.xs,
    lineHeight: 20,
  },
  newsContent: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.xs,
  },
  sourceContainer: {
    marginTop: SPACING.xs,
    paddingTop: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  sourceText: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.textTertiary,
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  loadingText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    ...TYPOGRAPHY.headlineSmall,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  emptyMessage: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default RSSNewsFeed;
