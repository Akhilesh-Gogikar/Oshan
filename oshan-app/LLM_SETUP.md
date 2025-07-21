# OpenRouter LLM Integration Setup Guide

This guide explains how to set up and use the OpenRouter LLM integration in the Oshan stock trading app.

## Overview

The Oshan app now includes AI-powered chat functionality using OpenRouter's API, which provides access to various LLM models including OpenAI GPT-4, Claude, and others through a unified API.

## Quick Start

### 1. Environment Configuration

1. **Get your OpenRouter API key**:
   - Visit [OpenRouter](https://openrouter.ai)
   - Sign up for an account
   - Navigate to Settings → API Keys
   - Generate a new API key

2. **Configure the app**:
   - Copy `.env.example` to `.env` (or create `.env` if it doesn't exist)
   - Add your API key:
   ```
   OPENROUTER_API_KEY=your-actual-api-key-here
   ```

### 2. Available Models

The integration supports multiple models through OpenRouter:

- **openai/gpt-4o-mini** (default) - Fast and cost-effective
- **openai/gpt-4o** - More capable but slower
- **anthropic/claude-3.5-sonnet** - Anthropic's latest model
- **google/gemini-pro** - Google's Gemini model

### 3. Usage Examples

#### Basic Chat
```typescript
import { llmService } from './src/services/llmService';

// Send a simple message
const response = await llmService.sendMessage([
  { id: '1', message: 'What is the current market trend?', sender: 'user', timestamp: new Date() }
]);

console.log(response.message);
```

#### Stock-Specific Questions
```typescript
// Get contextual stock advice
const advice = await llmService.getStockAdvice(
  'Should I invest in Apple stock right now?',
  { currentPrice: 175.50, marketCap: '2.8T', peRatio: 28.5 }
);
```

## API Reference

### LLMService Methods

#### `sendMessage(messages, model?)`
- **messages**: Array of ChatMessage objects
- **model**: Optional model ID (defaults to 'openai/gpt-4o-mini')
- **Returns**: Promise<LLMResponse>

#### `getStockAdvice(question, context?)`
- **question**: String question about stocks
- **context**: Optional additional context object
- **Returns**: Promise<string>

#### `getAvailableModels()`
- **Returns**: Promise<string[]> - List of available model IDs

## ChatMessage Interface

```typescript
interface ChatMessage {
  id: string;
  message: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  context?: Record<string, any>;
}
```

## Features

### ✅ Implemented Features
- Real-time chat with AI assistant
- Stock market insights and advice
- Context-aware responses
- Typing indicators
- Error handling and user feedback
- Responsive design for mobile

### 🔄 Planned Features
- Voice input support
- Chat history persistence
- Custom stock context injection
- Multi-language support
- Advanced market analysis

## Configuration Options

### Environment Variables
```bash
# Required
OPENROUTER_API_KEY=your-api-key

# Optional
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
```

### Model Selection
You can change the default model by modifying the `sendMessage` call:
```typescript
const response = await llmService.sendMessage(messages, 'anthropic/claude-3.5-sonnet');
```

## Troubleshooting

### Common Issues

1. **"API key not configured"**
   - Ensure `.env` file exists with correct `OPENROUTER_API_KEY`
   - Restart the development server after adding the key

2. **"Rate limit exceeded"**
   - Wait a few minutes before retrying
   - Consider upgrading your OpenRouter plan

3. **"Failed to get response"**
   - Check internet connection
   - Verify API key is valid and has credits
   - Check console for detailed error messages

### Debug Mode
Enable debug logging by adding:
```typescript
console.log('LLM Request:', messages);
console.log('LLM Response:', response);
```

## Security Notes

- Never commit your API key to version control
- Use environment variables for sensitive configuration
- Consider implementing rate limiting for production use
- Validate user inputs before sending to LLM

## Testing

### Manual Testing
1. Start the app: `npm start`
2. Navigate to Chat tab
3. Type a question like "What do you think about Tesla stock?"
4. Verify AI responds appropriately

### Automated Testing
```bash
# Run tests
npm test

# Test LLM service specifically
npm test -- --testNamePattern="LLM"
```

## Performance Tips

- Use `gpt-4o-mini` for faster responses
- Limit message history to last 10 messages
- Cache frequent responses
- Implement debouncing for user input

## Support

For issues or questions:
1. Check this documentation
2. Review console logs for error details
3. Test with different models
4. Contact OpenRouter support for API-related issues