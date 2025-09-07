const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
// Simple config without custom blockList to avoid API differences

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
	resetCache: true,
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);