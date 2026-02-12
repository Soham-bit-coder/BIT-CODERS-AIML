import { doc, setDoc, getDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';

export interface WeightEntry {
  date: string;
  weight: number;
  timestamp: number;
}

export const weightTrackingService = {
  // Add a new weight entry
  addWeightEntry: async (userId: string, weight: number): Promise<void> => {
    try {
      const weightEntry: WeightEntry = {
        date: new Date().toISOString().split('T')[0],
        weight: weight,
        timestamp: Date.now()
      };

      await setDoc(doc(db, 'users', userId), {
        currentWeight: weight,
        weightHistory: arrayUnion(weightEntry),
        lastWeightUpdate: serverTimestamp()
      }, { merge: true });

      console.log('Weight entry added successfully');
    } catch (error) {
      console.error('Error adding weight entry:', error);
      throw error;
    }
  },

  // Get weight history
  getWeightHistory: async (userId: string): Promise<WeightEntry[]> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        return data.weightHistory || [];
      }
      
      return [];
    } catch (error) {
      console.error('Error getting weight history:', error);
      return [];
    }
  },

  // Update target weight
  updateTargetWeight: async (userId: string, targetWeight: number): Promise<void> => {
    try {
      await setDoc(doc(db, 'users', userId), {
        targetWeight: targetWeight,
        lastUpdated: serverTimestamp()
      }, { merge: true });

      console.log('Target weight updated successfully');
    } catch (error) {
      console.error('Error updating target weight:', error);
      throw error;
    }
  },

  // Get current and target weight
  getWeightData: async (userId: string): Promise<{
    currentWeight: number;
    targetWeight?: number;
    weightHistory: WeightEntry[];
  }> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          currentWeight: data.currentWeight || 0,
          targetWeight: data.targetWeight,
          weightHistory: data.weightHistory || []
        };
      }
      
      return {
        currentWeight: 0,
        weightHistory: []
      };
    } catch (error) {
      console.error('Error getting weight data:', error);
      return {
        currentWeight: 0,
        weightHistory: []
      };
    }
  }
};
