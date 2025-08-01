import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Device types
const isTablet = SCREEN_WIDTH >= 768;
const isSmallPhone = SCREEN_WIDTH < 375;
const isLargePhone = SCREEN_WIDTH >= 414;

// Base dimensions (design based on iPhone 11: 414x896)
const BASE_WIDTH = 414;
const BASE_HEIGHT = 896;

// Responsive scaling functions
export const wp = (percentage) => {
  const value = (percentage * SCREEN_WIDTH) / 100;
  return Math.round(PixelRatio.roundToNearestPixel(value));
};

export const hp = (percentage) => {
  const value = (percentage * SCREEN_HEIGHT) / 100;
  return Math.round(PixelRatio.roundToNearestPixel(value));
};

// Font scaling with accessibility support
export const normalize = (size) => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scale;
  
  if (isTablet) {
    return Math.round(PixelRatio.roundToNearestPixel(newSize * 1.1));
  }
  
  if (isSmallPhone) {
    return Math.round(PixelRatio.roundToNearestPixel(newSize * 0.9));
  }
  
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Responsive spacing
export const spacing = {
  xs: wp(1),
  sm: wp(2),
  md: wp(4),
  lg: wp(6),
  xl: wp(8),
  xxl: wp(10),
};

// Device info
export const deviceInfo = {
  isTablet,
  isSmallPhone,
  isLargePhone,
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
};

// Grid columns based on device
export const getGridColumns = () => {
  if (isTablet) return 4;
  if (isLargePhone) return 3;
  return 2;
}; 