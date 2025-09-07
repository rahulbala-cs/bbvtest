import React, { useState, useRef } from 'react';
import {
	View,
	Text,
	StyleSheet,
	ActivityIndicator,
	Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
// import LinearGradient from 'react-native-linear-gradient';
import Button from './Button';
import Card from './Card';
import { Poll } from '../../types';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../config/constants';

interface VotingPollProps {
	poll: Poll;
	onVoteSubmitted?: () => void;
}

const { width } = Dimensions.get('window');

const VotingPoll: React.FC<VotingPollProps> = ({ poll, onVoteSubmitted }) => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const webViewRef = useRef<WebView>(null);
	const [pollHeight, setPollHeight] = useState<number>(420);

	// Generate minimal HTML with no custom styling - let Crowdsignal handle everything
	const generatePollHTML = (pollId: string) => {
		return `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover">
				<title>Bigg Boss Telugu Voting</title>
				<style>
					* {
						margin: 0;
						padding: 0;
						box-sizing: border-box;
						-webkit-touch-callout: none;
						-webkit-user-select: none;
						-khtml-user-select: none;
						-moz-user-select: none;
						-ms-user-select: none;
						user-select: none;
					}
					
					html, body {
						font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
						background: transparent;
						height: 100%;
						overflow-x: hidden;
						-webkit-overflow-scrolling: touch;
					}
					
					body {
						padding: 0;
						color: #333;
						line-height: 1.5;
					}
					
					/* Hide all Crowdsignal branding and headers */
					.cs-poll-header,
					.cs-poll-footer,
					.cs-poll-branding,
					.crowdsignal-logo,
					.cs-poll-powered-by,
					.polldaddy-header,
					.polldaddy-footer,
					.polldaddy-branding,
					[class*="branding"],
					[class*="powered"],
					[class*="header"],
					[id*="branding"],
					[id*="powered"],
					[id*="header"] {
						display: none !important;
						visibility: hidden !important;
						height: 0 !important;
						overflow: hidden !important;
						opacity: 0 !important;
					}
					
					/* Reset all poll containers */
					* {
						box-sizing: border-box !important;
					}
					
					.cs-poll,
					.crowdsignal-poll,
					.polldaddy,
					#polldaddy,
					[class*="poll"],
					[id*="poll"] {
						background: transparent !important;
						border: none !important;
						margin: 0 !important;
						padding: 8px !important;
						width: 100% !important;
						max-width: 100% !important;
						font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
					}
					
					/* Hide question title since we have our own */
					.cs-poll-question,
					.poll-question,
					.polldaddy-question,
					h1, h2, h3, h4, h5 {
						display: none !important;
						visibility: hidden !important;
						height: 0 !important;
						margin: 0 !important;
						padding: 0 !important;
					}
					
					/* Style answer container */
					.cs-poll-answers,
					.poll-answers,
					.polldaddy-answers,
					ul, ol {
						list-style: none !important;
						padding: 0 !important;
						margin: 0 !important;
						background: transparent !important;
					}
					
					/* Modern answer option styling */
					.cs-poll-answer,
					.poll-answer,
					.polldaddy-answer,
					li {
						background: #ffffff !important;
						border: 2px solid #f0f0f0 !important;
						border-radius: 12px !important;
						margin: 0 0 12px 0 !important;
						padding: 0 !important;
						transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
						box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
						overflow: hidden !important;
						position: relative !important;
					}
					
					.cs-poll-answer:hover,
					.poll-answer:hover,
					.polldaddy-answer:hover,
					li:hover {
						border-color: #6366F1 !important;
						box-shadow: 0 6px 24px rgba(255, 0, 80, 0.15) !important;
						transform: translateY(-2px) !important;
					}
					
					/* Radio button styling */
					input[type="radio"] {
						width: 20px !important;
						height: 20px !important;
						margin: 20px !important;
						margin-right: 16px !important;
						appearance: none !important;
						-webkit-appearance: none !important;
						background: #fff !important;
						border: 2px solid #ddd !important;
						border-radius: 50% !important;
						position: relative !important;
						cursor: pointer !important;
						transition: all 0.2s ease !important;
					}
					
					input[type="radio"]:checked {
						border-color: #6366F1 !important;
						background: #6366F1 !important;
					}
					
					input[type="radio"]:checked::after {
						content: '' !important;
						position: absolute !important;
						top: 50% !important;
						left: 50% !important;
						width: 8px !important;
						height: 8px !important;
						border-radius: 50% !important;
						background: white !important;
						transform: translate(-50%, -50%) !important;
					}
					
					/* Label styling */
					label {
						font-size: 16px !important;
						font-weight: 500 !important;
						color: #2c2c2c !important;
						padding: 16px 20px 16px 0 !important;
						display: flex !important;
						align-items: center !important;
						cursor: pointer !important;
						width: 100% !important;
						transition: all 0.2s ease !important;
						line-height: 1.4 !important;
						letter-spacing: 0.3px !important;
					}
					
					input[type="radio"]:checked + label,
					label:has(input[type="radio"]:checked) {
						color: #6366F1 !important;
						font-weight: 600 !important;
					}
					
					/* Selected state styling */
					.cs-poll-answer:has(input:checked),
					.poll-answer:has(input:checked),
					.polldaddy-answer:has(input:checked),
					li:has(input:checked) {
						border-color: #6366F1 !important;
						background: linear-gradient(135deg, #fff5f8, #ffffff) !important;
						box-shadow: 0 6px 24px rgba(255, 0, 80, 0.2) !important;
					}
					
					/* Modern submit button */
					button,
					input[type="submit"],
					.cs-poll-vote-button,
					.poll-vote-button,
					.polldaddy-vote-button {
						background: linear-gradient(135deg, #6366F1, #4F46E5) !important;
						border: none !important;
						border-radius: 12px !important;
						color: white !important;
						font-weight: 700 !important;
						font-size: 16px !important;
						padding: 14px 24px !important;
						width: 100% !important;
						margin-top: 16px !important;
						cursor: pointer !important;
						transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
						box-shadow: 0 6px 20px rgba(255, 0, 80, 0.3) !important;
						font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
						letter-spacing: 0.5px !important;
						text-transform: uppercase !important;
					}
					
					button:hover,
					input[type="submit"]:hover {
						transform: translateY(-3px) !important;
						box-shadow: 0 8px 28px rgba(255, 0, 80, 0.4) !important;
					}
					
					button:active,
					input[type="submit"]:active {
						transform: translateY(-1px) !important;
					}
					
					/* Thank you message */
					.cs-poll-thankyou,
					.poll-thankyou,
					.polldaddy-thankyou {
						text-align: center !important;
						padding: 40px 20px !important;
						color: #6366F1 !important;
						font-size: 20px !important;
						font-weight: 700 !important;
						background: linear-gradient(135deg, #fff5f8, #ffffff) !important;
						border-radius: 12px !important;
						border: 2px solid #6366F1 !important;
					}
					
					/* Loading state */
					.loading {
						text-align: center;
						padding: 40px 20px;
						color: #666;
					}
					
					.spinner {
						border: 3px solid #f3f3f3;
						border-top: 3px solid #6366F1;
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
					
					/* Mobile optimizations */
					@media (max-width: 480px) {
						.cs-poll,
						.crowdsignal-poll,
						.polldaddy {
							padding: 12px !important;
						}
						
						.cs-poll-question,
						.poll-question,
						h3, h4 {
							font-size: 16px !important;
						}
						
						label {
							font-size: 15px !important;
							padding: 14px 16px 14px 0 !important;
						}
						
						button,
						input[type="submit"] {
							padding: 12px 20px !important;
							font-size: 14px !important;
						}
					}
					
					/* Hide any iframe borders */
					iframe {
						border: none !important;
					}
					
					/* Ensure full height */
					#polldaddy-container {
						min-height: 100%;
					}
					
					/* Remove any inline borders Crowdsignal adds */
					div[style*="border-left"],
					div[style*="border-right"],
					div[style*="border-top"],
					div[style*="border-bottom"],
					section[style*="border-"],
					article[style*="border-"] {
						border: none !important;
						box-shadow: none !important;
					}
					
					/* Remove thick left rule inside some poll themes */
					[class*="border"], [class*="rule"], .cs-poll-container:before, .cs-poll-container:after {
						border: none !important;
					}
				</style>
			</head>
			<body>
				<div id="polldaddy-container">
					<div id="loading" class="loading">
						<div class="spinner"></div>
						<p>Loading poll...</p>
					</div>
					
					<script type="text/javascript" charset="utf-8" src="https://secure.polldaddy.com/p/${pollId}.js"></script>
					<noscript>
						<a href="https://poll.fm/${pollId}" target="_blank">Bigg Boss Telugu 8 Voting</a>
					</noscript>
				</div>
				
				<script>
					function postHeight() {
						try {
							var h = Math.max(
								document.documentElement.scrollHeight,
								document.body.scrollHeight,
								document.documentElement.offsetHeight,
								document.body.offsetHeight
							);
							if (window.ReactNativeWebView) {
								window.ReactNativeWebView.postMessage(JSON.stringify({
									type: 'CONTENT_HEIGHT',
									height: h
								}));
							}
						} catch(e) {}
					}

					// Hide loading spinner once poll loads
					function hideLoading() {
						const loading = document.getElementById('loading');
						if (loading) {
							loading.style.display = 'none';
						}
						postHeight();
					}
					
					// Multiple ways to detect when poll is loaded
					window.addEventListener('load', function() {
						setTimeout(hideLoading, 800);
						setTimeout(postHeight, 1200);
					});
					
					// Check for poll elements periodically - faster detection
					let checkCount = 0;
					const checkInterval = setInterval(function() {
						const pollElements = document.querySelectorAll('[class*="poll"], [class*="cs-poll"], .polldaddy, form, input[type="radio"]');
						if (pollElements.length > 0 || checkCount > 15) {
							hideLoading();
							clearInterval(checkInterval);
							postHeight();
						}
						checkCount++;
					}, 100);
					
					setInterval(postHeight, 1000);
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
		setError('Failed to load the voting poll. Please try again.');
	};

	const handleWebViewMessage = (event: any) => {
		try {
			const message = JSON.parse(event.nativeEvent.data);
			if (message.type === 'CONTENT_HEIGHT' && message.height) {
				const clamped = Math.min(Math.max(Number(message.height), 320), 900);
				setPollHeight(clamped);
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

	const renderLoading = () => (
		<Card variant="elevated" style={styles.loadingCard}>
			<ActivityIndicator size="large" color={COLORS.primary} />
			<Text style={styles.loadingText}>Loading voting poll...</Text>
		</Card>
	);

	if (error) {
		return renderError();
	}

	return (
		<View style={styles.container}>
			<View style={styles.pollContainer}>
				{/* Poll Header */}
				<Card variant="elevated" style={styles.headerCard}>
					<View style={styles.headerGradient}>
						<Text style={styles.pollTitle}>{poll.title}</Text>
						<Text style={styles.pollSubtitle}>
							Week {poll.week} • Season {poll.season}
						</Text>
					</View>
				</Card>

				{/* Native-styled Crowdsignal Poll */}
				<Card variant="elevated" style={styles.webViewCard}>
				{loading && renderLoading()}
				<WebView
					ref={webViewRef}
					source={{ 
						html: generatePollHTML(poll.pollId || poll.embedUrl.split('/').pop() || '10967724')
					}}
					style={[styles.webView, { height: pollHeight }, loading && styles.hiddenWebView]}
					onLoad={handleWebViewLoad}
					onError={handleWebViewError}
					onMessage={handleWebViewMessage}
					javaScriptEnabled={true}
					domStorageEnabled={true}
					startInLoadingState={false}
					allowsInlineMediaPlayback={true}
					mediaPlaybackRequiresUserAction={false}
					mixedContentMode="compatibility"
					scrollEnabled={false}
					bounces={false}
					showsHorizontalScrollIndicator={false}
					showsVerticalScrollIndicator={false}
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
	pollSubtitle: {
		...TYPOGRAPHY.bodyMedium,
		color: COLORS.textInverse,
		opacity: 0.9,
		textAlign: 'center',
	},
	webViewCard: {
		marginBottom: SPACING.sm,
		overflow: 'hidden',
		minHeight: 280,
	},
	webView: {
		flex: 1,
		backgroundColor: 'transparent',
	},
	hiddenWebView: {
		opacity: 0,
	},
	loadingCard: {
		alignItems: 'center',
		paddingVertical: SPACING.xl,
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
	instructionsCard: {
		marginTop: SPACING.sm,
	},
	instructionsTitle: {
		...TYPOGRAPHY.titleMedium,
		color: COLORS.text,
		marginBottom: SPACING.sm,
	},
	instructionsText: {
		...TYPOGRAPHY.bodyMedium,
		color: COLORS.textSecondary,
		lineHeight: 22,
	},
});

export default VotingPoll;
