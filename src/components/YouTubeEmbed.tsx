import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { PromoVideo } from '../types';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../config/constants';

interface YouTubeEmbedProps {
  video: PromoVideo;
}

const { width } = Dimensions.get('window');
const VIDEO_HEIGHT = Math.round((width - SPACING.md * 2) * 9 / 16); // 16:9 aspect ratio

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ video }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const thumbnailUrl = useMemo(() => 
    video.thumbnailUrl || `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`,
    [video.thumbnailUrl, video.youtubeId]
  );

  const playerHtml = useMemo(() => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
        <style>
          html, body { margin:0; padding:0; background:#000; height:100%; overflow:hidden; }
          .wrap { position:relative; width:100%; height:100%; }
          iframe { position:absolute; top:0; left:0; width:100%; height:100%; border:0; }
        </style>
      </head>
      <body>
        <div class="wrap">
          <iframe
            src="https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&playsinline=1&controls=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&enablejsapi=1"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>
      </body>
    </html>
  `, [video.youtubeId]);

  const handlePlayPress = useCallback(() => {
    setIsLoading(true);
    setIsPlaying(true);
  }, []);

  const handleWebViewLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleWebViewError = useCallback((e: any) => {
    console.error('YouTube WebView error:', e.nativeEvent);
    setIsPlaying(false);
    setIsLoading(false);
  }, []);

  return (
    <View style={styles.container}>
      {isPlaying ? (
        <View style={styles.playerContainer}>
          <WebView
            source={{ html: playerHtml }}
            style={styles.player}
            onLoad={handleWebViewLoad}
            onError={handleWebViewError}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            cacheEnabled={true}
            cacheMode='LOAD_CACHE_ELSE_NETWORK'
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            allowsFullscreenVideo={true}
            mixedContentMode="always"
            originWhitelist={["*"]}
            androidLayerType="hardware"
            androidHardwareAccelerationDisabled={false}
            setSupportMultipleWindows={false}
            scrollEnabled={false}
            bounces={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            startInLoadingState={false}
            userAgent="Mozilla/5.0 (Linux; Android 12; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.58 Mobile Safari/537.36"
          />
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={COLORS.surface} />
              <Text style={styles.loadingText}>Loading video...</Text>
            </View>
          )}
        </View>
      ) : (
        <TouchableOpacity onPress={handlePlayPress} activeOpacity={0.85}>
          <ImageBackground
            source={{ uri: thumbnailUrl }}
            style={styles.thumbnail}
            imageStyle={styles.thumbnailImage}
          >
            <View style={styles.overlay}>
              <View style={styles.playButton}>
                {isLoading ? (
                  <ActivityIndicator size="small" color={COLORS.primary} />
                ) : (
                  <Text style={styles.playIcon}>▶</Text>
                )}
              </View>
              {video.duration && (
                <View style={styles.durationBadge}>
                  <Text style={styles.durationText}>{video.duration}</Text>
                </View>
              )}
            </View>
          </ImageBackground>
        </TouchableOpacity>
      )}

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {video.title}
        </Text>
        {video.description && (
          <Text style={styles.description} numberOfLines={3}>
            {video.description}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  thumbnail: {
    width: '100%',
    height: VIDEO_HEIGHT,
    position: 'relative',
  },
  thumbnailImage: {
    borderTopLeftRadius: BORDER_RADIUS.lg,
    borderTopRightRadius: BORDER_RADIUS.lg,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.lg,
  },
  playIcon: {
    fontSize: 24,
    color: COLORS.primary,
    marginLeft: 4, // Center the play triangle
  },
  durationBadge: {
    position: 'absolute',
    bottom: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  durationText: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.textInverse,
  },
  content: {
    padding: SPACING.md,
  },
  title: {
    ...TYPOGRAPHY.titleMedium,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  description: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  playerContainer: {
    width: '100%',
    height: VIDEO_HEIGHT,
    backgroundColor: '#000',
    overflow: 'hidden',
    borderTopLeftRadius: BORDER_RADIUS.lg,
    borderTopRightRadius: BORDER_RADIUS.lg,
    position: 'relative',
  },
  player: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.surface,
    marginTop: SPACING.xs,
  },
});

export default YouTubeEmbed;
