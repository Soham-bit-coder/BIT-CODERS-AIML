
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import FoodScanner from './components/FoodScanner';
import BarcodeScanner from './components/BarcodeScanner';
import HistoryLog from './components/HistoryLog';
import FitnessIntegration from './components/FitnessIntegration';
import MealRecommender from './components/MealRecommender';
import ProgressTracker from './components/ProgressTracker';
import AdminPanel from './components/AdminPanel';
import ProfileSettings from './components/ProfileSettings';
import FloatingChatbot from './components/FloatingChatbot';
import MobileConnectBanner from './components/MobileConnectBanner';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import OnboardingForm, { OnboardingData } from './components/OnboardingForm';
import { MealLog, UserProfile } from './types';
import { server } from './server/mockServer';
import { authService } from './services/authService';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string>('user');
  const [showLanding, setShowLanding] = useState(true); // Always start with landing page
  const [showAuth, setShowAuth] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [logs, setLogs] = useState<MealLog[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [hasVisitedLanding, setHasVisitedLanding] = useState(false); // Track if user has seen landing
  const [error, setError] = useState<string | null>(null);

  // Check authentication on mount and listen to Firebase auth state
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authStatus = localStorage.getItem('isAuthenticated');
        const savedUser = localStorage.getItem('user');
        
        if (authStatus === 'true' && savedUser) {
          const user = JSON.parse(savedUser);
          setIsAuthenticated(true);
          setUserRole(user.role || 'user');
          setCurrentUserId(user.uid || '');
        }
      } catch (err) {
        console.error('Error checking auth:', err);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();

    // Listen to Firebase auth state changes
    const unsubscribe = authService.onAuthStateChange(async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // User is signed in
          const userData = await authService.getUserData(firebaseUser.uid);
          if (userData) {
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('isAuthenticated', 'true');
            setIsAuthenticated(true);
            setUserRole(userData.role);
            setCurrentUserId(userData.uid);
          }
        } else {
          // User is signed out
          localStorage.removeItem('user');
          localStorage.removeItem('isAuthenticated');
          setIsAuthenticated(false);
          setShowLanding(true);
          setShowOnboarding(false);
        }
      } catch (err) {
        console.error('Error in auth state change:', err);
      }
    });

    return () => unsubscribe();
  }, []);

  // Initialize data from "Backend"
  useEffect(() => {
    if (isAuthenticated && !showLanding) {
      const initApp = async () => {
        try {
          const [meals, userProfile] = await Promise.all([
            server.getMeals(),
            server.getProfile()
          ]);
          setLogs(meals);
          setProfile(userProfile);
        } catch (error) {
          console.error("Backend connection failed", error);
          setError('Failed to load app data');
        }
      };
      initApp();
    }
  }, [isAuthenticated, showLanding]);

  const handleMealLogged = (newLog: MealLog) => {
    setLogs(prev => [newLog, ...prev]);
    setActiveTab('dashboard');
  };

  const handleAuthSuccess = (role: string) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setShowAuth(false);
    setShowLanding(false);
    
    // Check if user needs onboarding
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      console.log('User after auth:', user);
      
      // If onboarding not completed, show onboarding form
      if (!user.onboardingCompleted) {
        console.log('Onboarding not completed, showing onboarding form');
        setShowOnboarding(true);
      } else {
        console.log('Onboarding already completed, going to dashboard');
        setShowOnboarding(false);
      }
    }
  };

  const handleOnboardingComplete = async (data: OnboardingData) => {
    try {
      console.log('Starting onboarding completion...', data);
      
      // Get user ID from localStorage
      const savedUser = localStorage.getItem('user');
      console.log('Saved user from localStorage:', savedUser);
      
      if (!savedUser) {
        throw new Error('No user found in localStorage. Please try logging in again.');
      }
      
      const user = JSON.parse(savedUser);
      console.log('Parsed user:', user);
      
      const uid = user.uid;
      console.log('User UID:', uid);
      
      if (!uid) {
        throw new Error('No user ID found. Please try logging in again.');
      }
      
      console.log('Saving onboarding data for user:', uid);
      console.log('Onboarding data to save:', data);
      
      // Try to save to Firestore, but don't fail if it doesn't work
      let firestoreSaved = false;
      try {
        await authService.updateOnboardingData(uid, data);
        console.log('Onboarding data saved successfully to Firestore');
        firestoreSaved = true;
      } catch (firestoreError: any) {
        console.error('Firestore error (continuing anyway):', firestoreError);
        console.warn('Data will be saved to localStorage only. Firestore sync failed.');
        // Don't throw - continue with localStorage save
      }
      
      console.log('Updating localStorage with onboarding data');
      
      // Update localStorage with all onboarding data (this always works)
      user.onboardingCompleted = true;
      user.weight = data.weight;
      user.height = data.height;
      user.birthdate = data.birthdate;
      user.gender = data.gender;
      user.isPregnant = data.isPregnant;
      user.trimester = data.trimester;
      user.fitnessGoal = data.fitnessGoal;
      user.targetWeight = data.targetWeight;
      user.currentWeight = data.weight;
      user.weightHistory = [{
        date: new Date().toISOString().split('T')[0],
        weight: data.weight,
        timestamp: Date.now()
      }];
      
      localStorage.setItem('user', JSON.stringify(user));
      console.log('localStorage updated successfully:', user);
      
      // Show success message
      if (!firestoreSaved) {
        console.warn('Note: Data saved locally only. Firestore sync will be attempted later.');
      }
      
      setShowOnboarding(false);
    } catch (error: any) {
      console.error('Error saving onboarding data:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      // Show detailed error message
      let errorMessage = error.message || 'Unknown error occurred';
      if (error.code) {
        errorMessage += ` (Error code: ${error.code})`;
      }
      
      alert(`Failed to save your information: ${errorMessage}\n\nPlease check the browser console for more details.`);
    }
  };

  const handleGetStarted = () => {
    // Redirect to register page
    setAuthMode('register');
    setShowAuth(true);
    setShowLanding(false);
  };

  const handleLogin = () => {
    setAuthMode('login');
    setShowAuth(true);
  };

  const handleRegister = () => {
    setAuthMode('register');
    setShowAuth(true);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 animate-fade-in">
        <div className="text-center space-y-4 animate-scale-in">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-500 font-medium animate-pulse">Loading NutriVision...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-slate-900">Something went wrong</h2>
          <p className="text-slate-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // Show landing page first (always on initial visit)
  if (showLanding && !hasVisitedLanding) {
    return (
      <LandingPage 
        onGetStarted={() => {
          setHasVisitedLanding(true);
          handleGetStarted();
        }}
        onAuthSuccess={(role) => {
          setHasVisitedLanding(true);
          handleAuthSuccess(role);
        }}
      />
    );
  }

  // Show onboarding form after registration
  if (showOnboarding && isAuthenticated) {
    return <OnboardingForm onComplete={handleOnboardingComplete} />;
  }

  // Show auth page when user clicks Login or Register (no longer needed, but keeping for compatibility)
  if (showAuth && !isAuthenticated) {
    return (
      <AuthPage 
        onAuthSuccess={handleAuthSuccess}
        initialRole="user"
        initialMode={authMode}
      />
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 animate-fade-in">
        <div className="text-center space-y-4 animate-scale-in">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-500 font-medium animate-pulse">Booting NutriVision Backend...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard logs={logs} profile={profile} />;
      case 'scan':
        return <FoodScanner onMealLogged={handleMealLogged} />;
      case 'barcode':
        return <BarcodeScanner onProductLogged={handleMealLogged} onBack={() => setActiveTab('dashboard')} />;
      case 'history':
        return <HistoryLog logs={logs} />;
      case 'fitness':
        return <FitnessIntegration />;
      case 'meals':
        return <MealRecommender />;
      case 'progress':
        return <ProgressTracker />;
      case 'admin':
        return <AdminPanel />;
      case 'profile':
        return <ProfileSettings />;
      default:
        return <Dashboard logs={logs} profile={profile} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <MobileConnectBanner />
      {renderContent()}
      <FloatingChatbot />
    </Layout>
  );
};

export default App;
