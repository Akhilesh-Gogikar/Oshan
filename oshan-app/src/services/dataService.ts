import { Stock } from '../types/models';
import { mockDataService } from './mockDataService';
import apiService from './apiService';
import { environment } from '../config/environment';

// Configuration for data source with platform-specific handling
const USE_MOCK_DATA = environment.isDevelopment || !environment.apiBaseUrl;

// API service wrapper with platform-specific error handling
class ApiDataService {
  private async handleApiCall<T>(apiCall: () => Promise<T>, fallback: T): Promise<T> {
    try {
      return await apiCall();
    } catch (error) {
      console.error('API Error:', error);
      
      // Platform-specific error handling
      if (environment.isNative) {
        // For mobile, provide more detailed error messages
        console.error('Mobile platform error:', error);
      } else if (environment.isWeb) {
        // For web, handle CORS and network issues
        console.error('Web platform error:', error);
      }
      
      return fallback;
    }
  }

  async getAllStocks(): Promise<Stock[]> {
    return this.handleApiCall(
      async () => {
        const response = await apiService.get('/stocks');
        return response.data;
      },
      []
    );
  }

  async getStockBySymbol(symbol: string): Promise<Stock | null> {
    return this.handleApiCall(
      async () => {
        const response = await apiService.get(`/stocks/${symbol}`);
        return response.data;
      },
      null
    );
  }

  async searchStocks(query: string): Promise<Stock[]> {
    return this.handleApiCall(
      async () => {
        const response = await apiService.get(
          `/stocks/search?q=${encodeURIComponent(query)}`
        );
        return response.data;
      },
      []
    );
  }

  async getWatchlist(): Promise<Stock[]> {
    return this.handleApiCall(
      async () => {
        const response = await apiService.get('/watchlist');
        return response.data;
      },
      []
    );
  }

  async addToWatchlist(symbol: string): Promise<boolean> {
    return this.handleApiCall(
      async () => {
        await apiService.post('/watchlist', { symbol });
        return true;
      },
      false
    );
  }

  async removeFromWatchlist(symbol: string): Promise<boolean> {
    return this.handleApiCall(
      async () => {
        await apiService.delete(`/watchlist/${symbol}`);
        return true;
      },
      false
    );
  }

  async getMarketData(symbol: string, period: string = '1d'): Promise<any> {
    return this.handleApiCall(
      async () => {
        const response = await apiService.get(
          `/market-data/${symbol}?period=${period}`
        );
        return response.data;
      },
      null
    );
  }

  async getStockNews(symbol: string): Promise<any[]> {
    return this.handleApiCall(
      async () => {
        const response = await apiService.get(`/news/${symbol}`);
        return response.data;
      },
      []
    );
  }
}

export class DataService {
  private service = USE_MOCK_DATA ? mockDataService : new ApiDataService();

  async getAllStocks(): Promise<Stock[]> {
    return await this.service.getAllStocks();
  }

  async getStockBySymbol(symbol: string): Promise<Stock | null> {
    return await this.service.getStockBySymbol(symbol);
  }

  async searchStocks(query: string): Promise<Stock[]> {
    return await this.service.searchStocks(query);
  }

  async getWatchlist(): Promise<Stock[]> {
    return await this.service.getWatchlist();
  }

  async addToWatchlist(symbol: string): Promise<boolean> {
    return await this.service.addToWatchlist(symbol);
  }

  async removeFromWatchlist(symbol: string): Promise<boolean> {
    return await this.service.removeFromWatchlist(symbol);
  }

  async getMarketData(symbol: string, period: string = '1d'): Promise<any> {
    return await this.service.getMarketData(symbol, period);
  }

  async getStockNews(symbol: string): Promise<any[]> {
    return await this.service.getStockNews(symbol);
  }
}

// Export singleton instance
export const dataService = new DataService();