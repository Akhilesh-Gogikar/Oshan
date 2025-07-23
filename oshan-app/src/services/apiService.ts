import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Stock, AIInsight, NewsArticle, ChatMessage } from '../types/models';
import { environment, getApiUrl } from '../config/environment';

// Create axios instance with environment configuration
const apiService = axios.create({
  baseURL: getApiUrl(''),
  timeout: environment.network.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for platform-specific handling
apiService.interceptors.request.use(
  async (config) => {
    try {
      // Add authentication token if available
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Platform-specific CORS handling
      if (environment.cors.enabled) {
        config.withCredentials = environment.cors.credentials === 'include';
      }
      
      // Add platform identifier for server-side handling
      config.headers['X-Platform'] = environment.platform;
      
      // Handle mobile-specific network issues
      if (environment.isNative) {
        // Add retry configuration for mobile
        config.timeout = environment.network.timeout;
      }
      
    } catch (error) {
      console.error('Error in request interceptor:', error);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with platform-specific error handling
apiService.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle network errors with retry logic
    if (!error.response && environment.network.enableOfflineQueue) {
      console.error('Network error detected:', error.message);
      
      // Retry logic for mobile platforms
      if (environment.isNative && !originalRequest._retry) {
        originalRequest._retry = true;
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        try {
          return await apiService(originalRequest);
        } catch (retryError) {
          console.error('Retry failed:', retryError);
        }
      }
    }
    
    // Handle specific error cases
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Handle unauthorized access
          await AsyncStorage.removeItem('userToken');
          break;
        case 403:
          // Handle forbidden access
          console.error('Access forbidden:', data);
          break;
        case 404:
          // Handle not found
          console.error('Resource not found:', data);
          break;
        case 500:
          // Handle server errors
          console.error('Server error:', data);
          break;
        default:
          console.error('API Error:', data);
      }
      
      return Promise.reject({
        status,
        message: data?.message || 'An error occurred',
        data,
      });
    } else if (error.request) {
      // Network error
      return Promise.reject({
        status: 0,
        message: 'Network error - please check your connection',
        data: null,
      });
    } else {
      // Request setup error
      return Promise.reject({
        status: 0,
        message: error.message || 'Request setup error',
        data: null,
      });
    }
  }
);

// API Methods with platform-specific error handling
export const getStocks = async (): Promise<Stock[]> => {
  try {
    const response = await apiService.get('/stocks');
    return response.data;
  } catch (error) {
    console.error('Error fetching stocks:', error);
    throw error;
  }
};

export const getStock = async (id: string): Promise<Stock> => {
  try {
    const response = await apiService.get(`/stocks/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching stock ${id}:`, error);
    throw error;
  }
};

export const getInsights = async (): Promise<AIInsight[]> => {
  try {
    const response = await apiService.get('/insights');
    return response.data;
  } catch (error) {
    console.error('Error fetching insights:', error);
    throw error;
  }
};

export const getInsightsByStock = async (stockId: string): Promise<AIInsight[]> => {
  try {
    const response = await apiService.get(`/insights/stock/${stockId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching insights for stock ${stockId}:`, error);
    throw error;
  }
};

export const getNews = async (): Promise<NewsArticle[]> => {
  try {
    const response = await apiService.get('/news');
    return response.data;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

export const getNewsByStock = async (stockId: string): Promise<NewsArticle[]> => {
  try {
    const response = await apiService.get(`/news/stock/${stockId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching news for stock ${stockId}:`, error);
    throw error;
  }
};

export const sendChatMessage = async (messages: ChatMessage[]): Promise<any> => {
  try {
    const response = await apiService.post('/chat', { messages });
    return response.data;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
};

export default apiService;