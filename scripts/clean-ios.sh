#!/bin/bash

echo "🧹 Cleaning iOS build artifacts..."

# Clean Xcode build
echo "📱 Cleaning Xcode build..."
cd ios && xcodebuild clean -workspace thekkabazar.xcworkspace -scheme thekkabazar && cd ..

# Clean derived data
echo "🗂️ Cleaning derived data..."
rm -rf ~/Library/Developer/Xcode/DerivedData/*

# Clean Pods
echo "📦 Cleaning Pods..."
cd ios && rm -rf Pods && rm -rf Podfile.lock && cd ..

# Clean build folders
echo "📁 Cleaning build folders..."
rm -rf ios/build
rm -rf ios/thekkabazar.xcarchive

# Clean Metro cache
echo "🚇 Cleaning Metro cache..."
npx react-native start --reset-cache --reset-cache

echo "✅ iOS cleaning completed!" 