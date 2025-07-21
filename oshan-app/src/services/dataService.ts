import { Stock } from '../types/models';
import { mockDataService } from './mockDataService';
import { apiService } from './apiService';

// Configuration for data source
const USE_MOCK_DATA = process.env.NODE_ENV === 'development' || !process.env.REACT_APP_API_URL;

export class DataService {
  private service = USE_MOCK_DATA ? mockDataService : apiService;

  async getAllStocks(): Promise<Stock[]> {
    try {
      return await this.service.getAllStocks();
    } catch (error) {
      console.error('Error fetching stocks:', error);
      return [];
    }
  }

  async getStockBySymbol(symbol: string): Promise<Stock | null> {
    try {
      return await this.service.getStockBySymbol(symbol);
    } catch (error) {
      console.error(`Error fetching stock ${symbol}:`, error);
      return null;
    }
  }

  async searchStocks(query: string): Promise<Stock[]> {
    try {
      return await this.service.searchStocks(query);
    } catch (error) {
      console.error('Error searching stocks:', error);
      return [];
    }
  }

  async getWatchlist(): Promise<Stock[]> {
    try {
      return await this.service.getWatchlist();
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      return [];
    }
  }

  async addToWatchlist(symbol: string): Promise<boolean> {
    try {
      return await this.service.addToWatchlist(symbol);
    } catch (error) {
      console.error(`Error adding ${symbol} to watchlist:`, error);
      return false;
    }
  }

  async removeFromWatchlist(symbol: string): Promise<boolean> {
    try {
      return await this.service.removeFromWatchlist(symbol);
    } catch (error) {
      console.error(`Error removing ${symbol} from watchlist:`, error);
      return false;
    }
  }

  async getMarketData(symbol: string, period: string = '1d'): Promise<any> {
    try {
      return await this.service.getMarketData(symbol, period);
    } catch (error) {
      console.error(`Error fetching market data for ${symbol}:`, error);
      return null;
    }
  }

  async getStockNews(symbol: string): Promise<any[]> {
    try {
      return await this.service.getStockNews(symbol);
    } catch (error) {
      console.error(`Error fetching news for ${symbol}:`, error);
      return [];
    }
  }
}

// Export singleton instance
export const dataService = new DataService();