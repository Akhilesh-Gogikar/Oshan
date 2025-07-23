import { Platform, Linking } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { environment } from '../config/environment';

// Platform-specific utilities
export const platformUtils = {
  // URL handling
  openUrl: async (url: string): Promise<void> => {
    if (environment.isWeb) {
      // Web: use window.open or Linking
      window.open(url, '_blank');
    } else {
      // Native: use WebBrowser for better UX
      try {
        await WebBrowser.openBrowserAsync(url);
      } catch (error) {
        // Fallback to Linking
        await Linking.openURL(url);
      }
    }
  },

  // Deep linking
  canOpenUrl: async (url: string): Promise<boolean> => {
    if (environment.isWeb) {
      return true; // Web can always open URLs
    }
    return await Linking.canOpenURL(url);
  },

  // Storage helpers
  storage: {
    // Platform-specific storage keys
    getKey: (key: string): string => {
      return `${environment.storage.prefix}${key}`;
    },

    // Check if secure storage is available
    isSecureStorageAvailable: (): boolean => {
      return environment.storage.useSecureStorage;
    },
  },

  // Network helpers
  network: {
    // Check if device is online
    isOnline: (): boolean => {
      if (environment.isWeb) {
        return navigator.onLine;
      }
      // For native, this would require NetInfo or similar
      return true; // Assume online for now
    },

    // Get network type
    getNetworkType: (): string => {
      if (environment.isWeb) {
        // Type assertion for web navigator
        const nav = navigator as any;
        return nav.connection?.effectiveType || 'unknown';
      }
      return 'unknown'; // Would need NetInfo for native
    },
  },

  // Device info
  device: {
    getPlatform: (): string => environment.platform,
    isIOS: (): boolean => Platform.OS === 'ios',
    isAndroid: (): boolean => Platform.OS === 'android',
    isWeb: (): boolean => environment.isWeb,
    isNative: (): boolean => environment.isNative,
  },

  // Performance helpers
  performance: {
    // Platform-specific performance optimizations
    shouldUseLazyLoading: (): boolean => {
      return environment.isNative; // Native apps benefit more from lazy loading
    },

    shouldCacheImages: (): boolean => {
      return environment.isNative; // Native apps can cache images better
    },
  },

  // UI helpers
  ui: {
    // Platform-specific UI adjustments
    getStatusBarHeight: (): number => {
      if (environment.isWeb) return 0;
      // Would need StatusBar from expo-status-bar for native
      return 0;
    },

    // Safe area insets
    getSafeAreaInsets: () => {
      if (environment.isWeb) {
        return { top: 0, bottom: 0, left: 0, right: 0 };
      }
      // Would need SafeAreaContext for native
      return { top: 0, bottom: 0, left: 0, right: 0 };
    },
  },

  // Error handling
  error: {
    // Platform-specific error messages
    getNetworkErrorMessage: (): string => {
      if (environment.isNative) {
        return 'Please check your internet connection and try again.';
      }
      return 'Please check your internet connection.';
    },

    getServerErrorMessage: (): string => {
      return 'Something went wrong. Please try again later.';
    },
  },

  // Analytics helpers
  analytics: {
    // Platform-specific event tracking
    trackEvent: (eventName: string, properties?: Record<string, any>) => {
      if (environment.isDevelopment) {
        console.log('Analytics Event:', eventName, properties);
      }
      // Would integrate with actual analytics service
    },
  },
};

// Export individual helpers for convenience
export const {
  openUrl,
  canOpenUrl,
  storage,
  network,
  device,
  performance,
  ui,
  error,
  analytics,
} = platformUtils;