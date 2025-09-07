import React from 'react';
import {
	TouchableOpacity,
	Text,
	StyleSheet,
	ViewStyle,
	TextStyle,
	ActivityIndicator,
	View,
} from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../config/constants';

interface ButtonProps {
	title: string;
	onPress: () => void;
	variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
	size?: 'small' | 'medium' | 'large';
	disabled?: boolean;
	loading?: boolean;
	icon?: React.ReactNode;
	style?: ViewStyle;
	textStyle?: TextStyle;
	fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
	title,
	onPress,
	variant = 'primary',
	size = 'medium',
	disabled = false,
	loading = false,
	icon,
	style,
	textStyle,
	fullWidth = false,
}) => {
	const getButtonStyle = (): ViewStyle => {
		const baseStyle: ViewStyle = {
			borderRadius: BORDER_RADIUS.lg,
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'center',
			...getSizeStyle(),
		};

		if (fullWidth) {
			baseStyle.width = '100%';
		}

		switch (variant) {
			case 'primary':
				return {
					...baseStyle,
					backgroundColor: disabled ? COLORS.disabled : COLORS.primary,
					...SHADOWS.sm,
				};
			case 'secondary':
				return {
					...baseStyle,
					backgroundColor: disabled ? COLORS.disabled : COLORS.secondary,
					...SHADOWS.sm,
				};
			case 'outline':
				return {
					...baseStyle,
					backgroundColor: 'transparent',
					borderWidth: 2,
					borderColor: disabled ? COLORS.disabled : COLORS.primary,
				};
			case 'ghost':
				return {
					...baseStyle,
					backgroundColor: 'transparent',
				};
			default:
				return baseStyle;
		}
	};

	const getSizeStyle = (): ViewStyle => {
		switch (size) {
			case 'small':
				return {
					paddingHorizontal: SPACING.md,
					paddingVertical: SPACING.sm,
					minHeight: 36,
				};
			case 'medium':
				return {
					paddingHorizontal: SPACING.lg,
					paddingVertical: SPACING.md,
					minHeight: 48,
				};
			case 'large':
				return {
					paddingHorizontal: SPACING.xl,
					paddingVertical: SPACING.lg,
					minHeight: 56,
				};
			default:
				return {};
		}
	};

	const getTextStyle = (): TextStyle => {
		const baseTextStyle: TextStyle = {
			textAlign: 'center',
			...getTextSizeStyle(),
		};

		switch (variant) {
			case 'primary':
			case 'secondary':
				return {
					...baseTextStyle,
					color: disabled ? COLORS.textTertiary : COLORS.textInverse,
				};
			case 'outline':
			case 'ghost':
				return {
					...baseTextStyle,
					color: disabled ? COLORS.textTertiary : COLORS.primary,
				};
			default:
				return baseTextStyle;
		}
	};

	const getTextSizeStyle = (): TextStyle => {
		switch (size) {
			case 'small':
				return TYPOGRAPHY.labelMedium;
			case 'medium':
				return TYPOGRAPHY.labelLarge;
			case 'large':
				return TYPOGRAPHY.titleMedium;
			default:
				return TYPOGRAPHY.labelLarge;
		}
	};

	const renderContent = () => (
		<View style={styles.content}>
			{loading && (
				<ActivityIndicator
					size="small"
					color={variant === 'primary' || variant === 'secondary' ? COLORS.textInverse : COLORS.primary}
					style={styles.loader}
				/>
			)}
			{icon && !loading && <View style={styles.icon}>{icon}</View>}
			<Text style={[getTextStyle(), textStyle]}>{title}</Text>
		</View>
	);

	// Temporarily using solid color instead of gradient
	// if (variant === 'primary' && !disabled) {
	// 	return (
	// 		<TouchableOpacity
	// 			onPress={onPress}
	// 			disabled={disabled || loading}
	// 			style={[style]}
	// 			activeOpacity={0.8}
	// 		>
	// 			<LinearGradient
	// 				colors={COLORS.gradientPrimary}
	// 				start={{ x: 0, y: 0 }}
	// 				end={{ x: 1, y: 0 }}
	// 				style={[getButtonStyle()]}
	// 			>
	// 				{renderContent()}
	// 			</LinearGradient>
	// 		</TouchableOpacity>
	// 	);
	// }

	return (
		<TouchableOpacity
			onPress={onPress}
			disabled={disabled || loading}
			style={[getButtonStyle(), style]}
			activeOpacity={0.7}
		>
			{renderContent()}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	content: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	loader: {
		marginRight: SPACING.sm,
	},
	icon: {
		marginRight: SPACING.sm,
	},
});

export default Button;
