import { GoogleGenerativeAI } from "@google/generative-ai";
import { NutritionInfo } from "../types";

// Get API key from environment variable
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

if (!API_KEY) {
  console.error('GEMINI API KEY is missing! Please add VITE_GEMINI_API_KEY to your .env.local file');
}

const genAI = new GoogleGenerativeAI(API_KEY);

// Open Food Facts API
export const fetchFromOpenFoodFacts = async (barcode: string): Promise<NutritionInfo | null> => {
  try {
    console.log('Searching for barcode:', barcode);
    
    // Try multiple regions
    const regions = ['world', 'us', 'in', 'uk'];
    
    for (const region of regions) {
      const url = `https://${region}.openfoodfacts.org/api/v0/product/${barcode}.json`;
      console.log('Trying URL:', url);
      
      const response = await fetch(url);
      const data = await response.json();

      console.log('API Response:', data);

      if (data.status === 1 && data.product) {
        const product = data.product;
        const nutriments = product.nutriments || {};

        console.log('Product found:', product.product_name);

        return {
          foodName: product.product_name || product.product_name_en || 'Unknown Product',
          servingSize: product.serving_size || product.serving_quantity || '100g',
          calories: Math.round(nutriments['energy-kcal_100g'] || nutriments['energy-kcal'] || nutriments.energy_100g / 4.184 || 0),
          protein: Math.round(nutriments.proteins_100g || nutriments.proteins || 0),
          carbs: Math.round(nutriments.carbohydrates_100g || nutriments.carbohydrates || 0),
          fat: Math.round(nutriments.fat_100g || nutriments.fat || 0),
          fiber: Math.round(nutriments.fiber_100g || nutriments.fiber || 0),
          sugar: Math.round(nutriments.sugars_100g || nutriments.sugars || 0),
          healthScore: calculateHealthScore(nutriments),
          ingredients: product.ingredients_text ? [product.ingredients_text] : [],
          healthBenefits: generateHealthBenefits(product),
          warnings: generateWarnings(product, nutriments),
        };
      }
    }
    
    console.log('Product not found in any region');
    return null;
  } catch (error) {
    console.error('Open Food Facts API error:', error);
    return null;
  }
};

// Gemini AI barcode reading from image
export const scanBarcodeWithGemini = async (base64Image: string): Promise<string | null> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    const prompt = "Look at this image and find any barcode or QR code. Extract ONLY the numeric barcode number (usually 8-13 digits). If you find a barcode, respond with ONLY the numbers, nothing else. If no barcode is found, respond with 'NO_BARCODE'.";

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: "image/jpeg",
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text().trim();
    
    // Check if valid barcode (8-13 digits)
    if (text === 'NO_BARCODE' || !/^\d{8,13}$/.test(text)) {
      return null;
    }

    return text;
  } catch (error) {
    console.error('Gemini barcode scan error:', error);
    return null;
  }
};

// Combined function: Scan with Gemini, then fetch from Open Food Facts
export const scanAndFetchProduct = async (base64Image: string): Promise<NutritionInfo | null> => {
  try {
    // Step 1: Use Gemini to read barcode from image
    const barcode = await scanBarcodeWithGemini(base64Image);
    
    if (!barcode) {
      throw new Error('No barcode detected in image');
    }

    // Step 2: Fetch product info from Open Food Facts
    const productInfo = await fetchFromOpenFoodFacts(barcode);
    
    if (!productInfo) {
      throw new Error('Product not found in database');
    }

    return productInfo;
  } catch (error) {
    console.error('Scan and fetch error:', error);
    throw error;
  }
};

// Helper functions
const calculateHealthScore = (nutriments: any): number => {
  let score = 5; // Base score

  // Positive factors
  if (nutriments.proteins_100g > 10) score += 1;
  if (nutriments.fiber_100g > 5) score += 1;
  if (nutriments['fruits-vegetables-nuts_100g'] > 40) score += 1;

  // Negative factors
  if (nutriments.sugars_100g > 15) score -= 1;
  if (nutriments.fat_100g > 20) score -= 1;
  if (nutriments.salt_100g > 1.5) score -= 1;
  if (nutriments['saturated-fat_100g'] > 5) score -= 1;

  return Math.max(1, Math.min(10, score));
};

const generateHealthBenefits = (product: any): string[] => {
  const benefits: string[] = [];
  const nutriments = product.nutriments || {};

  if (nutriments.proteins_100g > 10) {
    benefits.push('High in protein');
  }
  if (nutriments.fiber_100g > 5) {
    benefits.push('Good source of fiber');
  }
  if (product.labels_tags?.includes('en:organic')) {
    benefits.push('Organic product');
  }
  if (nutriments.fat_100g < 3) {
    benefits.push('Low fat');
  }

  return benefits.length > 0 ? benefits : ['Packaged food item'];
};

const generateWarnings = (product: any, nutriments: any): string[] => {
  const warnings: string[] = [];

  if (nutriments.sugars_100g > 15) {
    warnings.push('High in sugar');
  }
  if (nutriments.salt_100g > 1.5) {
    warnings.push('High in sodium');
  }
  if (nutriments['saturated-fat_100g'] > 5) {
    warnings.push('High in saturated fat');
  }
  if (product.allergens_tags?.length > 0) {
    warnings.push(`Contains allergens: ${product.allergens_tags.join(', ')}`);
  }
  if (product.additives_tags?.length > 5) {
    warnings.push('Contains multiple additives');
  }

  return warnings;
};
