import { Dimensions, PixelRatio, Platform, StatusBar } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Enhanced device detection
const isTablet = SCREEN_WIDTH >= 768;
const isSmallPhone = SCREEN_WIDTH < 375;
const isLargePhone = SCREEN_WIDTH >= 414;
const isLandscape = SCREEN_WIDTH > SCREEN_HEIGHT;

// Platform detection
const isIOS = Platform.OS === 'ios';
const isAndroid = Platform.OS === 'android';

// Status bar height
const statusBarHeight = StatusBar.currentHeight || 0;

// Base dimensions (design based on iPhone 11: 414x896)
const BASE_WIDTH = 414;
const BASE_HEIGHT = 896;

// Responsive scaling functions with performance optimization
export const wp = (percentage) => {
  const value = (percentage * SCREEN_WIDTH) / 100;
  return Math.round(PixelRatio.roundToNearestPixel(value));
};

export const hp = (percentage) => {
  const value = (percentage * SCREEN_HEIGHT) / 100;
  return Math.round(PixelRatio.roundToNearestPixel(value));
};

// Enhanced font scaling with accessibility support
export const normalize = (size) => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  let newSize = size * scale;
  
  // Apply device-specific adjustments
  if (isTablet) {
    newSize *= 1.1; // Slightly larger on tablets
  } else if (isSmallPhone) {
    newSize *= 0.9; // Slightly smaller on small phones
  }
  
  // Ensure minimum readable size
  const minSize = 12;
  const maxSize = 32;
  
  newSize = Math.max(minSize, Math.min(maxSize, newSize));
  
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Responsive spacing with device optimization
export const spacing = {
  xs: wp(1),
  sm: wp(2),
  md: wp(4),
  lg: wp(6),
  xl: wp(8),
  xxl: wp(10),
  xxxl: wp(12),
};

// Enhanced device info
export const deviceInfo = {
  isTablet,
  isSmallPhone,
  isLargePhone,
  isLandscape,
  isIOS,
  isAndroid,
  platform: Platform.OS,
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  statusBarHeight,
  pixelRatio: PixelRatio.get(),
  fontScale: PixelRatio.getFontScale(),
};

// Grid columns based on device and orientation
export const getGridColumns = () => {
  if (isTablet) {
    return isLandscape ? 5 : 4;
  }
  if (isLargePhone) {
    return isLandscape ? 4 : 3;
  }
  return isLandscape ? 3 : 2;
};

// Responsive image dimensions
export const getImageDimensions = (baseWidth, baseHeight) => {
  const aspectRatio = baseHeight / baseWidth;
  const maxWidth = isTablet ? wp(30) : wp(40);
  const calculatedHeight = maxWidth * aspectRatio;
  
  return {
    width: maxWidth,
    height: calculatedHeight,
  };
};

// Safe area calculations
export const getSafeAreaInsets = () => {
  const topInset = isIOS ? 44 : statusBarHeight;
  const bottomInset = isIOS ? 34 : 0;
  
  return {
    top: topInset,
    bottom: bottomInset,
    left: 0,
    right: 0,
  };
};

// Responsive padding/margin helpers
export const responsivePadding = {
  screen: {
    horizontal: isTablet ? wp(8) : wp(4),
    vertical: hp(2),
  },
  card: {
    horizontal: isTablet ? wp(4) : wp(3),
    vertical: hp(1.5),
  },
  button: {
    horizontal: isTablet ? wp(6) : wp(4),
    vertical: hp(1.2),
  },
};

// Responsive font sizes
export const fontSizes = {
  xs: normalize(10),
  sm: normalize(12),
  md: normalize(14),
  lg: normalize(16),
  xl: normalize(18),
  xxl: normalize(20),
  xxxl: normalize(24),
  title: normalize(28),
  largeTitle: normalize(32),
};

// Responsive border radius
export const borderRadius = {
  xs: wp(1),
  sm: wp(2),
  md: wp(3),
  lg: wp(4),
  xl: wp(6),
  xxl: wp(8),
  round: wp(50), // For circular elements
};

// Performance optimization: Memoized calculations
let cachedDimensions = null;

export const getCachedDimensions = () => {
  if (!cachedDimensions) {
    cachedDimensions = {
      screenWidth: SCREEN_WIDTH,
      screenHeight: SCREEN_HEIGHT,
      isTablet,
      isLandscape,
    };
  }
  return cachedDimensions;
};

// Orientation change handler
export const handleOrientationChange = (callback) => {
  const subscription = Dimensions.addEventListener('change', ({ window }) => {
    const { width, height } = window;
    const newIsLandscape = width > height;
    
    if (newIsLandscape !== isLandscape) {
      callback({
        width,
        height,
        isLandscape: newIsLandscape,
        isTablet: width >= 768,
      });
    }
  });
  
  return subscription;
};

// Responsive breakpoints
export const breakpoints = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  largeDesktop: 1200,
};

// Check if current screen size matches breakpoint
export const isBreakpoint = (breakpoint) => {
  return SCREEN_WIDTH >= breakpoints[breakpoint];
};

// Responsive value selector
export const responsiveValue = (mobile, tablet, desktop = tablet) => {
  if (isTablet) {
    return desktop;
  }
  return mobile;
};

// Export all utilities
export default {
  wp,
  hp,
  normalize,
  spacing,
  deviceInfo,
  getGridColumns,
  getImageDimensions,
  getSafeAreaInsets,
  responsivePadding,
  fontSizes,
  borderRadius,
  getCachedDimensions,
  handleOrientationChange,
  breakpoints,
  isBreakpoint,
  responsiveValue,
}; 