import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

interface AuthPageProps {
  initialRole?: 'user' | 'trainer';
  initialMode?: 'login' | 'register';
  onAuthSuccess: (role: string) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ initialRole = 'user', initialMode = 'login', onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [role, setRole] = useState(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication - in production, replace with actual API call
      const mockUser = {
        name: formData.name || formData.email.split('@')[0],
        email: formData.email,
        role: role
      };

      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('isAuthenticated', 'true');
      onAuthSuccess(role);
    } catch (err) {
      setError('Authentication failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[40px] p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="text-center mb-10">
            <div className="text-xs font-black text-emerald-600 uppercase tracking-[0.3em] mb-2">
              NutriVision AI
            </div>
            <h2 className="text-4xl font-black tracking-tighter uppercase italic text-slate-900">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
          </div>

          {/* Role Switcher */}
          <div className="flex p-1 bg-slate-100 rounded-2xl mb-8">
            <button 
              onClick={() => setRole('user')}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                role === 'user' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'
              }`}
            >
              Athlete
            </button>
            <button 
              onClick={() => setRole('trainer')}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                role === 'trainer' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'
              }`}
            >
              Trainer
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-bold text-center">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name" 
                  required={!isLogin}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium" 
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address" 
                required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium" 
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password" 
                required
                className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm transition-all shadow-lg shadow-emerald-200 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Register Now')}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-emerald-600 transition-colors"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
