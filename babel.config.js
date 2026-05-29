module.exports = function (api) {
  const isProduction = api.env('production');
  const plugins = [];

  // Strip ALL console.* (including error/warn) from production bundles only.
  // In development we keep them so debugging/logging still works.
  if (isProduction) {
    plugins.push(['transform-remove-console', {exclude: []}]);
  }

  // React Native Reanimated plugin must remain last.
  plugins.push('react-native-reanimated/plugin');

  return {
    presets: ['module:@react-native/babel-preset'],
    plugins,
  };
};
