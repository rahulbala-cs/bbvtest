import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
// import LinearGradient from 'react-native-linear-gradient';
import { NewsItem } from '../types';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../config/constants';

interface NewsCardProps {
  newsItem: NewsItem;
  onPress?: (newsItem: NewsItem) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ newsItem, onPress }) => {
  const getTypeIcon = () => {
    switch (newsItem.type) {
      case 'elimination':
        return '❌';
      case 'voting':
        return '🗳️';
      case 'announcement':
        return '📢';
      default:
        return '📰';
    }
  };

  const getTypeColor = () => {
    switch (newsItem.type) {
      case 'elimination':
        return COLORS.error;
      case 'voting':
        return COLORS.primary;
      case 'announcement':
        return COLORS.accent;
      default:
        return COLORS.secondary;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else if (days < 7) {
      return `${days}d ago`;
    } else {
      return timestamp.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(newsItem)}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        {newsItem.imageUrl && (
          <View style={styles.imageContainer}>
            <FastImage
              source={{ uri: newsItem.imageUrl }}
              style={styles.image}
              resizeMode={FastImage.resizeMode.cover}
            />
            <View style={styles.imageGradient} />
          </View>
        )}
        
        <View style={[styles.textContent, newsItem.imageUrl && styles.textContentWithImage]}>
          <View style={styles.header}>
            <View
              style={[styles.typeBadge, { backgroundColor: getTypeColor() }]}
            >
              <Text style={styles.typeIcon}>{getTypeIcon()}</Text>
              <Text style={styles.typeText}>
                {newsItem.type.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.timestamp}>
              {formatTimestamp(newsItem.timestamp)}
            </Text>
          </View>
          
          <Text style={styles.title} numberOfLines={2}>
            {newsItem.title}
          </Text>
          
          <Text style={styles.content} numberOfLines={3}>
            {newsItem.content}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  cardContent: {
    flexDirection: 'row',
  },
  imageContainer: {
    position: 'relative',
    width: 120,
    height: 120,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  textContent: {
    flex: 1,
    padding: SPACING.md,
    justifyContent: 'space-between',
  },
  textContentWithImage: {
    paddingLeft: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  typeIcon: {
    fontSize: 12,
    marginRight: SPACING.xs / 2,
  },
  typeText: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.textInverse,
    fontWeight: '700',
  },
  timestamp: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.textTertiary,
  },
  title: {
    ...TYPOGRAPHY.titleMedium,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
    lineHeight: 22,
  },
  content: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});

export default NewsCard;