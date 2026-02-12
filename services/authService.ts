import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

export interface UserData {
  uid: string;
  email: string;
  name: string;
  role: 'user' | 'trainer';
  createdAt: any;
  lastLogin: any;
  onboardingCompleted?: boolean;
  weight?: number;
  height?: number;
  birthdate?: string;
  gender?: 'male' | 'female';
  isPregnant?: boolean;
  trimester?: '1' | '2' | '3';
}

export const authService = {
  // Register new user
  register: async (email: string, password: string, name: string, role: 'user' | 'trainer'): Promise<UserData> => {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update display name
      await updateProfile(user, { displayName: name });

      // Create user document in Firestore
      const userData: UserData = {
        uid: user.uid,
        email: user.email!,
        name: name,
        role: role,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      };

      try {
        await setDoc(doc(db, 'users', user.uid), userData);
      } catch (firestoreError: any) {
        console.error('Firestore error:', firestoreError);
        // If Firestore fails, still return user data (auth succeeded)
        // User can still use the app, just data won't persist
        if (firestoreError.code === 'permission-denied') {
          console.warn('Firestore permissions error - check security rules');
          // Don't throw error, allow user to continue
        }
      }

      console.log('User registered successfully:', userData);
      return userData;
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Provide user-friendly error messages
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('This email is already registered. Please login instead.');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password should be at least 6 characters long.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address.');
      }
      
      throw new Error(error.message || 'Registration failed');
    }
  },

  // Login existing user
  login: async (email: string, password: string): Promise<UserData> => {
    try {
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Try to get user data from Firestore
      let userData: UserData;
      
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (userDoc.exists()) {
          userData = userDoc.data() as UserData;
          
          // Update last login
          await setDoc(doc(db, 'users', user.uid), {
            lastLogin: serverTimestamp()
          }, { merge: true });
        } else {
          // If no Firestore doc, create basic user data from auth
          userData = {
            uid: user.uid,
            email: user.email!,
            name: user.displayName || user.email!.split('@')[0],
            role: 'user',
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp()
          };
        }
      } catch (firestoreError: any) {
        console.warn('Firestore read error:', firestoreError);
        // If Firestore fails, create basic user data from auth
        userData = {
          uid: user.uid,
          email: user.email!,
          name: user.displayName || user.email!.split('@')[0],
          role: 'user',
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp()
        };
      }

      console.log('User logged in successfully:', userData);
      return userData;
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Provide user-friendly error messages
      if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email');
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address');
      } else if (error.code === 'auth/invalid-credential') {
        throw new Error('Invalid email or password');
      }
      
      throw new Error(error.message || 'Login failed');
    }
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      await signOut(auth);
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      console.log('User logged out successfully');
    } catch (error: any) {
      console.error('Logout error:', error);
      throw new Error(error.message || 'Logout failed');
    }
  },

  // Get current user
  getCurrentUser: (): User | null => {
    return auth.currentUser;
  },

  // Listen to auth state changes
  onAuthStateChange: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  },

  // Get user data from Firestore
  getUserData: async (uid: string): Promise<UserData | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      
      if (userDoc.exists()) {
        return userDoc.data() as UserData;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },

  // Update user onboarding data
  updateOnboardingData: async (uid: string, data: {
    weight: number;
    height: number;
    birthdate: string;
    gender: 'male' | 'female';
    isPregnant?: boolean;
    trimester?: '1' | '2' | '3';
    fitnessGoal: string;
    targetWeight?: number;
  }): Promise<void> => {
    try {
      console.log('updateOnboardingData called with:', { uid, data });
      
      // Create initial weight entry
      const weightEntry = {
        date: new Date().toISOString().split('T')[0],
        weight: data.weight,
        timestamp: Date.now()
      };
      
      console.log('Weight entry created:', weightEntry);

      // Build update data, removing undefined fields
      const updateData: any = {
        weight: data.weight,
        height: data.height,
        birthdate: data.birthdate,
        gender: data.gender,
        fitnessGoal: data.fitnessGoal,
        onboardingCompleted: true,
        currentWeight: data.weight,
        weightHistory: [weightEntry],
        lastUpdated: serverTimestamp()
      };

      // Only add optional fields if they have values
      if (data.isPregnant !== undefined) {
        updateData.isPregnant = data.isPregnant;
      }
      
      if (data.trimester !== undefined && data.trimester !== null) {
        updateData.trimester = data.trimester;
      }
      
      if (data.targetWeight !== undefined && data.targetWeight !== null) {
        updateData.targetWeight = data.targetWeight;
      }
      
      console.log('Updating Firestore with data:', updateData);

      await setDoc(doc(db, 'users', uid), updateData, { merge: true });
      
      console.log('Onboarding data saved successfully to Firestore');
    } catch (error: any) {
      console.error('Error saving onboarding data to Firestore:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      throw error;
    }
  }
};
