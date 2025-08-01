const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    assetExts: ['bin', 'txt', 'jpg', 'png', 'json', 'ttf', 'otf', 'woff', 'woff2'],
    // Enable symlinks for better development experience
    enableSymlinks: true,
  },
  transformer: {
    // Enable minification for production builds
    minifierConfig: {
      keep_fnames: true,
      mangle: {
        keep_fnames: true,
      },
    },
    // Enable hermes for better performance
    hermesParser: true,
  },
  // Optimize bundle for production
  maxWorkers: require('os').cpus().length,
  resetCache: false,
  // Remove custom cache configuration to use default
  // cacheStores: [
  //   {
  //     name: 'metro-cache',
  //     type: 'file',
  //     options: {
  //       root: require('path').join(__dirname, 'node_modules', '.cache', 'metro'),
  //     },
  //   },
  // ],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
