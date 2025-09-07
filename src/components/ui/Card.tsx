import React from 'react';
import {
	View,
	StyleSheet,
	ViewStyle,
	TouchableOpacity,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../config/constants';

interface CardProps {
	children: React.ReactNode;
	style?: ViewStyle;
	padding?: number;
	onPress?: () => void;
	variant?: 'default' | 'elevated' | 'outlined';
	disabled?: boolean;
}

const Card: React.FC<CardProps> = ({
	children,
	style,
	padding = SPACING.md,
	onPress,
	variant = 'default',
	disabled = false,
}) => {
	const getCardStyle = (): ViewStyle => {
		const baseStyle: ViewStyle = {
			borderRadius: BORDER_RADIUS.lg,
			padding,
		};

		switch (variant) {
			case 'elevated':
				return {
					...baseStyle,
					backgroundColor: COLORS.surface,
					...SHADOWS.md,
				};
			case 'outlined':
				return {
					...baseStyle,
					backgroundColor: COLORS.surface,
					borderWidth: 1,
					borderColor: COLORS.border,
				};
			case 'default':
			default:
				return {
					...baseStyle,
					backgroundColor: COLORS.surface,
					...SHADOWS.sm,
				};
		}
	};

	if (onPress) {
		return (
			<TouchableOpacity
				onPress={onPress}
				disabled={disabled}
				style={[getCardStyle(), style]}
				activeOpacity={0.9}
			>
				{children}
			</TouchableOpacity>
		);
	}

	return (
		<View style={[getCardStyle(), style]}>
			{children}
		</View>
	);
};

export default Card;
