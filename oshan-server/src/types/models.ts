export interface Stock {
  id: string;
  sid: string;
  name: string;
  symbol: string; // Changed from ticker to symbol for consistency
  exchange: string;
  sector: string;
  description?: string;
  gic?: {
    sector?: string;
    industry?: string;
    subIndustry?: string;
  };
  currentPrice: number;
  previousClose: number;
  marketCap?: number;
  peRatio?: number;
  roe?: number;
  eps?: number;
  revenue?: number;
  profit?: number;
  promoterHolding?: number;
  institutionalHolding?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NewsArticle {
  sid: string;
  news_date: Date;
  headline: string;
  summary: string;
  aiSummary?: string; // Add aiSummary field
  publisher: string;
  tag: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export interface AIInsight {
  id: string;
  stockId: string;
  type: 'trend' | 'signal' | 'alert';
  title: string;
  description: string;
  confidence: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  stocks: string[];
  performance: number;
  trend: 'up' | 'down' | 'stable';
  tags: string[];
}

export interface WatchlistItem {
  id: string;
  stockId: string;
  addedAt: Date;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  message: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  context?: Record<string, any>;
}

export interface User {
  id: string;
  email: string;
  subscription: 'free' | 'premium';
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  _id?: string; // MongoDB auto-generated ID
  userId: string;
  investingStyle?: string;
  sectors?: string[];
  values?: string[];
  riskTolerance?: string;
  experience?: string;
  timestamp?: Date; // To track when the profile was last updated or created
}