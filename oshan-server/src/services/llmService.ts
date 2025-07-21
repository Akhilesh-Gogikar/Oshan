// llmService.ts - LLM Integration and summarization
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

// Load environment variables from .env file
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY, // Use OPENROUTER_API_KEY for OpenRouter
  baseURL: "https://openrouter.ai/api/v1", // OpenRouter base URL
});


export const llmService = {
  // Method to send messages to the LLM (e.g., for chat)
  sendMessage: async (messages: Array<{ role: string; content: string }>) => {
    try {
      const chatCompletion = await openai.chat.completions.create({
        model: 'openai/gpt-3.5-turbo', // Or any other suitable model from OpenRouter
        messages: messages as ChatCompletionMessageParam[], // Cast to ChatCompletionMessageParam[]
      });
      return { response: chatCompletion.choices[0].message.content, success: true };
    } catch (error) {
      console.error('Error sending message to LLM:', error);
      return { response: 'Error processing message.', success: false };
    }
  },

  // Method to generate a summary for a given text
  generateSummary: async (text: string): Promise<{ summary: string | null; success: boolean }> => {
    try {
      const completion = await openai.chat.completions.create({
        model: 'openai/gpt-3.5-turbo', // Choose an appropriate model for summarization
        messages: [
          { role: 'system', content: 'You are a helpful assistant that summarizes news articles concisely.' },
          { role: 'user', content: `Please summarize the following news article:\n\n${text}` },
        ] as ChatCompletionMessageParam[], // Cast to ChatCompletionMessageParam[]
        max_tokens: 150, // Limit summary length
      });
      const summary = completion.choices[0].message.content;
      return { summary, success: true };
    } catch (error) {
      console.error('Error generating summary:', error);
      return { summary: null, success: false };
    }
  },

  // Method to generate a detailed stock report in markdown format
  generateStockReport: async (stock: any, userProfile: any): Promise<{ report: string | null; success: boolean }> => {
    try {
      const prompt = `Generate a comprehensive stock analysis report for ${stock.name} (${stock.symbol}) in markdown format.
      
      Include the following sections based on the provided data:

      1.  **Executive AI Summary**: A concise overview of the company and its current standing.
      2.  **Key Financials**: Highlight current price, market cap, PE Ratio, ROE, EPS, Revenue, and Profit.
      3.  **Shareholding Trends**: Mention promoter holding and institutional holding.
      4.  **Key News & Narratives**: Briefly summarize important recent news (if available).
      5.  **AI Recommendations**: Provide general insights and potential considerations (state clearly this is NOT investment advice).

      Stock Data:
      - Name: ${stock.name}
      - Symbol: ${stock.symbol}
      - Current Price: ${stock.currentPrice}
      - Market Cap: ${stock.marketCap}
      - PE Ratio: ${stock.peRatio}
      - ROE: ${stock.roe}
      - EPS: ${stock.eps}
      - Revenue: ${stock.revenue}
      - Profit: ${stock.profit}
      - Promoter Holding: ${stock.promoterHolding}%
      - Institutional Holding: ${stock.institutionalHolding}%
      - Sector: ${stock.sector}
      - Description: ${stock.description || 'N/A'}

      User Preferences (if available for personalization):
      - Investing Style: ${userProfile?.investingStyle || 'N/A'}
      - Sectors of Interest: ${userProfile?.sectors?.join(', ') || 'N/A'}
      - Risk Tolerance: ${userProfile?.riskTolerance || 'N/A'}

      Ensure the report is professional, well-structured, and easy to read. Start with a clear title for the report.
      Important: Add a disclaimer at the end stating "Disclaimer: This report is for informational purposes only and does not constitute financial advice."`;

      const completion = await openai.chat.completions.create({
        model: 'openai/gpt-4o', // Using a more capable model for report generation
        messages: [
          { role: 'system', content: 'You are an AI financial analyst generating comprehensive stock reports.' },
          { role: 'user', content: prompt }
        ] as ChatCompletionMessageParam[],
        max_tokens: 2000,
      });

      const report = completion.choices[0].message.content;
      return { report, success: true };
    } catch (error) {
      console.error('Error generating stock report:', error);
      return { report: null, success: false };
    }
  }
};