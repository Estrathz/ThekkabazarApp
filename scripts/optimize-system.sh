#!/bin/bash

echo "⚡ Optimizing system for ultra-fast builds..."

# Check system specs
echo "🖥️ System Information:"
echo "CPU Cores: $(sysctl -n hw.ncpu)"
echo "Memory: $(sysctl -n hw.memsize | awk '{print $0/1024/1024/1024 " GB"}')"
echo "Disk: $(df -h . | tail -1 | awk '{print $4 " available"}')"

# Optimize system settings for builds
echo "🔧 Optimizing system settings..."

# Increase file descriptor limits
ulimit -n 65536 2>/dev/null || echo "Could not increase file descriptors"

# Set environment variables for faster builds
export FAST_BUILD=true
export SWIFT_OPTIMIZATION_LEVEL=-Onone
export GCC_OPTIMIZATION_LEVEL=0
export ENABLE_BITCODE=NO
export COMPILER_INDEX_STORE_ENABLE=NO

# Clear system caches
echo "🧹 Clearing system caches..."
sudo purge 2>/dev/null || echo "Could not clear system caches"

# Optimize Xcode derived data
echo "📱 Optimizing Xcode derived data..."
rm -rf ~/Library/Developer/Xcode/DerivedData/* 2>/dev/null || echo "Could not clear derived data"

# Optimize CocoaPods cache
echo "📦 Optimizing CocoaPods cache..."
rm -rf ~/Library/Caches/CocoaPods 2>/dev/null || echo "Could not clear CocoaPods cache"

# Optimize npm cache
echo "📦 Optimizing npm cache..."
npm cache clean --force 2>/dev/null || echo "Could not clear npm cache"

# Optimize yarn cache
echo "🧶 Optimizing yarn cache..."
yarn cache clean 2>/dev/null || echo "Could not clear yarn cache"

echo "✅ System optimization completed!"
echo "🚀 Your system is now optimized for ultra-fast builds!" 