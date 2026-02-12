import React, { useState, useEffect } from 'react';
import { 
  Eye, Target, Play, Utensils, TrendingUp, Users, Heart, Footprints, Droplets, 
  Flame, Moon, Battery, ChevronRight, Zap, Activity, Plus, ArrowUpRight, Pill, 
  MapPin, Award
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, 
  AreaChart, Area
} from 'recharts';

const FitnessIntegration: React.FC = () => {
  const [activeView, setActiveView] = useState('overview');
  const [isLoaded, setIsLoaded] = useState(false);
  const [waterAmount, setWaterAmount] = useState(2.1);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const weeklyData = [
    { day: 'Mon', burned: 450, steps: 8500, rem: 1.5, deep: 2.1, light: 4.2 },
    { day: 'Tue', burned: 520, steps: 10200, rem: 1.8, deep: 2.3, light: 4.0 },
    { day: 'Wed', burned: 380, steps: 7800, rem: 1.2, deep: 1.9, light: 4.5 },
    { day: 'Thu', burned: 600, steps: 12000, rem: 1.6, deep: 2.5, light: 4.1 },
    { day: 'Fri', burned: 420, steps: 9100, rem: 1.7, deep: 2.2, light: 4.3 },
    { day: 'Sat', burned: 700, steps: 15000, rem: 2.0, deep: 2.8, light: 4.8 },
    { day: 'Sun', burned: 300, steps: 6500, rem: 1.5, deep: 2.0, light: 3.9 },
  ];

  const trainingSessions = [
    { id: 1, title: "Hyper-Focus Yoga Flow", instructor: "Elena Reyes", duration: "45:00", intensity: "Low", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800", isLive: true },
    { id: 2, title: "Peak Velocity HIIT", instructor: "Marcus Vane", duration: "30:15", intensity: "High", image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800", isLive: false },
    { id: 3, title: "Lower Body Explosiveness", instructor: "Sarah Chen", duration: "60:00", intensity: "Elite", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800", isLive: false }
  ];

  const supplementStack = [
    { name: 'Creatine Monohydrate', dosage: '5g', time: 'Post-Workout', status: 'Taken' },
    { name: 'Omega-3 Fish Oil', dosage: '2000mg', time: 'Breakfast', status: 'Taken' },
    { name: 'Vitamin D3 + K2', dosage: '5000IU', time: 'Lunch', status: 'Pending' },
    { name: 'Magnesium Glycinate', dosage: '400mg', time: 'Evening', status: 'Pending' },
  ];

  const handleWaterClick = () => {
    setWaterAmount(prev => Math.min(prev + 0.25, 4.0));
  };

  return (
    <div className="space-y-8 pb-20">
      <style>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
      `}</style>

      {/* Dynamic Visual Accents */}
      <div className="fixed inset-0 pointer-events-none z-0 md:left-64">
        <div className="absolute top-[-5%] left-[-2%] w-[40%] h-[40%] bg-emerald-100/50 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[50%] bg-blue-50/50 rounded-full blur-[100px]" />
      </div>

      <div className={`relative z-10 transition-all duration-1000 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Header */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 gap-8">
          <div className="space-y-1 group">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-200 transform group-hover:scale-110 transition-all duration-500">
                <Eye className="text-white" size={32} />
              </div>
              <div>
                <h2 className="text-4xl font-black tracking-tighter text-slate-900 leading-none">
                  NUTRI<span className="text-emerald-500">VISION</span>
                </h2>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Vision OS v4.2</p>
                </div>
              </div>
            </div>
          </div>

          <nav className="flex flex-wrap p-1.5 bg-white/80 backdrop-blur-2xl shadow-xl shadow-slate-200/40 rounded-[2rem] border border-white">
            {[
              { id: 'overview', label: 'Home', icon: Target },
              { id: 'training', label: 'Gym', icon: Play },
              { id: 'nutrition', label: 'Fuel', icon: Utensils },
              { id: 'analytics', label: 'Bio', icon: TrendingUp },
              { id: 'social', label: 'Feed', icon: Users }
            ].map((view) => (
              <button
                key={view.id}
                onClick={() => setActiveView(view.id)}
                className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-500 ${
                  activeView === view.id
                    ? 'bg-slate-900 text-white shadow-xl scale-105'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <view.icon size={16} />
                <span className="hidden sm:inline">{view.label}</span>
              </button>
            ))}
          </nav>
        </header>

        {/* Overview Tab */}
        {activeView === 'overview' && (
          <div className="space-y-10">
            {/* Hero */}
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 relative h-[500px] rounded-[3.5rem] overflow-hidden group shadow-2xl border-4 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=1600" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[4000ms]" 
                  alt="Fitness Hero"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent" />
                <div className="absolute inset-0 p-12 flex flex-col justify-center">
                  <div className="max-w-md space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 rounded-full text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-100">
                      <Battery size={14} /> Readiness: 94%
                    </div>
                    <h1 className="text-6xl font-black text-slate-900 leading-[1.05] tracking-tighter">
                      Visualize <br />
                      <span className="text-emerald-500">Peak Performance.</span>
                    </h1>
                    <p className="text-slate-500 text-lg font-medium leading-relaxed">
                      Your metabolic engine is running hot today. Perfect conditions for high-intensity output.
                    </p>
                    <button className="px-8 py-4 bg-slate-900 text-white font-black rounded-2xl shadow-2xl hover:bg-slate-800 transition-all flex items-center gap-2">
                      Resume Workout <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Vitals Sidebar */}
              <div className="space-y-6">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 bg-rose-50 rounded-2xl text-rose-500">
                      <Heart size={24} className="animate-pulse" />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-time Vitals</span>
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Heart Rate</p>
                  <div className="flex items-baseline gap-2 mb-6">
                    <h3 className="text-5xl font-black text-slate-900 tracking-tighter">72</h3>
                    <span className="text-sm font-bold text-slate-400">BPM</span>
                  </div>
                  <div className="h-16 w-full opacity-30">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[{v:68},{v:72},{v:70},{v:74},{v:72},{v:75}]}>
                        <Line type="monotone" dataKey="v" stroke="#f43f5e" strokeWidth={3} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-emerald-500 p-8 rounded-[2.5rem] text-white shadow-xl shadow-emerald-200 relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                  <div className="flex items-center justify-between mb-4">
                    <Zap size={24} />
                    <span className="text-[10px] font-black uppercase opacity-70">Daily Goal</span>
                  </div>
                  <h4 className="text-lg font-black mb-1">Energy Surplus</h4>
                  <p className="text-3xl font-black mb-4">
                    +420 <span className="text-sm opacity-60">kcal</span>
                  </p>
                  <div className="h-2 w-full bg-white/20 rounded-full">
                    <div className="h-full bg-white w-[85%] rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Movement steps', val: '8,234', icon: Footprints, c: 'text-emerald-500', bg: 'bg-emerald-50' },
                { label: 'Fluid Intake', val: `${waterAmount.toFixed(1)}L`, icon: Droplets, c: 'text-blue-500', bg: 'bg-blue-50' },
                { label: 'Burn Velocity', val: '1,850', icon: Flame, c: 'text-orange-500', bg: 'bg-orange-50' },
                { label: 'Rest Cycles', val: '7h 12m', icon: Moon, c: 'text-indigo-500', bg: 'bg-indigo-50' }
              ].map((stat, i) => (
                <div 
                  key={i} 
                  className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:-translate-y-2 transition-all duration-500"
                >
                  <div className={`w-12 h-12 ${stat.bg} ${stat.c} rounded-2xl flex items-center justify-center mb-6`}>
                    <stat.icon size={22} />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.val}</h3>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Training Tab - Simplified for brevity */}
        {activeView === 'training' && (
          <div className="space-y-12">
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Visual Workouts</h3>
                <p className="text-slate-500 font-black text-xs tracking-widest mt-1">
                  Immersive performance sessions
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
              {trainingSessions.map(session => (
                <div 
                  key={session.id} 
                  className="group bg-white rounded-[3.5rem] overflow-hidden shadow-2xl border border-white transition-all duration-500 hover:-translate-y-4"
                >
                  <div className="relative h-72 overflow-hidden bg-slate-900">
                    <img 
                      src={session.image} 
                      className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000" 
                      alt={session.title} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    
                    {session.isLive && (
                      <div className="absolute top-6 left-6 bg-red-500 text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 animate-pulse shadow-lg">
                        <div className="w-1.5 h-1.5 bg-white rounded-full" /> Live Flow
                      </div>
                    )}
                    
                    <div className="absolute bottom-6 left-8 text-white">
                      <h4 className="text-2xl font-black tracking-tight">{session.title}</h4>
                      <p className="text-sm font-bold opacity-70">with {session.instructor}</p>
                    </div>
                    
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-all duration-500 shadow-2xl">
                      <Play size={24} fill="currentColor" />
                    </div>
                  </div>
                  
                  <div className="p-10 flex items-center justify-between">
                    <div className="flex gap-6">
                      <div className="text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Time</p>
                        <p className="font-black text-slate-900">{session.duration}</p>
                      </div>
                      <div className="w-px h-8 bg-slate-100" />
                      <div className="text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Intensity</p>
                        <p className="font-black text-emerald-500">{session.intensity}</p>
                      </div>
                    </div>
                    <button className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-emerald-500 transition-all">
                      <ArrowUpRight size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other tabs would go here - keeping it concise for file size */}
        {activeView === 'nutrition' && (
          <div className="text-center py-20">
            <Utensils size={64} className="mx-auto mb-4 text-emerald-500" />
            <h3 className="text-3xl font-black text-slate-900">Nutrition Tab</h3>
            <p className="text-slate-500 mt-2">Coming soon with meal scanning features</p>
          </div>
        )}

        {activeView === 'analytics' && (
          <div className="text-center py-20">
            <TrendingUp size={64} className="mx-auto mb-4 text-emerald-500" />
            <h3 className="text-3xl font-black text-slate-900">Analytics Tab</h3>
            <p className="text-slate-500 mt-2">Coming soon with detailed bio metrics</p>
          </div>
        )}

        {activeView === 'social' && (
          <div className="text-center py-20">
            <Users size={64} className="mx-auto mb-4 text-emerald-500" />
            <h3 className="text-3xl font-black text-slate-900">Social Feed</h3>
            <p className="text-slate-500 mt-2">Coming soon with community features</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FitnessIntegration;
