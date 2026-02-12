import { db } from './firebaseConfig';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';

interface WeightEntry {
  date: string;
  weight: number;
  timestamp: number;
}

interface WorkoutDay {
  date: string;
  completed: boolean;
}

interface UserProgressData {
  weightHistory: WeightEntry[];
  targetWeight: number | null;
  workoutStreak: WorkoutDay[];
  lastUpdated: any;
}

// For demo purposes, using a fixed user ID
// In production, you'd get this from authentication
const DEMO_USER_ID = 'demo_user_001';

export const firebaseService = {
  // Save all progress data
  saveProgressData: async (data: Partial<UserProgressData>): Promise<void> => {
    try {
      const userRef = doc(db, 'users', DEMO_USER_ID);
      const existing = await firebaseService.getProgressData();
      
      const updated = {
        ...existing,
        ...data,
        lastUpdated: serverTimestamp(),
      };
      
      await setDoc(userRef, updated, { merge: true });
      console.log('Data saved to Firebase successfully');
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      throw error;
    }
  },

  // Get all progress data
  getProgressData: async (): Promise<UserProgressData> => {
    try {
      const userRef = doc(db, 'users', DEMO_USER_ID);
      const docSnap = await getDoc(userRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as UserProgressData;
      }
      
      // Return default empty data
      return {
        weightHistory: [],
        targetWeight: null,
        workoutStreak: [],
        lastUpdated: serverTimestamp(),
      };
    } catch (error) {
      console.error('Error loading from Firebase:', error);
      // Return default data on error
      return {
        weightHistory: [],
        targetWeight: null,
        workoutStreak: [],
        lastUpdated: serverTimestamp(),
      };
    }
  },

  // Save weight history
  saveWeightHistory: async (weightHistory: WeightEntry[]): Promise<void> => {
    await firebaseService.saveProgressData({ weightHistory });
  },

  // Save target weight
  saveTargetWeight: async (targetWeight: number | null): Promise<void> => {
    await firebaseService.saveProgressData({ targetWeight });
  },

  // Save workout streak
  saveWorkoutStreak: async (workoutStreak: WorkoutDay[]): Promise<void> => {
    await firebaseService.saveProgressData({ workoutStreak });
  },

  // Clear all data
  clearAllData: async (): Promise<void> => {
    try {
      const userRef = doc(db, 'users', DEMO_USER_ID);
      await deleteDoc(userRef);
      console.log('All data cleared from Firebase');
    } catch (error) {
      console.error('Error clearing Firebase data:', error);
      throw error;
    }
  },

  // Get user ID (for future authentication)
  getUserId: (): string => {
    return DEMO_USER_ID;
  },
};
