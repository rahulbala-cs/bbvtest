export const APP_CONFIG = {
  CURRENT_SEASON: 8,
  AD_FREQUENCY_CAP_MINUTES: 60,
  POLL_REFRESH_INTERVAL: 30000, // 30 seconds
  NEWS_REFRESH_INTERVAL: 60000, // 1 minute
};

export const COLORS = {
  // Simple Black Theme - 2024
  primary: '#000000', // Pure black
  secondary: '#333333', // Dark gray for contrast
  accent: '#666666', // Medium gray for subtle accents
  
  // Dark theme support
  primaryDark: '#000000',
  secondaryDark: '#1A1A1A',
  
  // Backgrounds with depth
  background: '#FAFAFA', // Off-white for warmth
  backgroundDark: '#0F0F0F',
  surface: '#FFFFFF',
  surfaceDark: '#1E1E1E',
  surfaceElevated: '#FFFFFF',
  surfaceElevatedDark: '#2A2A2A',
  
  // Text hierarchy
  text: '#1A1A1A', // Near black for readability
  textSecondary: '#666666', // Medium gray
  textTertiary: '#999999', // Light gray
  textInverse: '#FFFFFF', // White text
  onSurface: '#1A1A1A', // Text on surface
  onSurfaceVariant: '#666666', // Secondary text on surface
  onPrimary: '#FFFFFF', // Text on primary color
  
  // Semantic colors
  success: '#00D084', // Modern green
  warning: '#FFA726', // Warm orange
  error: '#FF3B30', // iOS-style red
  info: '#007AFF', // iOS-style blue
  
  // Interactive states
  border: '#E5E5E5',
  borderFocus: '#000000',
  disabled: '#F5F5F5',
  overlay: 'rgba(0, 0, 0, 0.5)',
  outline: '#E5E5E5', // Border and outline color
  
  // Gradients (for modern effects)
  gradientPrimary: ['#000000', '#333333'],
  gradientSecondary: ['#666666', '#999999'],
  gradientDark: ['#1A1A1A', '#000000'],
};

export const TYPOGRAPHY = {
  // Modern type scale
  displayLarge: { fontSize: 32, fontWeight: '700' as const, lineHeight: 38 },
  displayMedium: { fontSize: 28, fontWeight: '700' as const, lineHeight: 34 },
  displaySmall: { fontSize: 24, fontWeight: '600' as const, lineHeight: 30 },
  
  headlineLarge: { fontSize: 22, fontWeight: '600' as const, lineHeight: 28 },
  headlineMedium: { fontSize: 20, fontWeight: '600' as const, lineHeight: 26 },
  headlineSmall: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
  
  titleLarge: { fontSize: 16, fontWeight: '600' as const, lineHeight: 22 },
  titleMedium: { fontSize: 14, fontWeight: '600' as const, lineHeight: 20 },
  titleSmall: { fontSize: 12, fontWeight: '600' as const, lineHeight: 18 },
  
  bodyLarge: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodyMedium: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  bodySmall: { fontSize: 12, fontWeight: '400' as const, lineHeight: 18 },
  
  labelLarge: { fontSize: 14, fontWeight: '500' as const, lineHeight: 20 },
  labelMedium: { fontSize: 12, fontWeight: '500' as const, lineHeight: 18 },
  labelSmall: { fontSize: 10, fontWeight: '500' as const, lineHeight: 16 },
  
  // Legacy aliases for backward compatibility
  h1: { fontSize: 28, fontWeight: '700' as const, lineHeight: 34 },
  h2: { fontSize: 24, fontWeight: '600' as const, lineHeight: 30 },
  h3: { fontSize: 20, fontWeight: '600' as const, lineHeight: 26 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  caption: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  small: { fontSize: 12, fontWeight: '400' as const, lineHeight: 18 },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const BORDER_RADIUS = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
};

export const SHADOWS = {
  none: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  lg: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  xl: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
};

export const ANIMATIONS = {
  fast: 150,
  normal: 300,
  slow: 500,
  slowest: 800,
};