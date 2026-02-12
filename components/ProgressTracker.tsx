import React, { useState, useEffect } from 'react';
import { 
  TrendingDown, TrendingUp, Calendar, Flame, Dumbbell, Scale, Target, Award, 
  Plus, Check, ChevronRight, Info, RefreshCcw, Utensils, Activity
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, Area, AreaChart 
} from 'recharts';
import { weightTrackingService, WeightEntry } from '../services/weightTrackingService';

// --- Styles for custom animations ---
const styleTag = `
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

.animate-slide-up { animation: slideUp 0.5s ease-out forwards; }
.animate-fade-in { animation: fadeIn 0.6s ease-in forwards; }
.animate-scale-in { animation: scaleIn 0.4s ease-out forwards; }
.animate-float { animation: float 3s ease-in-out infinite; }
.stagger-1 { animation-delay: 0.1s; }
.stagger-2 { animation-delay: 0.2s; }
.stagger-3 { animation-delay: 0.3s; }
.stagger-4 { animation-delay: 0.4s; }

.glass-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}
`;

interface WorkoutDay {
  date: string;
  completed: boolean;
}

const ProgressTracker: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'weight' | 'workout' | 'diet'>('weight');
  const [showAddWeight, setShowAddWeight] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState<number | null>(null);
  const [showSetTarget, setShowSetTarget] = useState(false);
  const [targetInput, setTargetInput] = useState('');
  const [userId, setUserId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Weight data from Firestore
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([]);

  // Load user data and weight history
  useEffect(() => {
    const loadUserData = async () => {
      const savedUser = localStorage.getItem('user');
      console.log('Loading user data...', savedUser);
      
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          console.log('User data:', user);
          setUserId(user.uid || '');
          
          // Load weight data from Firestore
          if (user.uid) {
            console.log('Fetching weight data for user:', user.uid);
            const weightData = await weightTrackingService.getWeightData(user.uid);
            console.log('Weight data received:', weightData);
            
            setWeightHistory(weightData.weightHistory || []);
            setTargetWeight(weightData.targetWeight || null);
            
            console.log('Weight history set:', weightData.weightHistory);
            console.log('Target weight set:', weightData.targetWeight);
          } else {
            console.warn('No user UID found');
          }
        } catch (e) {
          console.error('Error loading user data:', e);
        }
      } else {
        console.warn('No saved user found in localStorage');
      }
      setLoading(false);
    };

    loadUserData();
  }, []);

  // Add new weight entry
  const handleAddWeight = async () => {
    const weight = parseFloat(newWeight);
    if (weight && weight > 0 && userId) {
      try {
        await weightTrackingService.addWeightEntry(userId, weight);
        
        // Reload weight data
        const weightData = await weightTrackingService.getWeightData(userId);
        setWeightHistory(weightData.weightHistory);
        
        setNewWeight('');
        setShowAddWeight(false);
      } catch (error) {
        console.error('Error adding weight:', error);
        alert('Failed to add weight entry');
      }
    }
  };

  // Update target weight
  const handleSetTarget = async () => {
    const target = parseFloat(targetInput);
    if (target && target > 0 && userId) {
      try {
        await weightTrackingService.updateTargetWeight(userId, target);
        setTargetWeight(target);
        setTargetInput('');
        setShowSetTarget(false);
      } catch (error) {
        console.error('Error setting target:', error);
        alert('Failed to set target weight');
      }
    }
  };

  const generateLast30Days = (): WorkoutDay[] => {
    const days: WorkoutDay[] = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push({
        date: date.toISOString().split('T')[0],
        completed: Math.random() > 0.4,
      });
    }
    return days;
  };

  const [workoutStreak, setWorkoutStreak] = useState<WorkoutDay[]>(generateLast30Days());

  const dietProgress = [
    { day: 'Mon', calories: 1950, target: 2000, protein: 145, targetProtein: 150 },
    { day: 'Tue', calories: 2100, target: 2000, protein: 160, targetProtein: 150 },
    { day: 'Wed', calories: 1800, target: 2000, protein: 130, targetProtein: 150 },
    { day: 'Thu', calories: 2050, target: 2000, protein: 155, targetProtein: 150 },
    { day: 'Fri', calories: 1900, target: 2000, protein: 140, targetProtein: 150 },
    { day: 'Sat', calories: 2200, target: 2000, protein: 145, targetProtein: 150 },
    { day: 'Sun', calories: 2000, target: 2000, protein: 150, targetProtein: 150 },
  ];

  const currentWeight = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1]?.weight : 0;
  const startWeight = weightHistory.length > 0 ? weightHistory[0]?.weight : 0;
  
  // Calculate weight change (positive = gained, negative = lost)
  const weightChange = currentWeight && startWeight ? currentWeight - startWeight : 0;
  
  // Calculate remaining weight to reach goal
  // If target > current: need to gain (positive number)
  // If target < current: need to lose (negative number, but show as positive)
  const weightToGo = currentWeight && targetWeight ? Math.abs(targetWeight - currentWeight) : 0;
  
  // Determine if user is trying to lose or gain weight
  const isGainingWeight = targetWeight && currentWeight ? targetWeight > currentWeight : false;
  const isLosingWeight = targetWeight && currentWeight ? targetWeight < currentWeight : false;
  
  // Calculate progress percentage
  const progressPercentage = startWeight && currentWeight && targetWeight 
    ? Math.abs(((currentWeight - startWeight) / (targetWeight - startWeight)) * 100)
    : 0;

  // If no weight history, show message
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-500 font-medium">Loading your progress data...</p>
        </div>
      </div>
    );
  }

  const calculateStreak = () => {
    let streak = 0;
    for (let i = workoutStreak.length - 1; i >= 0; i--) {
      if (workoutStreak[i].completed) streak++;
      else break;
    }
    return streak;
  };

  const currentStreak = calculateStreak();
  const totalWorkouts = workoutStreak.filter(d => d.completed).length;
  const workoutRate = workoutStreak.length > 0 ? Math.round((totalWorkouts / workoutStreak.length) * 100) : 0;

  const toggleWorkout = (date: string) => {
    setWorkoutStreak(workoutStreak.map(day => 
      day.date === date ? { ...day, completed: !day.completed } : day
    ));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <style>{styleTag}</style>
      
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="animate-slide-up">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
              <Activity className="text-emerald-500 w-9 h-9" />
              Nutri<span className="text-emerald-500 underline decoration-emerald-200 decoration-4 underline-offset-8">Vision</span>
            </h1>
            <p className="text-slate-500 mt-3 text-lg font-medium">
              Elevate your fitness journey with precision tracking.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 animate-slide-up stagger-1">
            <div className="flex p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm glass-card">
              {(['weight', 'workout', 'diet'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 capitalize flex items-center gap-2 ${
                    activeTab === tab
                      ? 'bg-emerald-500 text-white shadow-lg scale-105'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {tab === 'weight' && <Scale size={16} />}
                  {tab === 'workout' && <Dumbbell size={16} />}
                  {tab === 'diet' && <Utensils size={16} />}
                  {tab}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => window.location.reload()}
              className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-emerald-500 hover:border-emerald-200 transition-all hover:rotate-180 duration-500"
              title="Refresh Data"
            >
              <RefreshCcw size={20} />
            </button>
          </div>
        </header>

        {/* Dynamic Content Hero Image */}
        <div className="relative h-48 md:h-64 rounded-3xl overflow-hidden shadow-2xl animate-scale-in">
          <img 
            src={
              activeTab === 'weight' 
                ? "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=1200" 
                : activeTab === 'workout' 
                ? "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1200" 
                : "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=1200"
            }
            className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
            alt="Hero Visual"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent flex flex-col justify-end p-8">
            <h2 className="text-white text-3xl font-bold capitalize">{activeTab} Analytics</h2>
            <p className="text-slate-200 font-medium">Real-time insights for your performance metrics.</p>
          </div>
        </div>

        {activeTab === 'weight' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { 
                  label: 'Current Weight', 
                  value: `${currentWeight} kg`, 
                  icon: Scale, 
                  color: 'from-emerald-600 to-emerald-700', 
                  stagger: 'stagger-1' 
                },
                { 
                  label: weightChange >= 0 ? 'Weight Gained' : 'Weight Lost', 
                  value: `${Math.abs(weightChange).toFixed(1)} kg`, 
                  icon: weightChange >= 0 ? TrendingUp : TrendingDown, 
                  color: 'from-emerald-500 to-teal-600', 
                  stagger: 'stagger-2' 
                },
                { 
                  label: 'Target Goal', 
                  value: targetWeight ? `${targetWeight} kg` : 'Not Set', 
                  icon: Target, 
                  color: 'from-emerald-400 to-emerald-500', 
                  stagger: 'stagger-3' 
                },
                { 
                  label: isGainingWeight ? 'To Gain' : isLosingWeight ? 'To Lose' : 'Remaining', 
                  value: targetWeight ? `${weightToGo.toFixed(1)} kg` : '--', 
                  icon: isGainingWeight ? TrendingUp : TrendingDown, 
                  color: 'from-teal-500 to-emerald-600', 
                  stagger: 'stagger-4' 
                }
              ].map((card, idx) => (
                <div 
                  key={idx} 
                  className={`group bg-gradient-to-br ${card.color} p-6 rounded-3xl text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-slide-up ${card.stagger}`}
                >
                  <card.icon size={28} className="mb-4 opacity-70 group-hover:scale-110 group-hover:opacity-100 transition-all" />
                  <p className="text-sm font-bold uppercase tracking-wider opacity-80">{card.label}</p>
                  <p className="text-4xl font-black mt-1">{card.value}</p>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">Weight Projection</h3>
                      <p className="text-slate-400 text-sm">Visualizing your trend over time</p>
                    </div>
                    <button 
                      onClick={() => setShowAddWeight(true)}
                      className="px-5 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl font-bold hover:bg-emerald-500 hover:text-white transition-all flex items-center gap-2"
                    >
                      <Plus size={18} /> Log Entry
                    </button>
                  </div>

                  <div className="h-[300px]">
                    {weightHistory.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-slate-400">
                        <Scale size={64} className="mb-4 opacity-20" />
                        <p className="text-lg font-bold mb-2">No Weight Data Yet</p>
                        <p className="text-sm text-center mb-6">Start tracking your progress by logging your first weight entry</p>
                        <button 
                          onClick={() => setShowAddWeight(true)}
                          className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all flex items-center gap-2"
                        >
                          <Plus size={18} /> Log Your First Weight
                        </button>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={weightHistory}>
                          <defs>
                            <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis 
                            dataKey="date" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#94a3b8', fontSize: 12}} 
                            dy={10} 
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#94a3b8', fontSize: 12}} 
                            domain={['dataMin - 5', 'dataMax + 5']} 
                          />
                          <Tooltip 
                            contentStyle={{
                              borderRadius: '16px', 
                              border: 'none', 
                              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                            }}
                            cursor={{stroke: '#10b981', strokeWidth: 2}}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="weight" 
                            stroke="#10b981" 
                            strokeWidth={4} 
                            fill="url(#weightGrad)" 
                            dot={{ r: 6, fill: '#10b981', strokeWidth: 3, stroke: '#fff' }} 
                            activeDot={{ r: 8, strokeWidth: 0 }} 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 h-full">
                  <h3 className="text-xl font-bold text-slate-800 mb-6">Goal Completion</h3>
                  
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="relative w-40 h-40 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle 
                          cx="80" 
                          cy="80" 
                          r="70" 
                          stroke="currentColor" 
                          strokeWidth="12" 
                          fill="transparent" 
                          className="text-slate-100" 
                        />
                        <circle 
                          cx="80" 
                          cy="80" 
                          r="70" 
                          stroke="currentColor" 
                          strokeWidth="12" 
                          fill="transparent" 
                          strokeDasharray={440} 
                          strokeDashoffset={440 - (440 * Math.min(progressPercentage, 100)) / 100}
                          className="text-emerald-500 transition-all duration-1000 ease-out" 
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black text-slate-800">{Math.round(progressPercentage)}%</span>
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Finished</span>
                      </div>
                    </div>

                    <div className="w-full pt-4 border-t border-slate-50 text-center">
                      <p className="text-slate-500 text-sm italic">
                        "Consistency is the key to transformation."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'workout' && (
          <div className="space-y-8 animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Current Streak', value: currentStreak, sub: 'Days on Fire', icon: Flame, color: 'from-emerald-600 to-emerald-700' },
                { label: 'Total Sessions', value: totalWorkouts, sub: 'Last 30 Days', icon: Dumbbell, color: 'from-emerald-500 to-teal-600' },
                { label: 'Consistency', value: `${workoutRate}%`, sub: 'Adherence Rate', icon: Award, color: 'from-emerald-400 to-emerald-500' }
              ].map((card, idx) => (
                <div 
                  key={idx} 
                  className={`bg-gradient-to-br ${card.color} p-8 rounded-3xl text-white shadow-xl hover:scale-105 transition-transform duration-300`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <card.icon size={32} className="opacity-80" />
                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md">
                      Active Metric
                    </span>
                  </div>
                  <p className="text-5xl font-black">{card.value}</p>
                  <p className="text-sm font-bold uppercase tracking-widest mt-2 opacity-70">{card.label}</p>
                  <p className="text-xs opacity-50 mt-1">{card.sub}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <Calendar className="text-emerald-500" /> Training Rhythm
                  </h3>
                  <p className="text-slate-400 mt-1">Consistency check over the last 30 active days</p>
                </div>
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-10 gap-4">
                {workoutStreak.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => toggleWorkout(day.date)}
                    className={`group relative aspect-square rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                      day.completed 
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' 
                        : 'bg-slate-50 text-slate-300 hover:bg-slate-100 hover:text-slate-400 border border-slate-100'
                    }`}
                  >
                    <span className="text-xs font-bold">{new Date(day.date).getDate()}</span>
                    {day.completed && <Check size={14} className="absolute top-1 right-1 opacity-50" />}
                    
                    {/* Tooltip */}
                    <div className="absolute -top-10 scale-0 group-hover:scale-100 bg-slate-800 text-white text-[10px] py-1 px-2 rounded transition-transform">
                      {day.date}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-emerald-950 rounded-3xl p-10 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-emerald-500/30 transition-colors"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="bg-emerald-500 p-6 rounded-3xl shadow-2xl shadow-emerald-500/20 animate-float">
                  <Flame size={48} />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-3xl font-black mb-3">Unstoppable Momentum</h3>
                  <p className="text-emerald-100 max-w-xl leading-relaxed opacity-80">
                    You've hit {totalWorkouts} sessions this month. At this rate, you're statistically 85% more likely to reach your goal within the next 90 days. Keep the fire burning.
                  </p>
                  <button className="mt-6 px-8 py-3 bg-white text-emerald-900 rounded-2xl font-bold hover:bg-emerald-400 hover:text-white transition-all flex items-center gap-2 mx-auto md:mx-0">
                    Share Achievements <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'diet' && (
          <div className="space-y-8 animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Avg Calories', value: '1985', icon: Target, color: 'from-emerald-600 to-emerald-700', sub: 'kcal / day' },
                { label: 'Protein Target', value: '148g', icon: Dumbbell, color: 'from-emerald-500 to-teal-600', sub: 'Daily average' },
                { label: 'Adherence', value: '6/7', icon: Award, color: 'from-emerald-400 to-emerald-500', sub: 'Days on track' }
              ].map((card, idx) => (
                <div 
                  key={idx} 
                  className={`bg-gradient-to-br ${card.color} p-8 rounded-3xl text-white shadow-xl group hover:-rotate-1 transition-all`}
                >
                  <card.icon size={28} className="mb-4 opacity-70 group-hover:scale-125 transition-transform" />
                  <p className="text-sm font-bold opacity-80 uppercase tracking-widest">{card.label}</p>
                  <p className="text-4xl font-black mt-1">{card.value}</p>
                  <p className="text-xs opacity-60 mt-1">{card.sub}</p>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
                  Calorie Management
                </h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dietProgress}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#94a3b8', fontSize: 12}} 
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#94a3b8', fontSize: 12}} 
                      />
                      <Tooltip 
                        cursor={{fill: '#f8fafc'}} 
                        contentStyle={{
                          borderRadius: '16px', 
                          border: 'none', 
                          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                        }} 
                      />
                      <Bar dataKey="calories" fill="#10b981" radius={[10, 10, 0, 0]} barSize={32} />
                      <Bar dataKey="target" fill="#e2e8f0" radius={[10, 10, 0, 0]} barSize={32} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold text-slate-800 mb-8">Macro Adherence</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dietProgress}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#94a3b8', fontSize: 12}} 
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#94a3b8', fontSize: 12}} 
                      />
                      <Tooltip 
                        contentStyle={{
                          borderRadius: '16px', 
                          border: 'none', 
                          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="protein" 
                        stroke="#059669" 
                        strokeWidth={4} 
                        dot={{r:6, fill: '#059669', strokeWidth: 3, stroke: '#fff'}} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="targetProtein" 
                        stroke="#cbd5e1" 
                        strokeWidth={2} 
                        strokeDasharray="5 5" 
                        dot={false} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="bg-emerald-600 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-emerald-200">
              <div className="flex items-center gap-6">
                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                  <Info size={32} />
                </div>
                <div>
                  <h4 className="text-xl font-bold">Smart Sync Enabled</h4>
                  <p className="text-emerald-100 opacity-80">
                    Your dietary data is automatically updated from your meal scans.
                  </p>
                </div>
              </div>
              <button className="bg-white text-emerald-600 px-8 py-3 rounded-2xl font-bold hover:bg-emerald-50 transition-colors shadow-lg">
                View Meal Logs
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Text */}
      <footer className="max-w-6xl mx-auto mt-12 mb-8 text-center animate-fade-in stagger-4">
        <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">
          &copy; 2024 NutriVision Analytics • v2.1 Cinematic Green
        </p>
      </footer>

      {/* Modal - Add Weight Entry */}
      {showAddWeight && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-scale-in">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">New Weight Entry</h3>
            <p className="text-slate-500 mb-6">Stay accountable by tracking your progress today.</p>
            
            <input 
              type="number" 
              placeholder="0.0 kg" 
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 outline-none text-2xl font-bold mb-6 transition-colors"
            />
            
            <div className="flex gap-4">
              <button 
                onClick={handleAddWeight}
                disabled={!newWeight || parseFloat(newWeight) <= 0}
                className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Log Entry
              </button>
              <button 
                onClick={() => setShowAddWeight(false)}
                className="px-8 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;
