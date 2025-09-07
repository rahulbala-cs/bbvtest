import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { TwitterFeed } from '../types';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../config/constants';

interface TwitterFeedEmbedProps {
  twitterFeed: TwitterFeed;
}

const TwitterFeedEmbed: React.FC<TwitterFeedEmbedProps> = ({ twitterFeed }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const generateTwitterHTML = (hashtag: string, count: number) => {
    // Remove # if present in hashtag
    const cleanHashtag = hashtag.startsWith('#') ? hashtag.slice(1) : hashtag;
    
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Twitter Feed</title>
        <style>
          body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #FAFAFA;
          }
          .twitter-container {
            max-width: 100%;
            margin: 0 auto;
          }
          .loading {
            text-align: center;
            padding: 40px 20px;
            color: #666;
          }
          .spinner {
            border: 3px solid #f3f3f3;
            border-top: 3px solid #1DA1F2;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 16px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      </head>
      <body>
        <div class="twitter-container">
          <div id="loading" class="loading">
            <div class="spinner"></div>
            <p>Loading tweets...</p>
          </div>
          
          <!-- Simple fallback link for now since Twitter API requires authentication -->
          <div style="text-align: center; padding: 40px 20px; background: white; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1DA1F2; margin-bottom: 16px;">Latest #${cleanHashtag} Tweets</h3>
            <a href="https://twitter.com/hashtag/${cleanHashtag}" 
               target="_blank" 
               style="display: inline-block; background: #1DA1F2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 25px; font-weight: bold;">
              View Tweets on Twitter
            </a>
            <p style="color: #666; margin-top: 16px; font-size: 14px;">
              Click to see the latest tweets about Bigg Boss Telugu!
            </p>
          </div>
          
          <script>
            // Hide loading immediately since we're showing a simple link
            window.addEventListener('load', function() {
              const loading = document.getElementById('loading');
              if (loading) {
                loading.style.display = 'none';
              }
            });
            
            // Hide loading when Twitter widget loads
            window.twttr = (function(d, s, id) {
              var js, fjs = d.getElementsByTagName(s)[0],
                t = window.twttr || {};
              if (d.getElementById(id)) return t;
              js = d.createElement(s);
              js.id = id;
              js.src = "https://platform.twitter.com/widgets.js";
              fjs.parentNode.insertBefore(js, fjs);
              
              t._e = [];
              t.ready = function(f) {
                t._e.push(f);
              };
              
              return t;
            }(document, "script", "twitter-wjs"));
            
            if (window.twttr) {
              window.twttr.ready(function() {
                const loading = document.getElementById('loading');
                if (loading) {
                  loading.style.display = 'none';
                }
              });
            }
          </script>
        </div>
      </body>
      </html>
    `;
  };

  const handleWebViewLoad = () => {
    setLoading(false);
    setError(null);
  };

  const handleWebViewError = () => {
    setLoading(false);
    setError('Failed to load Twitter feed. Please check your connection.');
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>🐦</Text>
        <Text style={styles.errorTitle}>Unable to Load Twitter Feed</Text>
        <Text style={styles.errorMessage}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Latest Tweets: {twitterFeed.hashtag}
        </Text>
      </View>
      
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading tweets...</Text>
        </View>
      )}
      
      <WebView
        source={{ 
          html: generateTwitterHTML(twitterFeed.hashtag, twitterFeed.displayCount)
        }}
        style={[styles.webView, loading && styles.hiddenWebView]}
        onLoad={handleWebViewLoad}
        onError={handleWebViewError}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
        allowsInlineMediaPlayback={true}
        scrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        originWhitelist={['*']}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.md,
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
  webView: {
    flex: 1,
    backgroundColor: 'transparent',
    minHeight: 400,
  },
  hiddenWebView: {
    opacity: 0,
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1,
  },
  loadingText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  errorTitle: {
    ...TYPOGRAPHY.headlineSmall,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  errorMessage: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default TwitterFeedEmbed;
