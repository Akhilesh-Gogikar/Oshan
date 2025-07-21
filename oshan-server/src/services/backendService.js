// backendService.js - Pure JavaScript (CommonJS)
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const { llmService } = require('./llmService');
const { authenticate } = require('../middleware/auth');

// No longer importing types directly into JS files, assuming runtime structure
// const { Stock, AIInsight, NewsArticle, ChatMessage, Theme, UserProfile } = require('../types/models'); 

const app = express();
app.use(bodyParser.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};

// MongoDB Schemas - simplified for JS, use JSDoc for better documentation if needed
const StockSchema = new mongoose.Schema({
  sid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  exchange: { type: String, required: true },
  sector: { type: String, required: true },
  description: { type: String },
  gic: {
    sector: { type: String },
    industry: { type: String },
    subIndustry: { type: String },
  },
  currentPrice: { type: Number, required: true },
  previousClose: { type: Number, required: true },
  marketCap: { type: Number },
  peRatio: { type: Number },
  roe: { type: Number },
  eps: { type: Number },
  revenue: { type: Number },
  profit: { type: Number },
  promoterHolding: { type: Number },
  institutionalHolding: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const UserProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  investingStyle: { type: String },
  sectors: { type: [String] },
  values: { type: [String] },
  riskTolerance: { type: String },
  experience: { type: String },
  timestamp: { type: Date, default: Date.now },
});

const ThemeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  stocks: { type: [String], default: [] },
  performance: { type: Number },
  trend: { type: String, enum: ['up', 'down', 'stable'] },
  tags: { type: [String], default: [] },
});

const UserProfileModel = mongoose.model('UserProfile', UserProfileSchema);
const ThemeModel = mongoose.model('Theme', ThemeSchema);

