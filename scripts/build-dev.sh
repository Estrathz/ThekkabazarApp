#!/bin/bash

echo "🚀 Starting fast development build..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
cd android && ./gradlew clean && cd ..

# Set development environment
export NODE_ENV=development

# Build with development optimizations
echo "📱 Building Android APK (development mode)..."
cd android && ./gradlew assembleDebug && cd ..

echo "✅ Development build completed!"
echo "📁 APK location: android/app/build/outputs/apk/debug/app-debug.apk" 