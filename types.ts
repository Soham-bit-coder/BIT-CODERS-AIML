
export interface NutritionInfo {
  foodName: string;
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  healthScore: number;
  ingredients: string[];
  healthBenefits: string[];
  warnings: string[];
}

export interface MealLog {
  id: string;
  timestamp: number;
  imageUrl: string;
  nutrition: NutritionInfo;
}

export interface UserProfile {
  name: string;
  email: string;
  role: 'user' | 'trainer';
  dailyCalorieGoal: number;
  dailyProteinGoal: number;
  dailyCarbsGoal: number;
  dailyFatGoal: number;
  weight?: number;
  height?: number;
  age?: number;
  gender?: 'male' | 'female';
  activityLevel?: string;
  fitnessGoal?: string;
}

export interface ServerLog {
  id: string;
  timestamp: number;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  status: number;
  message: string;
}

export interface ServerState {
  uptime: number;
  totalRequests: number;
  dbSize: number;
  logs: ServerLog[];
}
