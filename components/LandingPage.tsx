import React, { useState, useEffect, useRef } from 'react';
import { Camera, Upload, Activity, User, Users, PieChart, TrendingUp, Zap, Apple, Droplet, CheckCircle, LogOut, Plus, Search, ChevronRight, Filter, ArrowRight, Scan, Shield, Layers, Heart, Globe, Crosshair, Cpu, X, Target, BarChart3, ClipboardList, Calendar, Settings, AlertCircle, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { authService } from '../services/authService';

interface LandingPageProps {
  onGetStarted: () => void;
  onAuthSuccess: (role: string) => void;
}

// --- Custom Logo Component ---
const NutriVisionLogo = ({ size = 40, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M10 50C10 50 25 20 50 20C75 20 90 50 90 50C90 50 75 80 50 80C25 80 10 50 10 50Z" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M50 35C50 35 55 42 55 50C55 58 50 65 50 65C50 65 45 58 45 50C45 42 50 35 50 35Z" fill="currentColor" />
    <path d="M50 42L58 38M50 50L62 50M50 58L58 62" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    <path d="M50 35V65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
  </svg>
);

// --- Vision Recognition Simulator ---
const VisionSimulator = () => {
  return (
    <div className="relative w-full h-full overflow-hidden rounded-[3rem] group">
      <img 
        src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000" 
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
        alt="AI Food Scan" 
        onError={(e) => { 
          const target = e.target as HTMLImageElement;
          target.src = "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800"; 
        }}
      />
      
      {/* Neural Scan Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent pointer-events-none" />
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        <div className="w-full h-1.5 bg-emerald-400 shadow-[0_0_25px_#10b981] animate-scan-y opacity-90" />
      </div>
      
      {/* Target Nodes */}
      <div className="absolute top-[30%] left-[25%] w-[40%] h-[45%] border-2 border-emerald-400/80 rounded-[2rem] animate-pulse z-20 pointer-events-none shadow-[0_0_50px_rgba(16,185,129,0.2)]">
        <div className="absolute -top-12 left-0">
          <div className="bg-emerald-500 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-2xl whitespace-nowrap">
            <Crosshair size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Macro-Bowl ~420kcal</span>
          </div>
        </div>
      </div>
      
      {/* Floating Meta Data */}
      <div className="absolute bottom-6 left-6 right-6 z-20 flex justify-between items-end pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10">
          <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2 mb-1">
            <Cpu size={10} /> Neural Cluster
          </p>
          <div className="flex gap-4">
            <div>
              <p className="text-[8px] text-white/40 uppercase font-black">Accuracy</p>
              <p className="text-xs font-bold text-white">99.2%</p>
            </div>
            <div>
              <p className="text-[8px] text-white/40 uppercase font-black">Latency</p>
              <p className="text-xs font-bold text-white">12ms</p>
            </div>
          </div>
        </div>
        <div className="bg-emerald-600 px-5 py-3 rounded-2xl shadow-2xl border border-white/20">
          <p className="text-[8px] font-black text-white/70 uppercase tracking-widest">Nutri-Signature</p>
          <p className="text-xl font-black text-white leading-none mt-1">V10.88</p>
        </div>
      </div>
    </div>
  );
};

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onAuthSuccess }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'user' | 'trainer'>('user');
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
      let userData;
      
      if (isLogin) {
        // Login with Firebase
        userData = await authService.login(formData.email, formData.password);
      } else {
        // Register with Firebase
        if (!formData.name.trim()) {
          setError('Please enter your full name');
          setLoading(false);
          return;
        }
        userData = await authService.register(formData.email, formData.password, formData.name, role);
      }

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isAuthenticated', 'true');
      
      // Call success callback
      onAuthSuccess(userData.role);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
      setLoading(false);
    }
  };

  const openAuthModal = (mode: 'login' | 'register') => {
    setIsLogin(mode === 'login');
    setShowAuthModal(true);
    setError('');
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <div className="relative">
      <style>{`
        @keyframes scan-y {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan-y {
          position: absolute;
          animation: scan-y 4s linear infinite;
        }
        .hero-image-mask {
          mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 100%);
          -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 100%);
        }
      `}</style>

      {/* AUTH MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md animate-scale-in">
            <div className="bg-white rounded-[40px] p-10 shadow-2xl border border-slate-100 relative">
              {/* Close Button */}
              <button
                onClick={() => setShowAuthModal(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X size={24} />
              </button>

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
      )}

      {/* SECTION: HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-slate-50 px-4 py-20">
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Main Background Image */}
          <div className="absolute inset-0 hero-image-mask">
            <img 
              src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=1920"
              className="w-full h-full object-cover opacity-90 scale-105"
              alt="Hero Background"
            />
          </div>
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50/10 via-transparent to-slate-50"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(248,250,252,0.4)_100%)]"></div>
        </div>

        <div className="relative z-20 text-center px-4 md:px-6 max-w-6xl">
          <div className="inline-flex items-center gap-2 md:gap-3 bg-white/70 backdrop-blur-xl border border-emerald-200/50 text-emerald-700 px-4 md:px-6 py-2 md:py-3 rounded-full text-[9px] md:text-[10px] font-black tracking-[0.3em] md:tracking-[0.4em] uppercase mb-8 md:mb-12 shadow-sm">
            <Zap size={12} className="fill-emerald-600 md:w-3.5 md:h-3.5" /> Neural Convergence v10
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.95] mb-6 md:mb-10 drop-shadow-sm">
            The future of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400">Bio-Nutrition.</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-700 mb-10 md:mb-16 max-w-2xl mx-auto leading-relaxed font-bold drop-shadow-sm px-4">
            Deterministic nutritional analysis powered by high-precision neural vision. <br className="hidden sm:block" />
            Synchronize your metabolic blueprint with professional elite coaching.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-stretch sm:items-center">
            <button 
              onClick={() => openAuthModal('register')}
              className="px-10 md:px-14 py-5 md:py-6 bg-emerald-600 text-white rounded-full font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-xs md:text-sm hover:scale-105 hover:shadow-2xl transition-all active:scale-95 shadow-xl"
            >
              Get Started
            </button>
            <button 
              onClick={() => openAuthModal('login')}
              className="px-10 md:px-14 py-5 md:py-6 bg-white border-2 border-slate-200 text-slate-900 rounded-full font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-xs md:text-sm hover:bg-slate-50 transition-all shadow-xl"
            >
              Login
            </button>
          </div>
        </div>
      </section>

      {/* SECTION: CAPABILITIES */}
      <section className="py-20 md:py-40 bg-white px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-center mb-16 md:mb-32">
            <div className="relative aspect-square order-2 lg:order-1">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08)_0%,transparent_70%)] rounded-full blur-3xl" />
              <VisionSimulator />
            </div>

            <div className="order-1 lg:order-2">
              <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.25em] md:tracking-[0.3em] text-emerald-500 mb-4 md:mb-6 block">Precision Core</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-6 md:mb-8">Vision-driven portion estimation.</h2>
              <p className="text-base md:text-lg text-slate-500 leading-relaxed mb-6 md:mb-10">
                Our proprietary neural engine identifies over 2,500 food categories and estimates volume with 94% accuracy. 
                High-fidelity volumetric masking allows for precision logging.
              </p>

              <div className="space-y-4 md:space-y-6">
                {[
                  { icon: <Shield size={18} className="md:w-5 md:h-5" />, title: "Bio-Encryption", desc: "Your data is secured via end-to-end metabolic encryption." },
                  { icon: <Globe size={18} className="md:w-5 md:h-5" />, title: "Global Database", desc: "Access verified data for regional cuisines from over 180 countries." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 md:gap-4 p-4 md:p-6 rounded-2xl md:rounded-3xl bg-slate-50 border border-slate-100 group hover:bg-emerald-50 transition-colors cursor-default">
                    <div className="text-emerald-500 shrink-0 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1 text-sm md:text-base">{item.title}</h4>
                      <p className="text-xs md:text-sm text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { label: "For Athletes", title: "Precision Performance", desc: "Sync macros with training load to optimize recovery.", color: "bg-emerald-500" },
              { label: "For Trainers", title: "Team Compliance", desc: "Monitor entire rosters in one centralized hub.", color: "bg-slate-900" },
              { label: "For Dietitians", title: "Clinical Insights", desc: "Leverage biomarkers to adjust plans with precision.", color: "bg-emerald-600" }
            ].map((box, i) => (
              <div 
                key={i} 
                className="bg-white/80 backdrop-blur-2xl border border-emerald-100 shadow-[0_20px_50px_rgba(16,185,129,0.05)] rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 transition-all duration-500 hover:shadow-[0_30px_60px_rgba(16,185,129,0.1)] hover:-translate-y-4 group cursor-pointer"
                onClick={onGetStarted}
              >
                <span className={`px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest text-white mb-4 md:mb-6 inline-block ${box.color}`}>
                  {box.label}
                </span>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-3 md:mb-4 tracking-tight">{box.title}</h3>
                <p className="text-slate-500 text-xs md:text-sm leading-relaxed mb-6 md:mb-8">{box.desc}</p>
                <div className="flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest text-emerald-600 group-hover:gap-4 transition-all">
                  Explore <ArrowRight size={12} className="md:w-3.5 md:h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
