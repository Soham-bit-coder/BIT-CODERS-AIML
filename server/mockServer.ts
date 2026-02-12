
import { MealLog, UserProfile, ServerLog, ServerState } from '../types';
import { analyzeFoodImage } from '../services/geminiService';

class MockServer {
  private logs: ServerLog[] = [];
  private startTime: number = Date.now();
  private requestCount: number = 0;

  private STORAGE_KEY = 'nutrivision_db';

  constructor() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
        meals: [],
        profile: {
          dailyCalorieGoal: 2200,
          dailyProteinGoal: 150,
          dailyCarbsGoal: 250,
          dailyFatGoal: 70,
        }
      }));
    }
  }

  private addLog(method: ServerLog['method'], endpoint: string, status: number, message: string) {
    const log: ServerLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      method,
      endpoint,
      status,
      message
    };
    this.logs.unshift(log);
    if (this.logs.length > 50) this.logs.pop();
    this.requestCount++;
  }

  private async simulateLatency() {
    await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 600));
  }

  async getStatus(): Promise<ServerState> {
    const db = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
    return {
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
      totalRequests: this.requestCount,
      dbSize: JSON.stringify(db).length,
      logs: this.logs
    };
  }

  async getMeals(): Promise<MealLog[]> {
    await this.simulateLatency();
    const db = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
    this.addLog('GET', '/api/meals', 200, 'Fetched all meal records');
    return db.meals || [];
  }

  async getProfile(): Promise<UserProfile> {
    await this.simulateLatency();
    
    // Get authenticated user from localStorage
    const savedUser = localStorage.getItem('user');
    let userName = 'Demo User';
    let userEmail = 'demo@nutrivision.ai';
    let userRole: 'user' | 'trainer' = 'user';
    
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        userName = user.name || 'User';
        userEmail = user.email || 'user@nutrivision.ai';
        userRole = user.role || 'user';
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    
    const db = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
    this.addLog('GET', '/api/profile', 200, 'User profile retrieved');
    
    return {
      name: userName,
      email: userEmail,
      role: userRole,
      dailyCalorieGoal: db.profile?.dailyCalorieGoal || 2200,
      dailyProteinGoal: db.profile?.dailyProteinGoal || 150,
      dailyCarbsGoal: db.profile?.dailyCarbsGoal || 250,
      dailyFatGoal: db.profile?.dailyFatGoal || 70,
      weight: db.profile?.weight,
      height: db.profile?.height,
      age: db.profile?.age,
      gender: db.profile?.gender,
      activityLevel: db.profile?.activityLevel,
      fitnessGoal: db.profile?.fitnessGoal
    };
  }

  async createMeal(image: string): Promise<MealLog> {
    await this.simulateLatency();
    this.addLog('POST', '/api/analyze-food', 200, 'Processing AI vision request...');
    
    try {
      const base64 = image.split(',')[1];
      const nutrition = await analyzeFoodImage(base64);
      
      const newMeal: MealLog = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        imageUrl: image,
        nutrition
      };

      const db = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
      db.meals.unshift(newMeal);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(db));

      this.addLog('POST', '/api/meals', 201, `Meal logged: ${nutrition.foodName}`);
      return newMeal;
    } catch (error) {
      this.addLog('POST', '/api/analyze-food', 500, 'AI Analysis failed');
      throw error;
    }
  }

  async resetDatabase(): Promise<void> {
    localStorage.removeItem(this.STORAGE_KEY);
    this.addLog('DELETE', '/api/db', 200, 'Database wiped to factory settings');
    window.location.reload();
  }
}

export const server = new MockServer();