const InsightSchema = new mongoose.Schema({
  stockId: { type: String, required: true },
  type: { type: String, enum: ['trend', 'signal', 'alert'], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  confidence: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  metadata: { type: mongoose.Schema.Types.Mixed },
});

const NewsSchema = new mongoose.Schema({
  sid: { type: String, required: true, unique: true },
  news_date: { type: Date, required: true },
  headline: { type: String, required: true },
  summary: { type: String, required: true },
  aiSummary: { type: String }, // New field for AI-generated summary
  publisher: { type: String, required: true },
  tag: { type: String, required: true },
  sentiment: { type: String, enum: ['positive', 'negative', 'neutral'] },
});

const StockModel = mongoose.model('Stock', StockSchema);
const InsightModel = mongoose.model('Insight', InsightSchema);
const NewsModel = mongoose.model('News', NewsSchema);

// API Endpoints
app.get('/api/stocks', async (req, res) => {
  try {
    const stocks = await StockModel.find();
    res.json(stocks);
  } catch (error) {
    console.error('Error fetching stocks:', error);
    res.status(500).json({ error: 'Failed to fetch stocks' });
  }
});

app.get('/api/insights', async (req, res) => {
  try {
    const insights = await InsightModel.find();
    res.json(insights);
  } catch (error) {
    console.error('Error fetching insights:', error);
    res.status(500).json({ error: 'Failed to fetch insights' });
  }
});

app.get('/api/news', async (req, res) => {
  try {
    const news = await NewsModel.find();
    res.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const response = await llmService.sendMessage(messages);
    res.json(response);
  } catch (error) {
    console.error('Error processing chat:', error);
    res.status(500).json({ error: 'Failed to process chat' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;

connectDB(); // Ensure DB connection is initiated before app listens

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// POST endpoint for ingesting and summarizing news articles
app.post('/api/ingest-news', async (req, res) => {
  try {
    const newsArticles = req.body.news;

    for (const article of newsArticles) {
      const { summary, success } = await llmService.generateSummary(article.summary);

      if (success && summary) {
        article.aiSummary = summary;
      } else {
        console.warn(`Failed to generate AI summary for article: ${article.headline}`);
      }

      await NewsModel.findOneAndUpdate({ sid: article.sid }, article, { upsert: true, new: true });
    }

    res.status(200).json({ message: 'News articles ingested and summarized successfully.' });
  } catch (error) {
    console.error('Error ingesting news:', error);
    res.status(500).json({ error: 'Failed to ingest news articles.' });
  }
});

// GET endpoint to retrieve user profile
app.get('/api/profile/:userId', authenticate, async (req, res) => {
  try {
    const { userId } = req.params;
    const userProfile = await UserProfileModel.findOne({ userId });

    if (!userProfile) {
      return res.status(404).json({ error: 'User profile not found' });
    }
    res.status(200).json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// POST endpoint for user profile (for initial creation)
app.post('/api/profile', authenticate, async (req, res) => {
  try {
    const { userId, investingStyle, sectors, values, riskTolerance, experience } = req.body;
    let userProfile = await UserProfileModel.findOne({ userId });

    if (userProfile) {
        userProfile.set({
            investingStyle: investingStyle || userProfile.investingStyle,
            sectors: sectors || userProfile.sectors,
            values: values || userProfile.values,
            riskTolerance: riskTolerance || userProfile.riskTolerance,
            experience: experience || userProfile.experience,
        });
        await userProfile.save();
        return res.status(200).json(userProfile);
    } else {
        userProfile = new UserProfileModel({
            userId,
            investingStyle,
            sectors,
            values,
            riskTolerance,
            experience,
        });
        await userProfile.save();
        return res.status(201).json(userProfile);
    }

  } catch (error) {
    console.error('Error saving user profile:', error);
    res.status(500).json({ error: 'Failed to save user profile' });
  }
});

app.get('/api/themes/:userId', authenticate, async (req, res) => {
  try {
    const { userId } = req.params;
    const userProfile = await UserProfileModel.findOne({ userId });

    if (!userProfile) {
      const defaultThemes = await ThemeModel.find().limit(5);
      return res.status(200).json(defaultThemes);
    }

    const personalizedThemes = await ThemeModel.find({
      $or: [
        { tags: { $in: userProfile.sectors || [] } },
        { tags: { $in: userProfile.values || [] } }
      ]
    }).limit(10);

    if (personalizedThemes.length === 0) {
      const trendingThemes = await ThemeModel.find().sort({ performance: -1 }).limit(5);
      return res.status(200).json(trendingThemes);
    }

    res.status(200).json(personalizedThemes);
  } catch (error) {
    console.error('Failed to fetch personalized themes:', error);
    res.status(500).json({ error: 'Failed to fetch personalized themes' });
  }
});

app.post('/api/report', authenticate, async (req, res) => {
  try {
    const { stockId } = req.body;
    const userId = req.userId; // This line still assumes req.userId

    if (!stockId) {
      return res.status(400).json({ error: 'Stock ID is required.' });
    }

    const stock = await StockModel.findOne({ sid: stockId });
    if (!stock) {
      return res.status(404).json({ error: 'Stock not found.' });
    }

    const userProfile = await UserProfileModel.findOne({ userId });

    const { report, success } = await llmService.generateStockReport(stock, userProfile);

    if (success && report) {
      res.status(200).send(report);
    } else {
      res.status(500).json({ error: 'Failed to generate report.' });
    }

  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Failed to generate report.' });
  }
});

// New endpoint for Google authentication
app.post('/auth/google', async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: 'ID token is required.' });
    }

    const simulatedUserId = `google-user-${idToken.substring(0, 10)}`; // Dummy user ID
    // In a real application, you would verify the idToken with Google
    // and then create/retrieve a user in your database and issue your own JWT.
    // For this example, we'll just simulate success and issue a dummy JWT.
    const token = jwt.sign({ userId: simulatedUserId }, process.env.SECRET_KEY || 'supersecretjwtkey', { expiresIn: '1h' });

    res.status(200).json({ token, userId: simulatedUserId });
  } catch (error) {
    console.error('Google authentication error:', error);
    res.status(500).json({ error: 'Failed to authenticate with Google.' });
  }
});

module.exports = app;