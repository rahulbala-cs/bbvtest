import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { FirestoreService } from '../services/firestore';
import NewsCard from '../components/NewsCard';
// import AdBanner from '../components/AdBanner';
import { NewsItem } from '../types';
import { COLORS, TYPOGRAPHY, SPACING } from '../config/constants';

type FilterType = 'all' | 'elimination' | 'voting' | 'announcement' | 'general';

const NewsScreen: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    // Subscribe to news changes
    const unsubscribe = FirestoreService.subscribeToNews((newsList) => {
      setNews(newsList);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const newsList = await FirestoreService.getNews();
      setNews(newsList);
    } catch (error) {
      console.error('Error refreshing news:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const getFilteredNews = () => {
    if (filter === 'all') {
      return news;
    }
    return news.filter(item => item.type === filter);
  };

  const renderFilterButton = (filterType: FilterType, title: string, icon: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filter === filterType && styles.activeFilterButton,
      ]}
      onPress={() => setFilter(filterType)}
    >
      <Text style={styles.filterIcon}>{icon}</Text>
      <Text
        style={[
          styles.filterButtonText,
          filter === filterType && styles.activeFilterButtonText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.filterContainer}>
      {renderFilterButton('all', 'All', '📰')}
      {renderFilterButton('elimination', 'Eliminations', '❌')}
      {renderFilterButton('voting', 'Voting', '🗳️')}
      {renderFilterButton('announcement', 'Announcements', '📢')}
    </View>
  );

  const renderNewsItem = ({ item }: { item: NewsItem }) => (
    <NewsCard
      newsItem={item}
      onPress={(newsItem) => {
        // TODO: Navigate to news details if needed
        console.log('Pressed news item:', newsItem.title);
      }}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📰</Text>
      <Text style={styles.emptyTitle}>No News Found</Text>
      <Text style={styles.emptyMessage}>
        {filter === 'all'
          ? 'No news updates available at the moment.'
          : `No ${filter} news found.`}
      </Text>
      <Text style={styles.emptySubtext}>
        Pull down to refresh and check for new updates!
      </Text>
    </View>
  );

  const renderSeparator = () => <View style={styles.separator} />;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading news updates...</Text>
        {/* <AdBanner style={styles.adBanner} /> */}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={getFilteredNews()}
        renderItem={renderNewsItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ItemSeparatorComponent={renderSeparator}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />
      
      {/* Fixed bottom ad banner */}
      {/* <AdBanner style={styles.adBanner} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    justifyContent: 'space-between',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    marginVertical: SPACING.xs / 2,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: '22%',
    justifyContent: 'center',
  },
  activeFilterButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterIcon: {
    fontSize: 14,
    marginRight: SPACING.xs / 2,
  },
  filterButtonText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  activeFilterButtonText: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingBottom: 80, // Space for ad banner
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xl * 2,
    paddingHorizontal: SPACING.lg,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  emptyMessage: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    lineHeight: 24,
  },
  emptySubtext: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  adBanner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default NewsScreen;