/**
 * API Compatibility Layer
 * 
 * This file provides a unified interface for handling cross-platform API calls
 * with proper error handling, retry logic, and platform-specific optimizations.
 */

import { environment } from '../config/environment';
import { platformUtils } from '../utils/platformUtils';
import apiService from './apiService';
import { dataService } from './dataService';

// API compatibility configuration
export const apiConfig = {
  // Retry configuration
  retry: {
    maxRetries: environment.network.retries,
    retryDelay: 1000,
    exponentialBackoff: true,
  },

  // Timeout configuration
  timeout: environment.network.timeout,

  // Cache configuration
  cache: {
    enabled: !environment.isDevelopment,
    ttl: 5 * 60 * 1000, // 5 minutes
  },

  // Offline handling
  offline: {
    queueRequests: environment.network.enableOfflineQueue,
    maxQueueSize: 50,
  },
};

// API compatibility utilities
export const apiCompatibility = {
  // Unified error handler
  handleError: (error: any, context: string) => {
    console.error(`API Error in ${context}:`, error);

    // Platform-specific error handling
    if (environment.isNative) {
      // Native apps might want to show native alerts
      console.error('Native platform error:', error);
    } else if (environment.isWeb) {
      // Web apps might want to show toast notifications
      console.error('Web platform error:', error);
    }

    return {
      error: true,
      message: error.message || platformUtils.error.getNetworkErrorMessage(),
      code: error.status || 0,
    };
  },

  // Retry wrapper for API calls
  withRetry: async <T>(
    apiCall: () => Promise<T>,
    maxRetries = apiConfig.retry.maxRetries
  ): Promise<T> => {
    let lastError: any;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await apiCall();
      } catch (error) {
        lastError = error;

        if (attempt === maxRetries) {
          throw error;
        }

        // Calculate delay with exponential backoff
        const delay = apiConfig.retry.exponentialBackoff
          ? apiConfig.retry.retryDelay * Math.pow(2, attempt)
          : apiConfig.retry.retryDelay;

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  },

  // Platform-specific request configuration
  getRequestConfig: () => {
    const config: any = {
      timeout: apiConfig.timeout,
    };

    // Platform-specific headers
    config.headers = {
      'X-Platform': environment.platform,
      'X-Version': process.env.npm_package_version || '1.0.0',
    };

    // CORS handling for web
    if (environment.cors.enabled) {
      config.withCredentials = environment.cors.credentials === 'include';
    }

    return config;
  },

  // Cache key generator
  getCacheKey: (endpoint: string, params?: any): string => {
    const key = `${environment.platform}_${endpoint}`;
    if (params) {
      return `${key}_${JSON.stringify(params)}`;
    }
    return key;
  },

  // Check if request should use cache
  shouldUseCache: (endpoint: string): boolean => {
    // Skip cache for certain endpoints
    const skipCache = ['/auth', '/real-time', '/live'];
    return apiConfig.cache.enabled && !skipCache.some(skip => endpoint.includes(skip));
  },

  // Validate API response
  validateResponse: (response: any, expectedType?: string): boolean => {
    if (!response) return false;
    
    if (expectedType) {
      // Basic type checking
      if (expectedType === 'array' && !Array.isArray(response)) return false;
      if (expectedType === 'object' && typeof response !== 'object') return false;
    }

    return true;
  },

  // Get appropriate service based on environment
  getService: () => {
    return dataService;
  },

  // Health check for API connectivity
  checkHealth: async (): Promise<boolean> => {
    try {
      await apiService.get('/health');
      return true;
    } catch (error) {
      console.error('API health check failed:', error);
      return false;
    }
  },

  // Get API status
  getApiStatus: async (): Promise<{
    online: boolean;
    latency?: number;
    platform: string;
  }> => {
    const start = Date.now();
    
    try {
      await apiService.get('/health');
      const latency = Date.now() - start;
      
      return {
        online: true,
        latency,
        platform: environment.platform,
      };
    } catch (error) {
      return {
        online: false,
        platform: environment.platform,
      };
    }
  },
};

// Export configuration and utilities
export default apiCompatibility;