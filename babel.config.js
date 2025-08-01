module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // Remove console.log in production
    [
      'transform-remove-console',
      {
        exclude: ['error', 'warn'],
      },
    ],
    // React Native Reanimated plugin
    'react-native-reanimated/plugin',
  ],
};
