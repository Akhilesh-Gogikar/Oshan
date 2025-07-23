import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Stock, AIInsight, NewsArticle } from '../types/models';

// Configure base URL based on platform and environment
const getBaseUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'web') {
      return process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';
    } else {
      return process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';
    }
  } else {
    return process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.oshan.com/api';
  }
};

export const stockApi = createApi({
  reducerPath: 'stockApi',
  baseQuery: fetchBaseQuery({
    baseUrl: getBaseUrl(),
    prepareHeaders: async (headers) => {
      headers.set('Content-Type', 'application/json');
      
      // Add authentication token if available
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
      } catch (error) {
        console.error('Error retrieving auth token:', error);
      }
      
      return headers;
    },
  }),
  tagTypes: ['Stock', 'Insights', 'News'],
  endpoints: (builder) => ({
    getStocks: builder.query<Stock[], void>({
      query: () => 'stocks',
      providesTags: ['Stock'],
    }),
    
    getStock: builder.query<Stock, string>({
      query: (id) => `stocks/${id}`,
      providesTags: ['Stock'],
    }),
    
    getInsights: builder.query<AIInsight[], void>({
      query: () => 'insights',
      providesTags: ['Insights'],
    }),
    
    getInsightsByStock: builder.query<AIInsight[], string>({
      query: (stockId) => `insights/stock/${stockId}`,
      providesTags: ['Insights'],
    }),
    
    getNews: builder.query<NewsArticle[], void>({
      query: () => 'news',
      providesTags: ['News'],
    }),
    
    getNewsByStock: builder.query<NewsArticle[], string>({
      query: (stockId) => `news/stock/${stockId}`,
      providesTags: ['News'],
    }),
  }),
});

export const {
  useGetStocksQuery,
  useGetStockQuery,
  useGetInsightsQuery,
  useGetInsightsByStockQuery,
  useGetNewsQuery,
  useGetNewsByStockQuery,
} = stockApi;