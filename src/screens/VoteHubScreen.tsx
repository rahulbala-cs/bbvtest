import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { openDrawerSafely } from '../navigation/navigationRef';
import { FirestoreService } from '../services/firestore';
import { AdService } from '../services/ads';
import VotingPoll from '../components/ui/VotingPoll';
import YouTubeEmbed from '../components/YouTubeEmbed';
import TwitterFeedEmbed from '../components/TwitterFeedEmbed';
import RSSNewsFeed from '../components/RSSNewsFeed';
import ContestantCard from '../components/ContestantCard';
import Card from '../components/ui/Card';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { Poll, AppConfig, PromoVideo, TwitterFeed, Contestant } from '../types';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../config/constants';
import { ReviewService } from '../services/review';
import Icon from 'react-native-vector-icons/Ionicons';

// Static banner image - no Firebase dependency
const BANNER_IMAGE = require('../../assets/images/backgrounds/home-main.jpg');

// Static tabs - no Firebase dependency
const STATIC_TABS = [
  { key: 'vote', label: 'Vote' },
  { key: 'promos', label: 'Promos' },
  { key: 'updates', label: 'Latest Updates' },
  { key: 'contestants', label: 'Contestants' },
];

const VoteHubScreen: React.FC = () => {
  const navigation = useNavigation<any>()
  const [poll, setPoll] = useState<Poll | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Dynamic content state (only loaded when needed)
  const [appConfig, setAppConfig] = useState<AppConfig | null>(null);
  const [promoVideos, setPromoVideos] = useState<PromoVideo[]>([]);
  const [twitterFeed, setTwitterFeed] = useState<TwitterFeed | null>(null);
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [activeTab, setActiveTab] = useState<string>('vote');
  const [updatesTab, setUpdatesTab] = useState<'tweets' | 'news'>('tweets');
  const [parentScrollEnabled, setParentScrollEnabled] = useState<boolean>(true);
  const parentScrollRef = useRef<any>(null);
  const interactionTimeoutRef = useRef<any>(null);
  const [showReviewCTA, setShowReviewCTA] = useState<boolean>(false);
  
  // Cache refs to avoid unnecessary Firebase calls
  const pollCache = useRef<Poll | null>(null);
  const configCache = useRef<AppConfig | null>(null);
  const lastFetchTime = useRef<number>(0);
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

  useEffect(() => {
    AdService.initialize();
    // Bump interaction count on screen visit
    ReviewService.incrementInteraction().catch(() => {})
    
    // Efficient caching mechanism
    const loadPollData = async () => {
      try {
        const now = Date.now();
        const shouldRefresh = now - lastFetchTime.current > CACHE_DURATION;
        
        // Use cached config if available and fresh
        if (configCache.current && !shouldRefresh) {
          setAppConfig(configCache.current);
        } else {
          // Load minimal app config
          const config = await FirestoreService.getAppConfig();
          if (config) {
            configCache.current = config;
            setAppConfig(config);
          } else {
            // Use default config
            const defaultConfig: AppConfig = {
              id: 'default',
              currentSeason: 9,
              adMobBannerId: '',
              adMobInterstitialId: '',
              adFrequencyCapMinutes: 60,
              appName: 'Bigg Boss Telugu Vote',
              appVersion: '1.0.0',
              maintenanceMode: false,
            };
            configCache.current = defaultConfig;
            setAppConfig(defaultConfig);
          }
          lastFetchTime.current = now;
        }

        // Subscribe to active poll with caching
        const pollUnsubscribe = FirestoreService.subscribeToActivePoll((activePoll) => {
          // Only update if poll actually changed
          if (JSON.stringify(activePoll) !== JSON.stringify(pollCache.current)) {
            pollCache.current = activePoll;
            setPoll(activePoll);
            if (!activePoll) {
              setError('No active poll available at the moment. Please check back later.');
            } else {
              setError(null);
            }
          }
        });

        return () => {
          pollUnsubscribe();
        };
      } catch (err) {
        console.error('Error loading poll data:', err);
        setError('Failed to load poll data. Please try again.');
      }
    };

    const cleanupPromise = loadPollData();
    // Synchronous cleanup guard: ensure unsubscribe is called if available
    return () => {
      cleanupPromise.then(unsub => {
        if (typeof unsub === 'function') {
          try { unsub(); } catch (_) {}
        }
      }).catch(() => {});
    };
  }, []);

  // Lazy load content when tabs are accessed
  useEffect(() => {
    const currentSeason = appConfig?.currentSeason || 9;
    
    if (activeTab === 'promos') {
      const unsubscribe = FirestoreService.subscribeToPromoVideos(currentSeason, (videos) => {
        setPromoVideos(videos);
      });
      return unsubscribe;
    } else if (activeTab === 'contestants') {
      const unsubscribe = FirestoreService.subscribeToContestants(currentSeason, (contestantsList) => {
        setContestants(contestantsList);
      });
      return unsubscribe;
    } else if (activeTab === 'updates') {
      // Load Twitter feed data
      FirestoreService.getTwitterFeed(currentSeason)
        .then(twitterFeedData => {
          setTwitterFeed(twitterFeedData);
        })
        .catch(err => {
          console.error('Error loading Twitter feed:', err);
        });
    }
  }, [activeTab, appConfig]);

  const handleVoteSubmitted = async () => {
    // Show interstitial ad with delay after vote submission
    setTimeout(async () => {
      if (appConfig?.adsEnabled !== false) {
        console.log('Attempting to show interstitial ad...');
        const adShown = await AdService.showInterstitialAd();
        console.log('Interstitial ad shown:', adShown);
      }
    }, 6000); // 6 second delay

    // Review prompt strategy: after a successful vote
    try {
      await ReviewService.incrementInteraction();
      if (await ReviewService.shouldPrompt()) {
        await ReviewService.recordPromptShown();
        // Instead of an intrusive modal, use a lightweight card CTA
        // We will render it below the poll via local state
        setShowReviewCTA(true);
      }
    } catch (_) {}
  };


  const HeaderBanner = () => (
    <View style={styles.bannerContainer}>
      <Pressable onLongPress={() => { if (__DEV__) setShowReviewCTA(true) }} delayLongPress={500}>
        <ImageBackground
          source={BANNER_IMAGE}
          style={styles.banner}
          imageStyle={styles.bannerImage}
        >
        </ImageBackground>
      </Pressable>
      <TouchableOpacity
        accessibilityRole='button'
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        style={styles.hamburgerButton}
        activeOpacity={0.8}
      >
        <Text style={styles.hamburgerIcon}>☰</Text>
      </TouchableOpacity>
    </View>
  );

  // Static tabs - always available
  const TopTabs = () => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}
        style={styles.tabsScrollView}
        bounces={false}
        decelerationRate="fast"
      >
        {STATIC_TABS.map((tab, index) => (
          <TouchableOpacity
            key={tab.key}
            activeOpacity={0.8}
            onPress={() => setActiveTab(tab.key)}
            style={[
              styles.tabPill, 
              activeTab === tab.key && styles.tabPillActive,
              index === STATIC_TABS.length - 1 && { marginRight: SPACING.xl } // Extra margin for last tab
            ]}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const UpdatesSubTabs: React.FC = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
      {['tweets', 'news'].map((tabKey) => (
        <TouchableOpacity
          key={tabKey}
          activeOpacity={0.8}
          onPress={() => setUpdatesTab(tabKey as 'tweets' | 'news')}
          style={[styles.tabPill, updatesTab === tabKey && styles.tabPillActive]}
        >
          <Text style={[styles.tabText, updatesTab === tabKey && styles.tabTextActive]}>
            {tabKey === 'tweets' ? 'Latest Tweets' : 'Latest News'}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderActivePoll = () => {
    return (
      <View style={styles.contentContainer}>
        <HeaderBanner />
        <TopTabs />
        
        {/* Content based on active tab */}
        {activeTab === 'vote' && (
          poll ? (
            <VotingPoll
              poll={poll}
              onVoteSubmitted={handleVoteSubmitted}
              onResultsClicked={handleVoteSubmitted} // Same callback for ad trigger
              showInlineAd={appConfig?.inlineAdEnabled !== false && appConfig?.adsEnabled !== false}
              inlineAdUnitId={appConfig?.adMobInlineBannerId || AdService.INLINE_BANNER_AD_UNIT_ID}
              onInteractionChange={(isInteracting) => {
                // Disable parent scrolling briefly during WebView interaction
                if (interactionTimeoutRef.current) {
                  clearTimeout(interactionTimeoutRef.current);
                }
                setParentScrollEnabled(!isInteracting);
                interactionTimeoutRef.current = setTimeout(() => {
                  setParentScrollEnabled(true);
                }, isInteracting ? 300 : 0);
              }}
            />
          ) : error ? (
            <Card variant="outlined" style={styles.errorCard}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorTitle}>No Poll Available</Text>
              <Text style={styles.errorMessage}>{error}</Text>
            </Card>
          ) : (
            <Card variant="elevated" style={styles.loadingCard}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Loading poll...</Text>
            </Card>
          )
        )}

        {/* Conditional Review CTA */}
        {showReviewCTA && (
          <Card variant="elevated" style={{ marginHorizontal: SPACING.md, marginTop: SPACING.sm }}>
            <View style={{ padding: SPACING.md }}>
              <Text style={{ ...TYPOGRAPHY.titleMedium, color: COLORS.onSurface, marginBottom: SPACING.xs }}>Enjoying the app?</Text>
              <Text style={{ ...TYPOGRAPHY.bodyMedium, color: COLORS.onSurfaceVariant, marginBottom: SPACING.sm }}>Please take a moment to rate us on the Play Store.</Text>
              <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
                <TouchableOpacity onPress={async () => { await ReviewService.openStorePage(); setShowReviewCTA(false); }} style={{ backgroundColor: COLORS.primary, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.md }}>
                  <Text style={{ color: COLORS.onPrimary }}>Rate now</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowReviewCTA(false)} style={{ backgroundColor: COLORS.surface, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.outline }}>
                  <Text style={{ color: COLORS.onSurface }}>Maybe later</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        )}

        {activeTab === 'promos' && (
          <View style={styles.promosContainer}>
            {promoVideos.length > 0 ? (
              promoVideos.map((video) => (
                <YouTubeEmbed key={video.id} video={video} />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateTitle}>No Promos Available</Text>
                <Text style={styles.emptyStateText}>
                  Check back later for exciting promos and updates!
                </Text>
              </View>
            )}
          </View>
        )}

        {activeTab === 'updates' && (
          <View style={styles.tabContentContainer}>
            <UpdatesSubTabs />
            <View style={styles.updatesSection}>
              {updatesTab === 'tweets' && twitterFeed && (
                <View style={styles.twitterSection}>
                  <TwitterFeedEmbed twitterFeed={twitterFeed} />
                </View>
              )}
              {updatesTab === 'news' && (
                <View style={styles.newsSection}>
                  <RSSNewsFeed rssUrl={'https://news.google.com/rss/search?q=bigg+boss+telugu&hl=en-IN&gl=IN&ceid=IN:en'} />
                </View>
              )}
            </View>
          </View>
        )}

        {activeTab === 'contestants' && (
          <View style={styles.contestantsContainer}>
            {contestants.length > 0 ? (
              contestants.map((contestant) => (
                <ContestantCard key={contestant.id} contestant={contestant} />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateTitle}>No Contestants Available</Text>
                <Text style={styles.emptyStateText}>
                  Contestant information will be updated soon!
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={parentScrollRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={parentScrollEnabled}
      >
        {renderActivePoll()}
      </ScrollView>


      {/* Bottom sticky banner ad */}
      {(appConfig?.adsEnabled !== false) && (
        <View style={styles.bottomAdContainer}>
          <BannerAd unitId={appConfig?.adMobBannerId || AdService.BANNER_AD_UNIT_ID} size={BannerAdSize.BANNER} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  contentContainer: {
    flex: 1,
  },
  topBar: {
    height: 44,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.outline,
  },
  menuButton: {
    width: 40,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    ...TYPOGRAPHY.titleMedium,
    color: COLORS.onSurface,
  },
  banner: {
    height: 180,
    width: '100%',
  },
  bannerContainer: {
    position: 'relative',
  },
  bannerImage: {
    borderBottomLeftRadius: BORDER_RADIUS.lg,
    borderBottomRightRadius: BORDER_RADIUS.lg,
  },
  hamburgerButton: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    zIndex: 2,
  },
  hamburgerIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  tabsContainer: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    paddingRight: SPACING.xl * 2, // Extra padding to ensure last tab is visible
  },
  tabsScrollView: {
    flexGrow: 0,
    marginBottom: SPACING.sm,
  },
  tabPill: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minWidth: 75,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabPillActive: {
    backgroundColor: '#000000',
    borderColor: '#000000',
    borderWidth: 1,
  },
  tabText: {
    ...TYPOGRAPHY.labelSmall,
    color: '#666666',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 12,
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
  tabContentContainer: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  updatesSection: {
    flex: 1,
    marginTop: SPACING.sm,
  },
  twitterSection: {
    flex: 1,
  },
  newsSection: {
    flex: 1,
  },
  promosContainer: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },
  contestantsContainer: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xl * 2,
    paddingHorizontal: SPACING.lg,
  },
  emptyStateTitle: {
    ...TYPOGRAPHY.headlineSmall,
    color: COLORS.onSurface,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  emptyStateText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
  },
  loadingCard: {
    margin: SPACING.md,
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  loadingText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.onSurfaceVariant,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  errorCard: {
    margin: SPACING.md,
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  errorTitle: {
    ...TYPOGRAPHY.headlineSmall,
    color: COLORS.onSurface,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  errorMessage: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomAdContainer: {
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.xs,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.outline,
  },
  customHeader: {
    height: 56,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.outline,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    ...TYPOGRAPHY.headlineSmall,
    color: COLORS.text,
    fontWeight: '600',
  },
  headerHamburger: {
    padding: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  fabMenu: {
    position: 'absolute',
    top: 60, // Move down more from status bar
    left: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF0000', // Bright red for debugging - should be very visible
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    borderWidth: 3,
    borderColor: '#FFFFFF', // White border for extra visibility
  },
});

export default VoteHubScreen;