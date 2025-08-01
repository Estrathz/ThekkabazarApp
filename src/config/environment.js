// Environment configuration for production
const ENV = {
  development: {
    API_BASE_URL: 'https://thekkabazar.com',
    ENABLE_LOGGING: true,
    ENABLE_DEBUG_MENU: true,
    ENABLE_CRASH_REPORTING: false,
    ENABLE_ANALYTICS: false,
    BUNDLE_ID: 'com.thekkabazar.dev',
  },
  staging: {
    API_BASE_URL: 'https://staging.thekkabazar.com',
    ENABLE_LOGGING: true,
    ENABLE_DEBUG_MENU: false,
    ENABLE_CRASH_REPORTING: true,
    ENABLE_ANALYTICS: true,
    BUNDLE_ID: 'com.thekkabazar.staging',
  },
  production: {
    API_BASE_URL: 'https://thekkabazar.com',
    ENABLE_LOGGING: false,
    ENABLE_DEBUG_MENU: false,
    ENABLE_CRASH_REPORTING: true,
    ENABLE_ANALYTICS: true,
    BUNDLE_ID: 'com.thekkabazar',
  },
};

// Get current environment
const getEnvironment = () => {
  if (__DEV__) {
    return 'development';
  }
  
  // You can set this via build configuration
  const buildConfig = process.env.BUILD_ENV || 'production';
  return buildConfig;
};

// Export current environment config
export const config = ENV[getEnvironment()];

// Environment helpers
export const isDevelopment = () => getEnvironment() === 'development';
export const isStaging = () => getEnvironment() === 'staging';
export const isProduction = () => getEnvironment() === 'production';

// API configuration
export const API_CONFIG = {
  baseURL: config.API_BASE_URL,
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
};

// Logging configuration
export const LOGGING_CONFIG = {
  enabled: config.ENABLE_LOGGING,
  level: isProduction() ? 'error' : 'debug',
  maxLogs: isProduction() ? 100 : 1000,
};

// Analytics configuration
export const ANALYTICS_CONFIG = {
  enabled: config.ENABLE_ANALYTICS,
  trackingId: isProduction() ? 'PROD_TRACKING_ID' : 'DEV_TRACKING_ID',
};

// Crash reporting configuration
export const CRASH_REPORTING_CONFIG = {
  enabled: config.ENABLE_CRASH_REPORTING,
  dsn: isProduction() ? 'PROD_DSN' : 'DEV_DSN',
};

export default config; 