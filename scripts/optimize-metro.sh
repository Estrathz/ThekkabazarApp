#!/bin/bash

echo "🚇 Optimizing Metro bundler for ultra-fast builds..."

# Clear Metro cache
echo "🧹 Clearing Metro cache..."
npx react-native start --reset-cache --reset-cache

# Create optimized Metro config
echo "⚙️ Creating optimized Metro config..."
cat > metro.config.fast.js << 'EOF'
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const config = {
  resolver: {
    assetExts: ['bin', 'txt', 'jpg', 'png', 'json', 'ttf', 'otf', 'woff', 'woff2'],
    enableSymlinks: true,
    // Disable symlinks for faster resolution
    disableHierarchicalLookup: true,
  },
  transformer: {
    // Disable minification for faster builds
    minifierConfig: {
      keep_fnames: true,
      mangle: {
        keep_fnames: true,
      },
    },
    hermesParser: true,
    // Disable source maps for speed
    generateSourceMaps: false,
  },
  // Use all CPU cores
  maxWorkers: require('os').cpus().length,
  resetCache: false,
  // Disable file watching for faster builds
  watchFolders: [],
  // Optimize bundle
  bundle: {
    minify: false,
    sourceMap: false,
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
EOF

echo "✅ Metro optimization completed!"
echo "📝 Use: npx react-native start --config metro.config.fast.js" 