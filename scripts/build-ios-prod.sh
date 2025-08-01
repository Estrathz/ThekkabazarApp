#!/bin/bash

echo "🍎 Starting iOS production build..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
cd ios && xcodebuild clean -workspace thekkabazar.xcworkspace -scheme thekkabazar && cd ..

# Set production environment
export NODE_ENV=production

# Build with production optimizations
echo "📱 Building iOS app (production mode)..."
cd ios && xcodebuild \
  -workspace thekkabazar.xcworkspace \
  -scheme thekkabazar \
  -configuration Release \
  -destination generic/platform=iOS \
  -archivePath thekkabazar.xcarchive \
  -parallelizeTargets \
  -jobs $(sysctl -n hw.ncpu) \
  archive && cd ..

echo "✅ iOS production build completed!"
echo "📁 Archive location: ios/thekkabazar.xcarchive" 