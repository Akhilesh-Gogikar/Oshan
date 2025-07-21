import axios from 'axios';
import { Stock, AIInsight, NewsArticle, ChatMessage } from '../types/models';

const API_BASE_URL = process.env.API_BASE_URL;

const apiService = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
apiService.interceptors.request.use(
  (config) => {
    // Add authentication token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
apiService.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('API Error:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network Error:', error.request);
      return Promise.reject({ error: 'Network error' });
    } else {
      // Something happened in setting up the request
      console.error('Request Error:', error.message);
      return Promise.reject({ error: error.message });
    }
  }
);

// API Methods
export const getStocks = async (): Promise<Stock[]> => {
  const response = await apiService.get('/stocks');
  return response.data;
};

export const getStock = async (id: string): Promise<Stock> => {
  const response = await apiService.get(`/stocks/${id}`);
  return response.data;
};

export const getInsights = async (): Promise<AIInsight[]> => {
  const response = await apiService.get('/insights');
  return response.data;
};

export const getInsightsByStock = async (stockId: string): Promise<AIInsight[]> => {
  const response = await apiService.get(`/insights/stock/${stockId}`);
  return response.data;
};

export const getNews = async (): Promise<NewsArticle[]> => {
  const response = await apiService.get('/news');
  return response.data;
};

export const getNewsByStock = async (stockId: string): Promise<NewsArticle[]> => {
  const response = await apiService.get(`/news/stock/${stockId}`);
  return response.data;
};

export const sendChatMessage = async (messages: ChatMessage[]): Promise<any> => {
  const response = await apiService.post('/chat', { messages });
  return response.data;
};

export default apiService;