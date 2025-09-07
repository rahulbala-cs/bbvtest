// Moved to legacy; file kept for reference only
import React, { useState, useRef } from 'react';
import {
	View,
	Text,
	StyleSheet,
	ActivityIndicator,
	Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Card from './ui/Card';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../config/constants';

interface TwitterFanFeedProps {
	hashtag: string;
}

const { width } = Dimensions.get('window');

const TwitterFanFeed: React.FC<TwitterFanFeedProps> = ({ hashtag }) => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const webViewRef = useRef<WebView>(null);

	// Generate HTML content with embedded Twitter feed
	const generateTwitterHTML = (hashtag: string) => {
		const cleanHashtag = hashtag.replace('#', '');
		return `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
				<title>Fan Feed - ${hashtag}</title>
				<style>
					* {
						margin: 0;
						padding: 0;
						box-sizing: border-box;
					}
					
					body {
						font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
						background: #f5f5f5;
						padding: 0;
						color: #333;
						overflow-x: hidden;
					}
					
					.container {
						width: 100%;
						margin: 0 auto;
						background: white;
						min-height: 100vh;
					}
					
					.header {
						background: linear-gradient(135deg, #FF0050, #E6004A);
						color: white;
						padding: 20px;
						text-align: center;
						border-radius: 16px 16px 0 0;
					}
					
					.header h1 {
						font-size: 22px;
						font-weight: 700;
						margin-bottom: 8px;
						letter-spacing: 0.5px;
					}
					
					.header p {
						font-size: 15px;
						opacity: 0.9;
						font-weight: 500;
					}
					
					.feed-container {
						padding: 20px;
						min-height: 400px;
						background: #fafafa;
					}
					
					/* Twitter widget styles */
					.twitter-timeline {
						border: none !important;
						max-width: 100% !important;
						width: 100% !important;
						border-radius: 12px !important;
						overflow: hidden !important;
					}
					
					/* Fallback content styling */
					.fallback-content {
						text-align: center;
						padding: 60px 20px;
						color: #666;
						background: white;
						border-radius: 12px;
						border: 2px solid #f0f0f0;
					}
					
					.fallback-content h3 {
						font-size: 18px;
						font-weight: 600;
						margin-bottom: 12px;
						color: #333;
					}
					
					.fallback-content p {
						font-size: 14px;
						line-height: 1.5;
						margin-bottom: 20px;
					}
					
					.fallback-link {
						display: inline-block;
						background: linear-gradient(135deg, #FF0050, #E6004A);
						color: white;
						padding: 12px 24px;
						border-radius: 8px;
						text-decoration: none;
						font-weight: 600;
						transition: transform 0.2s ease;
					}
					
					.fallback-link:hover {
						transform: translateY(-2px);
						text-decoration: none;
						color: white;
					}
					
					/* Loading state */
					.loading {
						text-align: center;
						padding: 60px 20px;
						color: #666;
					}
					
					.spinner {
						border: 3px solid #f3f3f3;
						border-top: 3px solid #1da1f2;
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
					
					/* Error state */
					.error {
						text-align: center;
						padding: 60px 20px;
						color: #666;
					}
					
					.error-icon {
						font-size: 48px;
						margin-bottom: 16px;
					}
					
					/* Hide Twitter chrome for mobile */
					@media (max-width: 480px) {
						.twitter-timeline {
							height: 400px !important;
						}
					}
				</style>
			</head>
			<body>
				<div class="container">
					<div class="header">
						<h1>🔥 Fan Feed</h1>
						<p>Latest tweets about ${hashtag}</p>
					</div>
					
					<div class="feed-container">
						<div id="loading" class="loading">
							<div class="spinner"></div>
							<p>Loading fan tweets...</p>
						</div>
						
						<div id="twitter-content">
							<iframe src="https://mobile.twitter.com/search?q=%23${cleanHashtag}"
								style="width:100%; height:380px; border:0; border-radius:12px; overflow:hidden; background:#fff"
								title="Twitter Fan Feed" loading="lazy"></iframe>
						</div>
						
						<div id="fallback-content" class="fallback-content" style="display: none;">
							<h3>🔥 Join the Conversation!</h3>
							<p>Follow the latest buzz and discussions about Bigg Boss Telugu on Twitter.</p>
							<a href="https://twitter.com/search?q=%23${cleanHashtag}" target="_blank" class="fallback-link">
								View ${hashtag} on Twitter
							</a>
						</div>
						
						<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
					</div>
				</div>
				
				<script>
					let widgetLoaded = false;
					
					// Function to hide loading and show content
					function showContent() {
						const loading = document.getElementById('loading');
						const twitterContent = document.getElementById('twitter-content');
						const fallbackContent = document.getElementById('fallback-content');
						
						if (loading) {
							loading.style.display = 'none';
						}
						
						if (widgetLoaded && twitterContent) {
							twitterContent.style.display = 'block';
						} else if (fallbackContent) {
							fallbackContent.style.display = 'block';
						}
					}
					
					// Monitor for Twitter widget loading
					window.addEventListener('load', function() {
						// Check if Twitter widgets script is available
						if (window.twttr) {
							window.twttr.ready(function() {
								widgetLoaded = true;
								showContent();
							});
						}
						
						// Fallback timeout - show fallback if Twitter doesn't load
						setTimeout(function() {
							if (!widgetLoaded) {
								showContent();
							}
						}, 6000);
					});
					
					// Additional fallback for when Twitter widgets load
					window.twttr = window.twttr || {};
					window.twttr.ready = window.twttr.ready || function(callback) {
						if (window.twttr && window.twttr.widgets) {
							callback();
						} else {
							setTimeout(function() {
								if (window.twttr && window.twttr.widgets) {
									callback();
								}
							}, 100);
						}
					};
					
					// Listen for Twitter widget events
					document.addEventListener('DOMContentLoaded', function() {
						// Check periodically if timeline loaded
						let checkCount = 0;
						const checkInterval = setInterval(function() {
							const timeline = document.querySelector('.twitter-timeline-rendered');
							if (timeline && timeline.contentDocument) {
								widgetLoaded = true;
								showContent();
								clearInterval(checkInterval);
							} else if (checkCount > 30) { // 6 seconds
								showContent();
								clearInterval(checkInterval);
							}
							checkCount++;
						}, 200);
					});
				</script>
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

	const handleRetry = () => {
		setLoading(true);
		setError(null);
		webViewRef.current?.reload();
	};

	const renderError = () => (
		<View style={styles.errorContainer}>
			<Text style={styles.errorIcon}>🐦</Text>
			<Text style={styles.errorTitle}>Unable to Load Feed</Text>
			<Text style={styles.errorMessage}>{error}</Text>
		</View>
	);

	const renderLoading = () => (
		<View style={styles.loadingContainer}>
			<ActivityIndicator size="large" color={COLORS.primary} />
			<Text style={styles.loadingText}>Loading fan tweets...</Text>
		</View>
	);

	if (error) {
		return (
			<Card variant="outlined" style={styles.container}>
				{renderError()}
			</Card>
		);
	}

	return (
		<Card variant="elevated" style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>🔥 Fan Feed</Text>
				<Text style={styles.headerSubtitle}>Latest tweets about {hashtag}</Text>
			</View>
			
			<View style={styles.webViewContainer}>
				{loading && renderLoading()}
				<WebView
					ref={webViewRef}
					source={{ 
						html: generateTwitterHTML(hashtag)
					}}
					style={[styles.webView, loading && styles.hiddenWebView]}
					onLoad={handleWebViewLoad}
					onError={handleWebViewError}
					javaScriptEnabled={true}
					domStorageEnabled={true}
					startInLoadingState={false}
					allowsInlineMediaPlayback={true}
					mediaPlaybackRequiresUserAction={false}
					mixedContentMode="compatibility"
					scalesPageToFit={false}
					scrollEnabled={true}
				/>
			</View>
		</Card>
	);
};

const styles = StyleSheet.create({
	container: {
		marginTop: SPACING.lg,
		overflow: 'hidden',
		maxHeight: 500,
	},
	header: {
		backgroundColor: COLORS.primary,
		padding: SPACING.md,
		alignItems: 'center',
	},
	headerTitle: {
		...TYPOGRAPHY.headlineMedium,
		color: COLORS.textInverse,
		fontWeight: 'bold',
		marginBottom: SPACING.xs,
	},
	headerSubtitle: {
		...TYPOGRAPHY.bodyMedium,
		color: COLORS.textInverse,
		opacity: 0.9,
	},
	webViewContainer: {
		height: 400,
		position: 'relative',
	},
	webView: {
		flex: 1,
		backgroundColor: 'transparent',
	},
	hiddenWebView: {
		opacity: 0,
	},
	loadingContainer: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: COLORS.surface,
		zIndex: 1,
	},
	loadingText: {
		...TYPOGRAPHY.bodyMedium,
		color: COLORS.textSecondary,
		marginTop: SPACING.md,
		textAlign: 'center',
	},
	errorContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		padding: SPACING.xl,
		height: 200,
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
		lineHeight: 20,
	},
});

// Deprecated: return null to prevent legacy UI usage
export default function DeprecatedTwitterFanFeed(){ return null }
