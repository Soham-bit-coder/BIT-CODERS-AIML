import { GoogleGenerativeAI } from "@google/generative-ai";

// Get API key from environment variable
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

if (!API_KEY) {
  console.error('GEMINI API KEY is missing! Please add VITE_GEMINI_API_KEY to your .env.local file');
}

const genAI = new GoogleGenerativeAI(API_KEY);

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const chatWithGemini = async (
  userMessage: string,
  conversationHistory: Message[]
): Promise<string> => {
  try {
    // Build conversation context
    const context = conversationHistory
      .slice(-6) // Keep last 6 messages for context
      .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');

    const systemPrompt = `You are NutriVision AI, a helpful nutrition and health assistant. You provide accurate, science-based advice about:
- Nutrition and diet
- Meal planning and recipes
- Calorie and macro tracking
- Weight management (loss, gain, maintenance)
- Healthy eating habits
- Food benefits and warnings
- Exercise and fitness nutrition
- Dietary restrictions and allergies

Keep responses concise (2-3 paragraphs max), friendly, and actionable. Use simple language. If asked about medical conditions, remind users to consult healthcare professionals.

Previous conversation:
${context}

User's new question: ${userMessage}

Provide a helpful, concise response:`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error('No response from AI');
    }

    return text.trim();
  } catch (error: any) {
    console.error('Gemini chat error:', error);
    console.error('Error details:', error.message);
    
    // Return a more helpful error message
    if (error.message?.includes('API key') || error.message?.includes('API_KEY_INVALID')) {
      throw new Error('API key issue. Please check your Gemini API key configuration.');
    }
    
    throw new Error('Failed to get response from AI assistant. Please try again.');
  }
};
