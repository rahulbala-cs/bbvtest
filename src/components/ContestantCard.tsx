import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import FastImage from 'react-native-fast-image';
// import LinearGradient from 'react-native-linear-gradient';
import { Contestant } from '../types';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../config/constants';

interface ContestantCardProps {
  contestant: Contestant;
  onPress?: (contestant: Contestant) => void;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - SPACING.md * 3) / 2; // 2 columns with spacing

const ContestantCard: React.FC<ContestantCardProps> = ({
  contestant,
  onPress,
}) => {
  const isEliminated = contestant.status === 'eliminated';

  return (
    <TouchableOpacity
      style={[styles.card, isEliminated && styles.eliminatedCard]}
      onPress={() => onPress?.(contestant)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <FastImage
          source={{ 
            uri: contestant.imageUrl,
            priority: FastImage.priority.normal,
          }}
          style={[styles.image, isEliminated && styles.eliminatedImage]}
          resizeMode={FastImage.resizeMode.cover}
        />
        {/* Gradient Overlay - temporarily using solid overlay */}
        <View style={styles.gradientOverlay} />
        {/* Status Badge */}
        <View style={[styles.statusBadge, isEliminated ? styles.eliminatedBadge : styles.activeBadge]}>
          <Text style={styles.statusText}>
            {isEliminated ? '❌ OUT' : '✅ IN'}
          </Text>
        </View>
        {/* Name Overlay */}
        <View style={styles.nameOverlay}>
          <Text style={styles.overlayName} numberOfLines={1}>
            {contestant.name}
          </Text>
        </View>
      </View>
      
      <View style={styles.content}>
        {contestant.description && (
          <Text
            style={[styles.description, isEliminated && styles.eliminatedDescription]}
            numberOfLines={2}
          >
            {contestant.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  eliminatedCard: {
    opacity: 0.8,
  },
  imageContainer: {
    position: 'relative',
    height: 180,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  eliminatedImage: {
    opacity: 0.5,
    filter: 'grayscale(1)',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  statusBadge: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  activeBadge: {
    backgroundColor: 'rgba(0, 208, 132, 0.9)',
  },
  eliminatedBadge: {
    backgroundColor: 'rgba(255, 59, 48, 0.9)',
  },
  statusText: {
    ...TYPOGRAPHY.labelSmall,
    fontWeight: '700',
    color: COLORS.textInverse,
  },
  nameOverlay: {
    position: 'absolute',
    bottom: SPACING.sm,
    left: SPACING.sm,
    right: SPACING.sm,
  },
  overlayName: {
    ...TYPOGRAPHY.titleMedium,
    fontWeight: '700',
    color: COLORS.textInverse,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  content: {
    padding: SPACING.sm,
    minHeight: 40,
  },
  description: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  eliminatedDescription: {
    opacity: 0.7,
  },
});

export default ContestantCard;