import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Stock, AIInsight, NewsArticle } from '../types/models';

export const stockApi = createApi({
  reducerPath: 'stockApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.oshan.com/v1/',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
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