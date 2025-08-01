#!/bin/bash

echo "🍎 Starting fast iOS development build..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
cd ios && xcodebuild clean -workspace thekkabazar.xcworkspace -scheme thekkabazar && cd ..

# Clean Pods cache
echo "🧹 Cleaning Pods cache..."
cd ios && rm -rf Pods && rm -rf Podfile.lock && cd ..

# Reinstall Pods
echo "📦 Installing Pods..."
cd ios && pod install --repo-update && cd ..

# Set development environment
export NODE_ENV=development

# Build with development optimizations
echo "📱 Building iOS app (development mode)..."
cd ios && xcodebuild \
  -workspace thekkabazar.xcworkspace \
  -scheme thekkabazar \
  -configuration Debug \
  -destination 'platform=iOS Simulator,name=iPhone 15,OS=latest' \
  -derivedDataPath build \
  -parallelizeTargets \
  -jobs $(sysctl -n hw.ncpu) \
  build && cd ..

echo "✅ iOS development build completed!"
echo "📁 App location: ios/build/Build/Products/Debug-iphonesimulator/thekkabazar.app" 