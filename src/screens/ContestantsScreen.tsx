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
import ContestantCard from '../components/ContestantCard';
// import AdBanner from '../components/AdBanner';
import { Contestant } from '../types';
import { COLORS, TYPOGRAPHY, SPACING } from '../config/constants';

type FilterType = 'all' | 'active' | 'eliminated';

const ContestantsScreen: React.FC = () => {
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    // Subscribe to contestants changes
    const unsubscribe = FirestoreService.subscribeToContestants(9, (contestantsList) => {
      setContestants(contestantsList);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const contestantsList = await FirestoreService.getContestants();
      setContestants(contestantsList);
    } catch (error) {
      console.error('Error refreshing contestants:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const getFilteredContestants = () => {
    switch (filter) {
      case 'active':
        return contestants.filter(c => c.status === 'active');
      case 'eliminated':
        return contestants.filter(c => c.status === 'eliminated');
      default:
        return contestants.sort((a, b) => {
          // Show active contestants first
          if (a.status === 'active' && b.status === 'eliminated') return -1;
          if (a.status === 'eliminated' && b.status === 'active') return 1;
          return a.name.localeCompare(b.name);
        });
    }
  };

  const renderFilterButton = (filterType: FilterType, title: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filter === filterType && styles.activeFilterButton,
      ]}
      onPress={() => setFilter(filterType)}
    >
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
    <View>
      <View style={styles.filterContainer}>
        {renderFilterButton('all', 'All')}
        {renderFilterButton('active', 'Active')}
        {renderFilterButton('eliminated', 'Eliminated')}
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {contestants.filter(c => c.status === 'active').length}
          </Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {contestants.filter(c => c.status === 'eliminated').length}
          </Text>
          <Text style={styles.statLabel}>Eliminated</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {contestants.length}
          </Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>
    </View>
  );

  const renderContestant = ({ item, index }: { item: Contestant; index: number }) => (
    <ContestantCard
      contestant={item}
      onPress={(contestant) => {
        // TODO: Navigate to contestant details if needed
        console.log('Pressed contestant:', contestant.name);
      }}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>👥</Text>
      <Text style={styles.emptyTitle}>No Contestants Found</Text>
      <Text style={styles.emptyMessage}>
        {filter === 'all'
          ? 'No contestants available at the moment.'
          : `No ${filter} contestants found.`}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading contestants...</Text>
        {/* <AdBanner style={styles.adBanner} /> */}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={getFilteredContestants()}
        renderItem={renderContestant}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
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
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterButton: {
    flex: 1,
    paddingVertical: SPACING.xs,
    marginHorizontal: SPACING.xs / 2,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeFilterButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterButtonText: {
    ...TYPOGRAPHY.caption,
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  activeFilterButtonText: {
    color: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs / 2,
  },
  listContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: 80, // Space for ad banner
  },
  row: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xl * 2,
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
    lineHeight: 24,
  },
  adBanner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default ContestantsScreen;