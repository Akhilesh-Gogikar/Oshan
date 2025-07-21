import { Stock } from '../types/models';

// Mock data for development/testing
const mockStocks: Stock[] = [
  {
    sid: '1',
    name: 'Apple Inc.',
    symbol: 'AAPL',
    exchange: 'NASDAQ',
    sector: 'Technology',
    description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.',
    currentPrice: 195.89,
    previousClose: 193.44,
    marketCap: 3000000000000,
    peRatio: 28.5,
    roe: 0.25,
    eps: 6.87,
    revenue: 383000000000,
    profit: 97000000000,
    promoterHolding: 0.0,
    institutionalHolding: 60.5,
    gic: {
      sector: 'Information Technology',
      industry: 'Technology Hardware & Equipment',
      subIndustry: 'Technology Hardware, Storage & Peripherals',
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
  {
    sid: '2',
    name: 'Alphabet Inc.',
    symbol: 'GOOGL',
    exchange: 'NASDAQ',
    sector: 'Technology',
    description: 'Alphabet Inc. provides online advertising services in the United States, Europe, the Middle East, Africa, the Asia-Pacific, Canada, and Latin America.',
    currentPrice: 175.12,
    previousClose: 176.35,
    marketCap: 2100000000000,
    peRatio: 24.8,
    roe: 0.22,
    eps: 7.06,
    revenue: 282000000000,
    profit: 73000000000,
    promoterHolding: 0.0,
    institutionalHolding: 65.2,
    gic: {
      sector: 'Communication Services',
      industry: 'Media & Entertainment',
      subIndustry: 'Interactive Media & Services',
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
  {
    sid: '3',
    name: 'Microsoft Corporation',
    symbol: 'MSFT',
    exchange: 'NASDAQ',
    sector: 'Technology',
    description: 'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide.',
    currentPrice: 378.85,
    previousClose: 374.73,
    marketCap: 2800000000000,
    peRatio: 32.1,
    roe: 0.28,
    eps: 11.80,
    revenue: 211000000000,
    profit: 88000000000,
    promoterHolding: 0.0,
    institutionalHolding: 70.1,
    gic: {
      sector: 'Information Technology',
      industry: 'Software & Services',
      subIndustry: 'Systems Software',
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
  {
    sid: '4',
    name: 'Tesla, Inc.',
    symbol: 'TSLA',
    exchange: 'NASDAQ',
    sector: 'Consumer Discretionary',
    description: 'Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems.',
    currentPrice: 245.01,
    previousClose: 250.68,
    marketCap: 780000000000,
    peRatio: 45.2,
    roe: 0.15,
    eps: 5.42,
    revenue: 96000000000,
    profit: 15000000000,
    promoterHolding: 13.0,
    institutionalHolding: 45.8,
    gic: {
      sector: 'Consumer Discretionary',
      industry: 'Automobiles & Components',
      subIndustry: 'Automobiles',
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
  {
    sid: '5',
    name: 'NVIDIA Corporation',
    symbol: 'NVDA',
    exchange: 'NASDAQ',
    sector: 'Technology',
    description: 'NVIDIA Corporation provides graphics, and compute and networking solutions in the United States, Taiwan, China, and internationally.',
    currentPrice: 875.28,
    previousClose: 862.94,
    marketCap: 2150000000000,
    peRatio: 65.3,
    roe: 0.35,
    eps: 13.40,
    revenue: 60000000000,
    profit: 29000000000,
    promoterHolding: 4.3,
    institutionalHolding: 68.9,
    gic: {
      sector: 'Information Technology',
      industry: 'Semiconductors & Semiconductor Equipment',
      subIndustry: 'Semiconductors',
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
];

// Mock watchlist
let mockWatchlist: string[] = ['AAPL', 'TSLA'];

class MockDataService {
  async getAllStocks(): Promise<Stock[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockStocks;
  }

  async getStockBySymbol(symbol: string): Promise<Stock | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const stock = mockStocks.find(s => s.symbol === symbol);
    return stock || null;
  }

  async searchStocks(query: string): Promise<Stock[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const lowercaseQuery = query.toLowerCase();
    return mockStocks.filter(
      stock => 
        stock.symbol.toLowerCase().includes(lowercaseQuery) ||
        stock.name.toLowerCase().includes(lowercaseQuery)
    );
  }

  async getWatchlist(): Promise<Stock[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockStocks.filter(stock => mockWatchlist.includes(stock.symbol));
  }

  async addToWatchlist(symbol: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200));
    if (!mockWatchlist.includes(symbol) && mockStocks.some(s => s.symbol === symbol)) {
      mockWatchlist.push(symbol);
      return true;
    }
    return false;
  }

  async removeFromWatchlist(symbol: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = mockWatchlist.indexOf(symbol);
    if (index > -1) {
      mockWatchlist.splice(index, 1);
      return true;
    }
    return false;
  }

  async getMarketData(symbol: string, period: string = '1d'): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Generate mock historical data
    const stock = mockStocks.find(s => s.symbol === symbol);
    const basePrice = stock?.currentPrice || 100;
    const dataPoints = period === '1d' ? 24 : period === '1w' ? 7 : 30;
    const data = [];
    
    for (let i = 0; i < dataPoints; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (dataPoints - i - 1));
      
      data.push({
        date: date.toISOString(),
        price: basePrice + (Math.random() - 0.5) * 10,
        volume: Math.floor(Math.random() * 1000000),
      });
    }
    
    return {
      symbol,
      period,
      data,
      currentPrice: basePrice,
    };
  }

  async getStockNews(symbol: string): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
      {
        id: '1',
        title: `${symbol} Announces Strong Q3 Earnings`,
        summary: `${symbol} reported better-than-expected earnings for the third quarter...`,
        source: 'Financial News',
        publishedAt: new Date().toISOString(),
        url: 'https://example.com/news/1',
      },
      {
        id: '2',
        title: `Market Analysis: ${symbol} Price Target Raised`,
        summary: `Analysts have raised their price target for ${symbol} following recent developments...`,
        source: 'Market Watch',
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        url: 'https://example.com/news/2',
      },
    ];
  }
}

export const mockDataService = new MockDataService();