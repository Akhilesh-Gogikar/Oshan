import { Platform } from 'react-native';

// Environment configuration for cross-platform compatibility
export const environment = {
  // API Configuration
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
  
  // Web-specific configuration
  isWeb: Platform.OS === 'web',
  isNative: Platform.OS !== 'web',
  
  // Platform-specific settings
  platform: Platform.OS,
  
  // Development flags
  isDevelopment: __DEV__,
  
  // Google Sign-In configuration
  googleClientIds: {
    android: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
    ios: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
    web: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
  },
  
  // Storage configuration
  storage: {
    prefix: 'oshan_',
    useSecureStorage: Platform.OS !== 'web',
  },
  
  // Network configuration
  network: {
    timeout: 30000,
    retries: 3,
    enableOfflineQueue: true,
  },
  
  // CORS configuration for web
  cors: {
    enabled: Platform.OS === 'web',
    credentials: 'include',
  },
};

// Helper function to get platform-specific API URL
export const getApiUrl = (endpoint: string): string => {
  const baseUrl = environment.apiBaseUrl;
  return `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

// Helper function to check if running in development
export const isDevelopment = (): boolean => environment.isDevelopment;

// Helper function to check platform
export const isWeb = (): boolean => environment.isWeb;
export const isNative = (): boolean => environment.isNative;