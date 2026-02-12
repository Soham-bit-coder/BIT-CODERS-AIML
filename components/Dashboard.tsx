import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { 
  Flame, Droplets, Target, ChevronRight, Plus, Calendar, Award, Utensils,
  TrendingUp, Clock, Info, CheckCircle2, Sparkles, Zap, Play, MousePointer2,
  Apple, Sandwich, Salad, Soup
} from 'lucide-react';
import { MealLog, UserProfile } from '../types';
import NutrientCard from './NutrientCard';

interface DashboardProps {
  logs: MealLog[];
  profile: UserProfile;
}

// --- Custom Hooks ---
const useTypingEffect = (text: string, speed = 80) => {
  const [displayedText, setDisplayedText] = useState("");
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);
  return displayedText;
};

// --- Sub-components ---
const FloatingFoodItem = ({ icon: Icon, className, delay = "0s", duration = "6s" }: any) => (
  <div 
    className={`absolute z-10 pointer-events-none ${className}`}
    style={{ animation: `float ${duration} ease-in-out infinite`, animationDelay: delay }}
  >
    <div className="p-4 bg-white/30 backdrop-blur-2xl rounded-full border border-white/50 shadow-2xl flex items-center justify-center">
      <Icon size={32} className="text-emerald-600/70" />
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ logs, profile }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const typedHeading = useTypingEffect("Fueling your Energy.", 100);

  const handleMouseMove = (e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 15;
    const y = (e.clientY / window.innerHeight - 0.5) * 15;
    setMousePos({ x, y });
  };

  const today = new Date().setHours(0, 0, 0, 0);
  const todayLogs = logs.filter(log => log.timestamp >= today);

  const stats = todayLogs.reduce((acc, log) => ({
    calories: acc.calories + log.nutrition.calories,
    protein: acc.protein + log.nutrition.protein,
    carbs: acc.carbs + log.nutrition.carbs,
    fat: acc.fat + log.nutrition.fat,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const chartData = [
    { name: 'Protein', value: stats.protein, color: '#10b981' },
    { name: 'Carbs', value: stats.carbs, color: '#3b82f6' },
    { name: 'Fat', value: stats.fat, color: '#f59e0b' },
  ];

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="space-y-8 text-slate-900 font-sans selection:bg-emerald-100 relative"
    >
      <style>{`
        @keyframes fadeIn { 
          from { opacity: 0; transform: translateY(30px) scale(0.98); } 
          to { opacity: 1; transform: translateY(0) scale(1); } 
        }
        @keyframes float { 
          0%, 100% { transform: translateY(0px) rotate(0deg); } 
          50% { transform: translateY(-25px) rotate(5deg); } 
        }
        @keyframes blink { 
          0%, 100% { opacity: 1; } 
          50% { opacity: 0; } 
        }
        @keyframes subtleZoom { 
          from { transform: scale(1.02); } 
          to { transform: scale(1.1); } 
        }
        .animate-fade-up { 
          animation: fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
        }
        .animate-float { 
          animation: float 6s ease-in-out infinite; 
        }
        .typing-cursor::after { 
          content: '|'; 
          animation: blink 0.8s infinite; 
          color: #10b981; 
          margin-left: 2px; 
        }
        .text-3d {
          text-shadow: 2px 2px 0px rgba(255,255,255,0.8), 4px 4px 15px rgba(0,0,0,0.1);
          transform-style: preserve-3d;
          transition: transform 0.2s ease-out;
        }
        .food-card-hover:hover .food-image {
          transform: scale(1.1) rotate(1deg);
        }
        .perspective-2000 { 
          perspective: 2000px; 
        }
        ::-webkit-scrollbar { 
          width: 6px; 
        }
        ::-webkit-scrollbar-track { 
          background: transparent; 
        }
        ::-webkit-scrollbar-thumb { 
          background: #cbd5e1; 
          border-radius: 10px; 
        }
        .cinematic-bg {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: -1;
          background-image: linear-gradient(to bottom, rgba(248, 250, 252, 0.2), rgba(248, 250, 252, 0.6)), 
                            url('https://images.unsplash.com/photo-1543353071-873f17a7a088?q=80&w=2000&auto=format&fit=crop');
          background-size: cover;
          background-position: center;
          opacity: 0.35;
          filter: saturate(0.9) blur(1px);
          animation: subtleZoom 25s infinite alternate ease-in-out;
        }
        @media (min-width: 768px) {
          .cinematic-bg {
            left: 16rem;
          }
        }
        .gradient-overlay {
          position: fixed;
          inset: 0;
          z-index: -1;
          background: radial-gradient(circle at center, transparent 0%, rgba(241, 245, 249, 0.4) 100%);
          pointer-events: none;
        }
        @media (min-width: 768px) {
          .gradient-overlay {
            left: 16rem;
          }
        }
      `}</style>

      {/* Cinematic Background Layers */}
      <div className="cinematic-bg fixed" />
      <div className="gradient-overlay fixed" />
      
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden md:left-64">
        <FloatingFoodItem icon={Apple} className="top-[15%] left-[5%]" delay="0s" duration="8s" />
        <FloatingFoodItem icon={Salad} className="top-[45%] right-[8%]" delay="2s" duration="10s" />
        <FloatingFoodItem icon={Soup} className="bottom-[10%] left-[10%]" delay="4s" duration="7s" />
        <FloatingFoodItem icon={Sandwich} className="bottom-[15%] right-[15%]" delay="1s" duration="9s" />
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-emerald-200/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-blue-200/20 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">

        {/* Header Section */}
        <header className="flex flex-col items-center text-center space-y-4 md:space-y-6 animate-fade-up perspective-2000 px-4">
          <div className="space-y-2 md:space-y-3">
            <div className="flex items-center justify-center gap-3">
              <span className="px-3 md:px-4 py-1 md:py-1.5 bg-slate-900/95 backdrop-blur text-white text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] rounded-full shadow-2xl">
                Biometric Portal
              </span>
            </div>
            <div 
              style={{ transform: `rotateX(${-mousePos.y * 0.5}deg) rotateY(${mousePos.x * 0.5}deg)` }}
              className="relative py-2"
            >
              <h1 className="text-3xl sm:text-4xl md:text-7xl font-black text-slate-900 tracking-tighter leading-tight text-3d typing-cursor px-2">
                {typedHeading}
              </h1>
            </div>
            <p className="text-slate-600 font-bold text-sm md:text-base lg:text-lg max-w-xl mx-auto leading-relaxed drop-shadow-sm px-4">
              Analyzing your metabolic output. <span className="text-slate-900">{profile.name}</span>, you're sustaining a{' '}
              <span className="text-emerald-600 font-black">94% consistency</span> score this morning.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 md:gap-4 w-full px-4">
            <button className="group relative px-6 md:px-8 py-3 md:py-4 bg-slate-900 text-white rounded-2xl font-black text-xs md:text-sm shadow-2xl hover:-translate-y-1 transition-all active:scale-95 overflow-hidden w-full sm:w-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative flex items-center justify-center gap-2">
                <Plus size={16} md:size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                Log New Meal
              </span>
            </button>
            <button className="px-6 md:px-8 py-3 md:py-4 bg-white/60 backdrop-blur-xl text-slate-900 border border-white rounded-2xl font-black text-xs md:text-sm shadow-lg hover:bg-white transition-all flex items-center justify-center gap-2 w-full sm:w-auto">
              <Calendar size={14} md:size={16} /> Trends
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 px-4">
          {[
            { label: "Energy", value: stats.calories, unit: "kcal", color: "bg-rose-500", icon: Flame, goal: profile.dailyCalorieGoal },
            { label: "Protein", value: stats.protein, unit: "g", color: "bg-emerald-500", icon: Zap, goal: profile.dailyProteinGoal },
            { label: "Carbs", value: stats.carbs, unit: "g", color: "bg-blue-500", icon: Award, goal: profile.dailyCarbsGoal },
            { label: "Fats", value: stats.fat, unit: "g", color: "bg-amber-500", icon: Droplets, goal: profile.dailyFatGoal }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className={`animate-fade-up`} 
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <NutrientCard 
                {...item}
                percentage={Math.round((item.value / item.goal) * 100)}
                delay={idx * 100}
              />
            </div>
          ))}
        </section>

        {/* Main Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start px-4">
          {/* Analysis Section */}
          <section className="lg:col-span-8 space-y-6 md:space-y-10">
            <div className="bg-white/60 backdrop-blur-3xl p-4 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border border-white/90 animate-fade-up">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-10 gap-4">
                <div>
                  <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">Macro Balance</h3>
                  <p className="text-slate-600 font-bold uppercase text-[8px] md:text-[9px] tracking-widest mt-1 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Synchronization Active
                  </p>
                </div>
                <div className="flex gap-1 p-1 bg-white/50 rounded-xl border border-white/80">
                  {['Day', 'Week'].map((t) => (
                    <button 
                      key={t} 
                      className={`px-3 md:px-4 py-1 md:py-1.5 text-[9px] md:text-[10px] font-black rounded-lg transition-all ${
                        t === 'Day' ? 'bg-white shadow-md text-slate-900' : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
                <div className="h-48 md:h-64 relative group">
                  {stats.calories > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%" 
                          cy="50%"
                          innerRadius={70} 
                          outerRadius={95}
                          paddingAngle={10} 
                          dataKey="value"
                          stroke="none"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            borderRadius: '16px', 
                            border: 'none', 
                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)' 
                          }} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                      <Target size={48} className="mb-2 opacity-20" />
                      <p className="text-sm font-medium">No meals logged today yet.</p>
                    </div>
                  )}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-4xl font-black text-slate-900 tracking-tight">{stats.calories}</span>
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Kcal</span>
                  </div>
                </div>

                <div className="space-y-6">
                  {chartData.map((macro) => (
                    <div key={macro.name} className="group">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{macro.name}</span>
                        <span className="text-sm font-black text-slate-900">{macro.value}g</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/40 rounded-full overflow-hidden border border-white/80">
                        <div 
                          className="h-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(0,0,0,0.05)]" 
                          style={{ 
                            width: `${(macro.value / 250) * 100}%`, 
                            backgroundColor: macro.color 
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Feature Showcase */}
            <div className="space-y-4 md:space-y-6 animate-fade-up">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-2 gap-2">
                <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Platform Features</h3>
                <div className="flex items-center gap-2 text-emerald-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest">AI Powered</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Feature 1: AI Food Scanner */}
                <div className="group relative bg-gradient-to-br from-emerald-500 to-teal-600 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden transition-all duration-700 hover:-translate-y-2 hover:shadow-emerald-500/30">
                  <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
                  <div className="relative z-10 space-y-3 md:space-y-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/30 shadow-xl animate-float">
                      <Sparkles size={20} className="text-white md:w-6 md:h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg md:text-xl font-black text-white tracking-tight mb-2">AI Food Scanner</h4>
                      <p className="text-emerald-50 text-xs md:text-sm font-medium leading-relaxed">
                        Powered by Gemini Vision 2.0, instantly analyze any meal through your camera or photos. Get detailed nutritional breakdowns, health scores, and dietary warnings in seconds.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-white/80 text-xs font-bold">
                      <CheckCircle2 size={14} /> Real-time Analysis
                    </div>
                  </div>
                </div>

                {/* Feature 2: Smart Meal Planning */}
                <div className="group relative bg-gradient-to-br from-blue-500 to-indigo-600 p-8 rounded-[2.5rem] shadow-2xl overflow-hidden transition-all duration-700 hover:-translate-y-2 hover:shadow-blue-500/30">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
                  <div className="relative z-10 space-y-4">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/30 shadow-xl animate-float" style={{ animationDelay: '0.5s' }}>
                      <Target size={24} className="text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-white tracking-tight mb-2">Smart Meal Planning</h4>
                      <p className="text-blue-50 text-sm font-medium leading-relaxed">
                        Personalized meal recommendations based on your BMI, BMR, and fitness goals. Supports weight loss, maintenance, gain, and pregnancy nutrition with trimester-specific guidance.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-white/80 text-xs font-bold">
                      <CheckCircle2 size={14} /> Personalized Plans
                    </div>
                  </div>
                </div>

                {/* Feature 3: Fitness Integration */}
                <div className="group relative bg-gradient-to-br from-purple-500 to-pink-600 p-8 rounded-[2.5rem] shadow-2xl overflow-hidden transition-all duration-700 hover:-translate-y-2 hover:shadow-purple-500/30">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
                  <div className="relative z-10 space-y-4">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/30 shadow-xl animate-float" style={{ animationDelay: '1s' }}>
                      <TrendingUp size={24} className="text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-white tracking-tight mb-2">Fitness Tracking</h4>
                      <p className="text-purple-50 text-sm font-medium leading-relaxed">
                        Comprehensive fitness dashboard with training sessions, sleep analytics, bio-dynamic charts, and social features. Track steps, calories, heart rate, and hydration in real-time.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-white/80 text-xs font-bold">
                      <CheckCircle2 size={14} /> Multi-Tab Analytics
                    </div>
                  </div>
                </div>

                {/* Feature 4: Barcode Scanner */}
                <div className="group relative bg-gradient-to-br from-amber-500 to-orange-600 p-8 rounded-[2.5rem] shadow-2xl overflow-hidden transition-all duration-700 hover:-translate-y-2 hover:shadow-amber-500/30">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
                  <div className="relative z-10 space-y-4">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/30 shadow-xl animate-float" style={{ animationDelay: '1.5s' }}>
                      <Zap size={24} className="text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-white tracking-tight mb-2">Barcode Scanner</h4>
                      <p className="text-amber-50 text-sm font-medium leading-relaxed">
                        Scan product barcodes to instantly retrieve nutritional information from Open Food Facts database. Live camera scanning, gallery upload, and manual code entry supported.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-white/80 text-xs font-bold">
                      <CheckCircle2 size={14} /> Instant Product Info
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Info Banner */}
              <div className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] border border-white shadow-xl p-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-900 to-slate-700 rounded-2xl flex items-center justify-center shadow-2xl flex-shrink-0">
                    <Info size={28} className="text-white" />
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-2xl font-black text-slate-900 tracking-tight">About NutriVision</h4>
                    <p className="text-slate-700 font-medium leading-relaxed">
                      NutriVision is an AI-powered nutrition tracking platform that combines computer vision, personalized meal planning, and fitness analytics. Built with React, TypeScript, and Google's Gemini AI, it provides real-time nutritional insights through advanced image recognition and data visualization.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {['React', 'TypeScript', 'Gemini AI', 'Recharts', 'Tailwind CSS'].map((tech) => (
                        <span key={tech} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-full border border-slate-200">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8 animate-fade-up">
            {/* Water Tracker (Sleek) */}
            <div className="relative overflow-hidden bg-slate-950 p-10 rounded-[2.5rem] text-white shadow-2xl group transition-all duration-700">
              <div className="absolute inset-0 z-0 opacity-40">
                <div className="w-full h-full bg-gradient-to-br from-blue-600/30 to-cyan-600/30" />
              </div>
              
              <div className="relative z-10 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-white/10 backdrop-blur-2xl rounded-xl border border-white/20 animate-float shadow-inner">
                    <Droplets size={20} className="text-blue-400" />
                  </div>
                  <span className="text-[9px] font-black text-blue-300 uppercase tracking-widest">Hydration</span>
                </div>
                
                <div>
                  <h4 className="text-5xl font-black tracking-tighter">
                    1.5<span className="text-base font-medium opacity-40">L</span>
                  </h4>
                  <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">Goal 3.5L</p>
                </div>
                
                <div className="h-2.5 w-full bg-white/10 rounded-full p-0.5 border border-white/10 overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)]" 
                    style={{ width: '42%' }} 
                  />
                </div>
                
                <button className="w-full py-4 bg-white text-slate-950 font-black rounded-2xl shadow-2xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2 text-xs">
                  <Plus size={16} /> Add 500ml
                </button>
              </div>
            </div>

            {/* Premium AI Advisor */}
            <div className="p-[1.5px] rounded-[2.5rem] bg-gradient-to-br from-white/80 via-slate-300 to-white/80 shadow-2xl overflow-hidden">
              <div className="bg-white/75 backdrop-blur-2xl p-8 rounded-[2.4rem] space-y-6">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-sm animate-float">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h5 className="text-sm font-black text-slate-900 tracking-tight">System Insight</h5>
                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Optimizing recovery</p>
                  </div>
                </div>
                
                <p className="text-[11px] font-medium text-slate-700 leading-relaxed italic drop-shadow-sm">
                  "Your metabolic velocity suggests a high protein requirement today. Consider a supplement within{' '}
                  <span className="text-emerald-600 font-bold">15 minutes</span>."
                </p>
                
                <button className="w-full py-3 text-emerald-600 font-black text-[10px] uppercase tracking-widest hover:bg-emerald-100/50 rounded-xl transition-all border border-emerald-100/50 shadow-sm">
                  Apply Correction
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
