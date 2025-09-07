module.exports = {
	presets: ['module:@react-native/babel-preset'],
	plugins: [
		// NOTE: This MUST be the last plugin
		'react-native-reanimated/plugin',
	],
};