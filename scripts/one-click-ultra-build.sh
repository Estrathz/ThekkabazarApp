#!/bin/bash

echo "🚀 ONE-CLICK ULTRA-FAST BUILD STARTING..."
echo "=========================================="

# Step 1: System Optimization
echo "1️⃣ Optimizing system..."
./scripts/optimize-system.sh

# Step 2: Metro Optimization
echo "2️⃣ Optimizing Metro bundler..."
./scripts/optimize-metro.sh

# Step 3: Clean iOS
echo "3️⃣ Cleaning iOS build artifacts..."
cd ios && rm -rf build && cd ..

# Step 4: Ultra-Fast iOS Build
echo "4️⃣ Starting ULTRA-FAST iOS build..."
./scripts/build-ios-ultra-fast.sh

echo "=========================================="
echo "✅ ONE-CLICK ULTRA-FAST BUILD COMPLETED!"
echo "📱 Your app should now be ready in: ios/build/Build/Products/Debug-iphonesimulator/thekkabazar.app" 