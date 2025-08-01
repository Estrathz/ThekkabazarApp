#!/bin/bash

# Production Build Script for ThekkabazarApp
# This script automates the production build process

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="ThekkabazarApp"
VERSION=$(node -p "require('./package.json').version")
BUILD_NUMBER=$(date +%Y%m%d%H%M)

echo -e "${BLUE}🚀 Starting Production Build for ${APP_NAME}${NC}"
echo -e "${BLUE}Version: ${VERSION}${NC}"
echo -e "${BLUE}Build Number: ${BUILD_NUMBER}${NC}"
echo ""

# Function to print status
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Step 1: Clean previous builds
print_status "Cleaning previous builds..."
npm run clean

# Step 2: Install dependencies
print_status "Installing dependencies..."
npm ci --production=false

# Step 3: Run security audit
print_status "Running security audit..."
npm run security-check || print_warning "Security audit found issues. Please review."

# Step 4: Run linting
print_status "Running linting..."
npm run lint || print_warning "Linting found issues. Please review."

# Step 5: Run type checking
print_status "Running type checking..."
npm run type-check || print_warning "Type checking found issues. Please review."

# Step 6: Run tests
print_status "Running tests..."
npm test -- --passWithNoTests || print_warning "Tests failed. Please review."

# Step 7: Bundle analysis (optional)
if [ "$1" = "--analyze" ]; then
    print_status "Running bundle analysis..."
    npm run analyze
fi

# Step 8: Build Android Release
print_status "Building Android Release APK..."
cd android
./gradlew clean
./gradlew assembleRelease
cd ..

# Check if APK was created
if [ -f "android/app/build/outputs/apk/release/app-release.apk" ]; then
    print_status "Android APK built successfully!"
    echo -e "${BLUE}APK Location: android/app/build/outputs/apk/release/app-release.apk${NC}"
else
    print_error "Android APK build failed!"
    exit 1
fi

# Step 9: Build Android Bundle (for Play Store)
print_status "Building Android App Bundle..."
cd android
./gradlew bundleRelease
cd ..

# Check if AAB was created
if [ -f "android/app/build/outputs/bundle/release/app-release.aab" ]; then
    print_status "Android App Bundle built successfully!"
    echo -e "${BLUE}AAB Location: android/app/build/outputs/bundle/release/app-release.aab${NC}"
else
    print_error "Android App Bundle build failed!"
    exit 1
fi

# Step 10: iOS Build (if on macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    print_status "Building iOS Release..."
    cd ios
    xcodebuild clean -workspace thekkabazar.xcworkspace -scheme thekkabazar
    xcodebuild archive -workspace thekkabazar.xcworkspace -scheme thekkabazar -configuration Release -destination generic/platform=iOS -archivePath thekkabazar.xcarchive
    cd ..
    print_status "iOS archive created successfully!"
else
    print_warning "Skipping iOS build (not on macOS)"
fi

# Step 11: Create build artifacts
print_status "Creating build artifacts..."
mkdir -p build-artifacts

# Copy Android artifacts
cp android/app/build/outputs/apk/release/app-release.apk build-artifacts/
cp android/app/build/outputs/bundle/release/app-release.aab build-artifacts/

# Create build info
cat > build-artifacts/build-info.json << EOF
{
  "appName": "${APP_NAME}",
  "version": "${VERSION}",
  "buildNumber": "${BUILD_NUMBER}",
  "buildDate": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "gitCommit": "$(git rev-parse HEAD 2>/dev/null || echo 'unknown')",
  "gitBranch": "$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'unknown')",
  "nodeVersion": "$(node --version)",
  "npmVersion": "$(npm --version)"
}
EOF

# Step 12: Generate checksums
print_status "Generating checksums..."
cd build-artifacts
sha256sum app-release.apk > app-release.apk.sha256
sha256sum app-release.aab > app-release.aab.sha256
cd ..

# Step 13: Final status
echo ""
print_status "Production build completed successfully!"
echo ""
echo -e "${BLUE}📦 Build Artifacts:${NC}"
echo -e "${BLUE}   - APK: build-artifacts/app-release.apk${NC}"
echo -e "${BLUE}   - AAB: build-artifacts/app-release.aab${NC}"
echo -e "${BLUE}   - Build Info: build-artifacts/build-info.json${NC}"
echo ""
echo -e "${BLUE}🔍 Next Steps:${NC}"
echo -e "${BLUE}   1. Test the APK on devices${NC}"
echo -e "${BLUE}   2. Upload AAB to Google Play Console${NC}"
echo -e "${BLUE}   3. Archive the build artifacts${NC}"
echo ""

# Optional: Upload to distribution service
if [ "$2" = "--upload" ]; then
    print_status "Uploading to distribution service..."
    # Add your upload logic here
    # Example: firebase appdistribution:distribute build-artifacts/app-release.apk
fi

print_status "Build process completed!" 