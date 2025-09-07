import React, { useState, useRef } from 'react';
import {
	View,
	Text,
	StyleSheet,
	ActivityIndicator,
	Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Button from './Button';
import Card from './Card';
import { Poll } from '../../types';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../config/constants';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { AdService } from '../../services/ads';

interface VotingPollProps {
	poll: Poll;
	onVoteSubmitted?: () => void;
	onResultsClicked?: () => void;
	showInlineAd?: boolean;
	inlineAdUnitId?: string;
	// Notify parent when user is interacting inside the WebView
	onInteractionChange?: (isInteracting: boolean) => void;
}

const { width } = Dimensions.get('window');

const VotingPoll: React.FC<VotingPollProps> = ({ 
	poll, 
	onVoteSubmitted, 
	onResultsClicked,
	showInlineAd = true, 
	inlineAdUnitId,
	onInteractionChange
}) => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const webViewRef = useRef<WebView>(null);
	const [pollHeight, setPollHeight] = useState<number>(800); // Fixed height to prevent jerky scrolling

	// Simple, fast poll HTML - no complex loading detection
	const generatePollHTML = (pollId: string) => {
		return `
			<!DOCTYPE html>
			<html>
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
				<style>
					* { margin: 0; padding: 0; box-sizing: border-box; }
					body { 
						font-family: -apple-system, BlinkMacSystemFont, sans-serif;
						background: transparent;
						overflow-x: hidden;
						/* Prevent layout shifts during interaction */
						contain: layout style;
					}
					/* Hide branding */
					.cs-poll-header, .cs-poll-footer, .cs-poll-branding,
					.crowdsignal-logo, .cs-poll-powered-by, .polldaddy-header,
					.polldaddy-footer, .polldaddy-branding, [class*="branding"],
					[class*="powered"] { display: none !important; }
					/* Poll styling */
					.cs-poll, .crowdsignal-poll, .polldaddy, #polldaddy {
						background: transparent !important;
						border: none !important;
						padding: 12px !important;
						width: 100% !important;
						/* Prevent content jumping */
						min-height: 300px;
					}
					/* Smooth radio button interactions */
					input[type="radio"] {
						transition: none !important;
						transform-origin: center;
					}
					/* Prevent any animations that might cause jumps */
					* {
						transition: none !important;
						animation: none !important;
					}
				</style>
			</head>
			<body>
				<script type="text/javascript" charset="utf-8" src="https://secure.polldaddy.com/p/${pollId}.js"></script>
				<noscript><a href="https://poll.fm/${pollId}">Vote</a></noscript>
				
				<script>
					// Simple loading notification - NO HEIGHT DETECTION
					setTimeout(() => {
						if (window.ReactNativeWebView) {
							window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'POLL_READY' }));
						}
					}, 800);
					
					// Event handlers - NO HEIGHT UPDATES
					document.addEventListener('click', function(e) {
						// Notify RN about interaction start to temporarily disable parent ScrollView
						try { if (window.ReactNativeWebView) { window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'USER_INTERACTION', value: true })); } } catch(_) {}
						if (e.target && e.target.type === 'radio') {
							try { 
								e.target.checked = true; 
							} catch(_) {}
						}
						if (e.target && e.target.tagName === 'A' && (e.target.textContent || '').toLowerCase().includes('view results')) {
							if (window.ReactNativeWebView) {
								window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'RESULTS_CLICKED' }));
							}
						}
						// End interaction shortly after click
						setTimeout(function(){ try { if (window.ReactNativeWebView) { window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'USER_INTERACTION', value: false })); } } catch(_) {} }, 250);
					});
					
					document.addEventListener('submit', function(e) {
						try {
							const selected = document.querySelector('input[type="radio"]:checked');
							if (selected && window.ReactNativeWebView) {
								window.ReactNativeWebView.postMessage(JSON.stringify({
									type: 'VOTE_SUBMITTED',
									form: e.target.action || 'submit',
									timestamp: Date.now()
								}));
							}
						} catch(_) {}
						return true;
					});
				</script>
			</body>
			</html>
		`;
	};

	const handleWebViewLoad = () => {
		// Clear loading after 1 second max
		setTimeout(() => setLoading(false), 1000);
	};

	const handleWebViewError = () => {
		setLoading(false);
		setError('Failed to load the voting poll. Please try again.');
	};

	const handleWebViewMessage = (event: any) => {
		try {
			const message = JSON.parse(event.nativeEvent.data);
			switch (message.type) {
				case 'USER_INTERACTION':
					if (typeof message.value === 'boolean') {
						onInteractionChange?.(message.value);
					}
					break;
				case 'CONTENT_HEIGHT':
					// DISABLE height updates to prevent jerky scrolling
					// Height is now fixed at initial value
					break;
				case 'POLL_READY':
					setLoading(false); // Clear loading when poll is ready
					break;
				case 'VOTE_SUBMITTED':
					onVoteSubmitted?.();
					break;
				case 'RESULTS_CLICKED':
					onResultsClicked?.();
					break;
			}
		} catch (error) {
			console.error('Error parsing WebView message:', error);
		}
	};

	const handleRetry = () => {
		setLoading(true);
		setError(null);
		webViewRef.current?.reload();
	};

	const renderError = () => (
		<Card variant="outlined" style={styles.errorCard}>
			<Text style={styles.errorIcon}>⚠️</Text>
			<Text style={styles.errorTitle}>Unable to Load Poll</Text>
			<Text style={styles.errorMessage}>{error}</Text>
			<Button
				title="Retry"
				onPress={handleRetry}
				variant="primary"
				size="medium"
				style={styles.retryButton}
			/>
		</Card>
	);

	if (error) {
		return renderError();
	}

	return (
		<View style={styles.container}>
			<View style={styles.pollContainer}>
				{/* Poll Header - restored */}
				<Card variant="elevated" style={styles.headerCard}>
					<View style={styles.headerGradient}>
						<Text style={styles.pollTitle}>{poll.title}</Text>
					</View>
				</Card>

				{/* Inline banner ad slot */}
				{showInlineAd && (
					<View style={{ marginBottom: SPACING.sm }}>
						<BannerAd unitId={inlineAdUnitId || AdService.INLINE_BANNER_AD_UNIT_ID} size={BannerAdSize.BANNER} />
					</View>
				)}

				{/* Fast Poll Loading */}
				<Card variant="elevated" style={styles.webViewCard}>
					{loading && (
						<View style={styles.loadingOverlay}>
							<ActivityIndicator size="large" color={COLORS.primary} />
							<Text style={styles.loadingText}>Loading poll...</Text>
						</View>
					)}
					<WebView
						ref={webViewRef}
						source={{ 
							html: generatePollHTML(poll.pollId || poll.embedUrl.split('/').pop() || '10967724'),
							baseUrl: 'https://poll.fm/'
						}}
						style={[styles.webView, { height: pollHeight }, loading && { opacity: 0 }]}
						onLoad={handleWebViewLoad}
						onError={handleWebViewError}
						onMessage={handleWebViewMessage}
						javaScriptEnabled={true}
						domStorageEnabled={true}
						startInLoadingState={false}
						mixedContentMode="compatibility"
						scrollEnabled={true}
						bounces={false}
						showsHorizontalScrollIndicator={false}
						showsVerticalScrollIndicator={false}
						allowsLinkPreview={false}
						dataDetectorTypes="none"
						onShouldStartLoadWithRequest={(request) => {
							const allowed = [
								'https://secure.polldaddy.com',
								'https://poll.fm',
								'about:blank'
							]
							return allowed.some(url => request.url.startsWith(url))
						}}
						userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1"
						allowsBackForwardNavigationGestures={false}
						thirdPartyCookiesEnabled={true}
						sharedCookiesEnabled={true}
						originWhitelist={["https://secure.polldaddy.com/*","https://poll.fm/*"]}
					/>
				</Card>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	pollContainer: {
		paddingHorizontal: SPACING.md,
	},
	headerCard: {
		marginBottom: SPACING.sm,
		overflow: 'hidden',
	},
	headerGradient: {
		padding: SPACING.lg,
		alignItems: 'center',
		backgroundColor: COLORS.primary,
	},
	pollTitle: {
		...TYPOGRAPHY.headlineLarge,
		color: COLORS.textInverse,
		textAlign: 'center',
		marginBottom: SPACING.xs,
	},
	webViewCard: {
		marginBottom: SPACING.sm,
		overflow: 'hidden',
		minHeight: 280,
		position: 'relative',
	},
	webView: {
		flex: 1,
		backgroundColor: 'transparent',
	},
	loadingOverlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(255, 255, 255, 0.9)',
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 1,
	},
	loadingText: {
		...TYPOGRAPHY.bodyMedium,
		color: COLORS.textSecondary,
		marginTop: SPACING.md,
		textAlign: 'center',
	},
	errorCard: {
		alignItems: 'center',
		paddingVertical: SPACING.xl,
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
		marginBottom: SPACING.lg,
		lineHeight: 22,
	},
	retryButton: {
		marginTop: SPACING.md,
	},
});

export default VotingPoll;