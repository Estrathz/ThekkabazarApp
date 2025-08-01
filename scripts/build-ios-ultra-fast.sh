#!/bin/bash

echo "⚡ Starting ULTRA-FAST iOS build..."

# Quick clean (skip deep cleaning for speed)
echo "🧹 Quick clean..."
cd ios && rm -rf build && cd ..

# Set ultra-fast environment
export NODE_ENV=development
export FAST_BUILD=true

# Skip Pod reinstall if not needed
if [ ! -d "ios/Pods" ]; then
    echo "📦 Installing Pods (first time only)..."
    cd ios && pod install --repo-update && cd ..
else
    echo "📦 Pods already installed, skipping..."
fi

# Ultra-fast build with minimal optimizations
echo "🚀 Building iOS app (ULTRA-FAST mode)..."
cd ios && xcodebuild \
  -workspace thekkabazar.xcworkspace \
  -scheme thekkabazar \
  -configuration Debug \
  -destination 'platform=iOS Simulator,name=iPhone 15,OS=latest' \
  -derivedDataPath build \
  -parallelizeTargets \
  -jobs $(sysctl -n hw.ncpu) \
  GCC_OPTIMIZATION_LEVEL=0 \
  SWIFT_OPTIMIZATION_LEVEL=-Onone \
  SWIFT_COMPILATION_MODE=singlefile \
  ENABLE_BITCODE=NO \
  COMPILER_INDEX_STORE_ENABLE=NO \
  SWIFT_INDEX_STORE_ENABLE=NO \
  build && cd ..

echo "✅ ULTRA-FAST iOS build completed!"
echo "📁 App location: ios/build/Build/Products/Debug-iphonesimulator/thekkabazar.app" 