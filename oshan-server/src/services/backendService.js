"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const llmService_1 = require("./llmService");
const auth_1 = require("../middleware/auth");
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
// MongoDB Connection
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Attempting to connect to MongoDB...');
        console.log('MongoDB URI (excluding password, if present):', process.env.MONGODB_URI ? process.env.MONGODB_URI.split('//')[0] + '//' + process.env.MONGODB_URI.split('//')[1].split(':')[0] + ':********@' + process.env.MONGODB_URI.split('@')[1] : 'MONGODB_URI not set');
        yield mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected successfully!');
    }
    catch (error) {
        console.error('MongoDB Connection Error:', error);
        process.exit(1);
    }
});
// MongoDB Schemas
const StockSchema = new mongoose_1.default.Schema({
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
const UserProfileSchema = new mongoose_1.default.Schema({
    userId: { type: String, required: true, unique: true },
    investingStyle: { type: String },
    sectors: { type: [String] },
    values: { type: [String] },
    riskTolerance: { type: String },
    experience: { type: String },
    timestamp: { type: Date, default: Date.now },
});
const ThemeSchema = new mongoose_1.default.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    stocks: { type: [String], default: [] },
    performance: { type: Number },
    trend: { type: String, enum: ['up', 'down', 'stable'] },
    tags: { type: [String], default: [] },
});
const UserProfileModel = mongoose_1.default.model('UserProfile', UserProfileSchema);
const ThemeModel = mongoose_1.default.model('Theme', ThemeSchema);
const InsightSchema = new mongoose_1.default.Schema({
    stockId: { type: String, required: true },
    type: { type: String, enum: ['trend', 'signal', 'alert'], required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    confidence: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
    metadata: { type: mongoose_1.default.Schema.Types.Mixed },
});
const NewsSchema = new mongoose_1.default.Schema({
    sid: { type: String, required: true, unique: true },
    news_date: { type: Date, required: true },
    headline: { type: String, required: true },
    summary: { type: String, required: true },
    aiSummary: { type: String }, // New field for AI-generated summary
    publisher: { type: String, required: true },
    tag: { type: String, required: true },
    sentiment: { type: String, enum: ['positive', 'negative', 'neutral'] },
});
const StockModel = mongoose_1.default.model('Stock', StockSchema);
const InsightModel = mongoose_1.default.model('Insight', InsightSchema);
const NewsModel = mongoose_1.default.model('News', NewsSchema);
// API Endpoints
app.get('/api/stocks', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stocks = yield StockModel.find();
        res.json(stocks);
    }
    catch (error) {
        console.error('Error fetching stocks:', error);
        res.status(500).json({ error: error.message });
    }
}));
app.get('/api/insights', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const insights = yield InsightModel.find();
        res.json(insights);
    }
    catch (error) {
        console.error('Error fetching insights:', error);
        res.status(500).json({ error: error.message });
    }
}));
app.get('/api/news', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const news = yield NewsModel.find();
        res.json(news);
    }
    catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ error: error.message });
    }
}));
app.post('/api/chat', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { messages } = req.body;
        const response = yield llmService_1.llmService.sendMessage(messages);
        res.json(response);
    }
    catch (error) {
        console.error('Error processing chat:', error);
        res.status(500).json({ error: error.message });
    }
}));
// Start server
const PORT = process.env.PORT || 5000;
connectDB(); // Ensure DB connection is initiated before app listens
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// POST endpoint for ingesting and summarizing news articles
app.post('/api/ingest-news', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newsArticles = req.body.news;
        for (const article of newsArticles) {
            const { summary, success } = yield llmService_1.llmService.generateSummary(article.summary);
            if (success && summary) {
                article.aiSummary = summary;
            }
            else {
                console.warn(`Failed to generate AI summary for article: ${article.headline}`);
            }
            yield NewsModel.findOneAndUpdate({ sid: article.sid }, article, { upsert: true, new: true });
        }
        res.status(200).json({ message: 'News articles ingested and summarized successfully.' });
    }
    catch (error) {
        console.error('Error ingesting news:', error);
        res.status(500).json({ error: error.message });
    }
}));
// GET endpoint to retrieve user profile
app.get('/api/profile/:userId', auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const userProfile = yield UserProfileModel.findOne({ userId });
        if (!userProfile) {
            return res.status(404).json({ error: 'User profile not found' });
        }
        res.status(200).json(userProfile);
    }
    catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: error.message });
    }
}));
// POST endpoint for user profile (for initial creation)
app.post('/api/profile', auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, investingStyle, sectors, values, riskTolerance, experience } = req.body;
        let userProfile = yield UserProfileModel.findOne({ userId });
        if (userProfile) {
            userProfile.set({
                investingStyle: investingStyle || userProfile.investingStyle,
                sectors: sectors || userProfile.sectors,
                values: values || userProfile.values,
                riskTolerance: riskTolerance || userProfile.riskTolerance,
                experience: experience || userProfile.experience,
            });
            yield userProfile.save();
            return res.status(200).json(userProfile);
        }
        else {
            userProfile = new UserProfileModel({
                userId,
                investingStyle,
                sectors,
                values,
                riskTolerance,
                experience,
            });
            yield userProfile.save();
            return res.status(201).json(userProfile);
        }
    }
    catch (error) {
        console.error('Error saving user profile:', error);
        res.status(500).json({ error: error.message });
    }
}));
app.get('/api/themes/:userId', auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const userProfile = yield UserProfileModel.findOne({ userId });
        if (!userProfile) {
            const defaultThemes = yield ThemeModel.find().limit(5);
            return res.status(200).json(defaultThemes);
        }
        const personalizedThemes = yield ThemeModel.find({
            $or: [
                { tags: { $in: userProfile.sectors || [] } },
                { tags: { $in: userProfile.values || [] } }
            ]
        }).limit(10);
        if (personalizedThemes.length === 0) {
            const trendingThemes = yield ThemeModel.find().sort({ performance: -1 }).limit(5);
            return res.status(200).json(trendingThemes);
        }
        res.status(200).json(personalizedThemes);
    }
    catch (error) {
        console.error('Failed to fetch personalized themes:', error);
        res.status(500).json({ error: error.message });
    }
}));
app.post('/api/report', auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { stockId } = req.body;
        const userId = req.userId;
        if (!stockId) {
            return res.status(400).json({ error: 'Stock ID is required' });
        }
        const stock = yield StockModel.findOne({ sid: stockId });
        if (!stock) {
            return res.status(404).json({ error: 'Stock not found' });
        }
        const userProfile = yield UserProfileModel.findOne({ userId });
        const { report, success } = yield llmService_1.llmService.generateStockReport(stock, userProfile);
        if (success && report) {
            res.status(200).send(report);
        }
        else {
            res.status(500).json({ error: 'Failed to generate report' });
        }
    }
    catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ error: error.message });
    }
}));
// New endpoint for Google authentication
app.post('/auth/google', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idToken } = req.body;
        if (!idToken) {
            return res.status(400).json({ error: 'ID token is required.' });
        }
        const simulatedUserId = `google-user-${idToken.substring(0, 10)}`; // Dummy user ID
        const token = jsonwebtoken_1.default.sign({ userId: simulatedUserId }, process.env.SECRET_KEY || 'supersecretjwtkey', { expiresIn: '1h' });
        res.status(200).json({ token, userId: simulatedUserId });
    }
    catch (error) {
        console.error('Google authentication error:', error);
        res.status(500).json({ error: error.message });
    }
}));
exports.default = app;
