import { GoogleGenerativeAI } from "@google/generative-ai";
import { NutritionInfo } from "../types";

// Get API key from environment variable
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

if (!API_KEY) {
  console.error('GEMINI API KEY is missing! Please add VITE_GEMINI_API_KEY to your .env.local file');
}

const genAI = new GoogleGenerativeAI(API_KEY);

export const analyzeFoodImage = async (base64Image: string): Promise<NutritionInfo> => {
  try {
    // Use gemini-pro-vision for image analysis
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `Analyze this food image and provide detailed nutritional information. 
    
    Return a JSON object with the following structure:
    {
      "foodName": "Name of the dish",
      "servingSize": "Estimated serving size (e.g., 250g, 1 cup)",
      "calories": number (estimated calories),
      "protein": number (grams),
      "carbs": number (grams),
      "fat": number (grams),
      "fiber": number (grams),
      "sugar": number (grams),
      "healthScore": number (1-100 based on nutritional value),
      "ingredients": ["list", "of", "visible", "ingredients"],
      "healthBenefits": ["list", "of", "health", "benefits"],
      "warnings": ["dietary warnings like allergens"]
    }
    
    Be as accurate as possible with nutritional estimates. If multiple items are present, provide combined totals.`;

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: "image/jpeg",
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    
    console.log('Gemini API Response:', text);

    // Extract JSON from response (handle markdown code blocks)
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    const nutritionData = JSON.parse(jsonText);
    
    return nutritionData as NutritionInfo;
  } catch (error: any) {
    console.error('Error calling Gemini API:', error);
    throw new Error(error.message || 'Failed to analyze food image');
  }
};