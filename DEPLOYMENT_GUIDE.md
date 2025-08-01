# 🚀 Production Deployment Guide

## 📋 Overview

This guide walks you through deploying ThekkabazarApp to production on both Google Play Store and Apple App Store.

## 🔧 Prerequisites

### Required Tools
- [ ] Node.js 18+ installed
- [ ] React Native CLI installed
- [ ] Android Studio (for Android builds)
- [ ] Xcode (for iOS builds, macOS only)
- [ ] Java Development Kit (JDK) 11+
- [ ] Git configured

### Required Accounts
- [ ] Google Play Console account
- [ ] Apple Developer account
- [ ] App Store Connect access

### Required Certificates
- [ ] Android signing keystore
- [ ] iOS distribution certificate
- [ ] iOS provisioning profile

## 🏗️ Build Configuration

### 1. Environment Setup

Create production environment variables:

```bash
# .env.production
API_BASE_URL=https://thekkabazar.com
ENABLE_LOGGING=false
ENABLE_DEBUG_MENU=false
ENABLE_CRASH_REPORTING=true
ENABLE_ANALYTICS=true
```

### 2. Android Configuration

Update `android/app/build.gradle`:

```gradle
android {
    defaultConfig {
        applicationId "com.thekkabazar"
        versionCode 21
        versionName "1.0.0"
        multiDexEnabled true
    }
    
    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro"
            debuggable false
            zipAlignEnabled true
        }
    }
}
```

### 3. iOS Configuration

Update `ios/thekkabazar/Info.plist`:

```xml
<key>CFBundleShortVersionString</key>
<string>1.0.0</string>
<key>CFBundleVersion</key>
<string>21</string>
```

## 🚀 Build Process

### Automated Build

Use the production build script:

```bash
# Full production build
./scripts/build-production.sh

# With bundle analysis
./scripts/build-production.sh --analyze

# With upload to distribution
./scripts/build-production.sh --upload
```

### Manual Build

#### Android

```bash
# Clean previous builds
cd android && ./gradlew clean && cd ..

# Build APK
npm run build:android

# Build App Bundle (for Play Store)
npm run build:android-bundle
```

#### iOS

```bash
# Clean previous builds
cd ios && xcodebuild clean && cd ..

# Build archive
npm run build:ios
```

## 📱 Google Play Store Deployment

### 1. Prepare App Bundle

```bash
# Generate signed app bundle
cd android
./gradlew bundleRelease
cd ..
```

The AAB file will be located at:
`android/app/build/outputs/bundle/release/app-release.aab`

### 2. Upload to Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Select your app
3. Go to "Production" track
4. Click "Create new release"
5. Upload the AAB file
6. Add release notes
7. Review and roll out

### 3. Release Checklist

- [ ] App bundle uploaded successfully
- [ ] Release notes added
- [ ] Content rating questionnaire completed
- [ ] Privacy policy URL provided
- [ ] App signing by Google Play enabled
- [ ] Release reviewed and approved

## 🍎 Apple App Store Deployment

### 1. Prepare Archive

```bash
# Generate archive
cd ios
xcodebuild archive -workspace thekkabazar.xcworkspace -scheme thekkabazar -configuration Release -destination generic/platform=iOS -archivePath thekkabazar.xcarchive
cd ..
```

### 2. Upload to App Store Connect

1. Open Xcode
2. Go to Window > Organizer
3. Select your archive
4. Click "Distribute App"
5. Choose "App Store Connect"
6. Follow the upload process

### 3. Release Checklist

- [ ] Archive uploaded successfully
- [ ] App Store Connect listing completed
- [ ] Privacy policy URL provided
- [ ] App review information completed
- [ ] Export compliance information provided
- [ ] App submitted for review

## 🔍 Post-Deployment Monitoring

### 1. Crash Reporting

Monitor crashes using your crash reporting service:

```javascript
// Example: Sentry configuration
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: 'production',
});
```

### 2. Analytics

Track user engagement and app performance:

```javascript
// Example: Firebase Analytics
import analytics from '@react-native-firebase/analytics';

analytics().logEvent('app_opened', {
  timestamp: new Date().toISOString(),
});
```

### 3. Performance Monitoring

Monitor app performance metrics:

- App launch time
- Memory usage
- Network request performance
- User engagement metrics

## 🛠️ Troubleshooting

### Common Issues

#### Build Failures

```bash
# Clean all builds
npm run clean

# Clear Metro cache
npx react-native start --reset-cache

# Clear Gradle cache
cd android && ./gradlew clean && cd ..
```

#### ProGuard Issues

If you encounter ProGuard-related crashes:

1. Check ProGuard rules in `android/app/proguard-rules.pro`
2. Add keep rules for problematic classes
3. Test thoroughly on release builds

#### iOS Archive Issues

```bash
# Clean Xcode build folder
cd ios
xcodebuild clean -workspace thekkabazar.xcworkspace -scheme thekkabazar
cd ..

# Reset iOS simulator
xcrun simctl erase all
```

### Performance Issues

#### Bundle Size Optimization

```bash
# Analyze bundle size
npm run analyze

# Remove unused dependencies
npm prune
```

#### Memory Leaks

- Use React DevTools for memory profiling
- Monitor memory usage in production
- Implement proper cleanup in components

## 📊 Monitoring & Alerts

### 1. Set Up Alerts

Configure alerts for:
- High crash rates
- Performance degradation
- API failures
- User engagement drops

### 2. Key Metrics to Track

- Daily/Monthly Active Users
- Crash-free user rate
- App launch time
- API response times
- User retention rate

### 3. Error Tracking

Monitor and categorize errors:
- Network errors
- Authentication errors
- UI/UX errors
- API errors

## 🔄 Rollback Plan

### 1. Emergency Rollback

If critical issues are discovered:

1. **Google Play Store**: Use staged rollouts or rollback to previous version
2. **Apple App Store**: Submit expedited review for bug fix

### 2. Hot Fixes

For minor issues:
- Use over-the-air updates (if configured)
- Submit patch releases

### 3. Communication Plan

- Notify users of issues
- Provide status updates
- Communicate fix timeline

## 📞 Support & Contacts

### Development Team
- **Lead Developer**: [Contact Info]
- **QA Lead**: [Contact Info]
- **DevOps Engineer**: [Contact Info]

### App Store Support
- **Google Play Support**: [Contact Info]
- **Apple Developer Support**: [Contact Info]

### Emergency Contacts
- **On-Call Developer**: [Contact Info]
- **System Administrator**: [Contact Info]

## 📝 Release Notes Template

### Version 1.0.0
**Release Date**: [Date]

#### 🆕 New Features
- Initial release of ThekkabazarApp
- User authentication and registration
- Product browsing and search
- Category and subcategory navigation
- Product details and supplier information

#### 🔧 Technical Features
- Responsive design for all screen sizes
- Offline functionality
- Push notifications
- Image optimization
- Performance optimizations

#### 📱 Platform Support
- Android 6.0+ (API level 23+)
- iOS 12.0+

---

**Next Release**: [Planned Date]
**Support**: [Support Contact] 