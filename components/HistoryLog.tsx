import React, { useState, useEffect, useMemo } from 'react';
import { 
  Clock, ExternalLink, X, CheckCircle2, AlertCircle, Calendar,
  Zap, Leaf, Info, Trash2, Check, CheckSquare, Scan, RefreshCcw, 
  Sparkles, BarChart3, ShieldCheck, Cpu, Fingerprint, Activity
} from 'lucide-react';

/**
 * ADVANCED CINEMATIC & SCANNING STYLES
 */
const customStyles = `
@keyframes laser-sweep {
  0% { transform: translateY(-20%); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(120%); opacity: 0; }
}

@keyframes text-shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

@keyframes grid-fade {
  0%, 100% { opacity: 0.1; }
  50% { opacity: 0.3; }
}

.animate-laser {
  animation: laser-sweep 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

.text-shimmer {
  background: linear-gradient(90deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 1) 50%, rgba(16, 185, 129, 0.2) 100%);
  background-size: 200% auto;
  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  animation: text-shimmer 4s linear infinite;
}

.scanning-overlay {
  background: linear-gradient(to bottom, transparent 0%, rgba(16, 185, 129, 0.05) 50%, transparent 100%);
}

.perspective-1000 {
  perspective: 1000px;
}

.card-3d {
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.6s ease;
  transform-style: preserve-3d;
}

.group:hover .card-3d {
  transform: rotateX(2deg) rotateY(-2deg) translateY(-10px);
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
`;

/**
 * SUB-COMPONENT: StatsRibbon
 */
const StatsRibbon = ({ logs }) => {
  const stats = useMemo(() => {
    if (!logs.length) return null;
    const avgScore = (logs.reduce((acc, log) => acc + log.nutrition.healthScore, 0) / logs.length).toFixed(1);
    const totalProtein = logs.reduce((acc, log) => acc + log.nutrition.protein, 0);
    return [
      { label: 'Avg Health Grade', value: avgScore, unit: '/10', icon: <ShieldCheck className="text-emerald-500" /> },
      { label: 'Total Protein', value: totalProtein, unit: 'g', icon: <Zap className="text-blue-500" /> },
      { label: 'Neural Accuracy', value: '98.4', unit: '%', icon: <Cpu className="text-amber-500" /> },
      { label: 'Archive Density', value: logs.length, unit: 'Logs', icon: <BarChart3 className="text-indigo-500" /> },
    ];
  }, [logs]);

  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 animate-in fade-in slide-in-from-top-8 duration-1000">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white/60 backdrop-blur-xl border border-slate-100 p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-500 group">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-500">
              {stat.icon}
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-900">{stat.value}</span>
            <span className="text-sm font-bold text-slate-300 uppercase">{stat.unit}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * SUB-COMPONENT: MealScoreCard
 */
const MealScoreCard = ({ score, calories, protein, carbs, fat, fiber, sugar, showDetails }) => {
  const getScoreColor = (s) => {
    if (s >= 8) return 'text-emerald-500 bg-emerald-50 border-emerald-100';
    if (s >= 6) return 'text-amber-500 bg-amber-50 border-amber-100';
    return 'text-rose-500 bg-rose-50 border-rose-100';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden group">
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-emerald-50 rounded-full blur-2xl group-hover:bg-emerald-100 transition-colors duration-700"></div>
      
      <div className="flex items-center justify-between mb-5 relative z-10">
        <div>
          <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1 flex items-center gap-1">
            <Sparkles size={10} className="text-emerald-400" />
            Score
          </h4>
          <p className="text-3xl font-black text-slate-900 tracking-tighter flex items-baseline">
            {score}
            <span className="text-slate-200 text-lg ml-1 font-bold">/10</span>
          </p>
        </div>
        <div className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center font-black text-2xl transition-all duration-700 group-hover:scale-110 shadow-md ${getScoreColor(score)}`}>
          {score >= 8 ? 'A' : score >= 6 ? 'B' : 'C'}
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        {[
          { label: 'Protein', value: protein, unit: 'g', color: 'bg-emerald-500' },
          { label: 'Carbs', value: carbs, unit: 'g', color: 'bg-amber-500' },
          { label: 'Fat', value: fat, unit: 'g', color: 'bg-rose-500' }
        ].map((macro) => (
          <div key={macro.label}>
            <div className="flex justify-between items-end mb-1.5">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">{macro.label}</span>
              <span className="text-xs font-black text-slate-900">{macro.value}{macro.unit}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full ${macro.color} transition-all duration-[2s] ease-out`} 
                style={{ width: `${Math.min(macro.value * 2.5, 100)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * MAIN COMPONENT: HistoryLog
 */
interface HistoryLogProps {
  logs?: any[];
  onDeleteLog?: (id: string) => void;
  onDeleteMultiple?: (ids: string[]) => void;
}

const HistoryLog: React.FC<HistoryLogProps> = ({ logs = [], onDeleteLog, onDeleteMultiple }) => {
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    handleRefresh();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate a deep neural scan
    setTimeout(() => setIsRefreshing(false), 3000);
  };

  const sortedLogs = [...logs].sort((a, b) => b.timestamp - a.timestamp);

  const toggleSelect = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className={`max-w-7xl mx-auto px-6 py-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
      <style>{customStyles}</style>

      {/* Cinematic Header */}
      <header className="mb-20 flex flex-col items-center text-center space-y-8">
        <div className="inline-flex items-center gap-4 px-6 py-2 bg-slate-950 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl hover:bg-emerald-950 transition-all cursor-pointer group">
          <Activity size={14} className={`text-emerald-400 ${isRefreshing ? 'animate-pulse' : ''}`} />
          {isRefreshing ? 'AI Scanning in Progress...' : 'Biometric Terminal Active'}
        </div>

        <div className="space-y-4 max-w-4xl relative">
          <h2 className="text-7xl lg:text-9xl font-black text-slate-900 tracking-tighter leading-[0.8] relative z-10">
            Nutritional <br />
            <span className="text-shimmer italic">Chronicles</span>
          </h2>
          <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto leading-relaxed relative z-10">
            The vault is open. Every nutrient and biological trend has been indexed for high-fidelity analysis.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4 relative z-10">
          <button 
            onClick={handleRefresh}
            className={`group relative flex items-center gap-3 px-12 py-6 bg-slate-900 text-white rounded-[2.5rem] text-sm font-black transition-all duration-500 hover:bg-emerald-600 hover:shadow-[0_25px_50px_-12px_rgba(16,185,129,0.5)] active:scale-95 overflow-hidden ${isRefreshing ? 'opacity-70 pointer-events-none' : ''}`}
          >
            <div className={`absolute inset-0 bg-emerald-400/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500`}></div>
            <RefreshCcw size={20} className={`relative z-10 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="relative z-10 uppercase tracking-widest">
              {isRefreshing ? 'Reading Data...' : 'Initiate Neural Scan'}
            </span>
          </button>

          {selectedIds.length > 0 && (
            <button 
              onClick={() => { onDeleteMultiple?.(selectedIds); setSelectedIds([]); }}
              className="flex items-center gap-3 px-10 py-6 bg-rose-50 text-rose-600 rounded-[2.5rem] font-black text-sm hover:bg-rose-600 hover:text-white transition-all duration-500 shadow-xl shadow-rose-100 animate-in zoom-in-90"
            >
              <Trash2 size={20} />
              Purge {selectedIds.length} Logs
            </button>
          )}

          <button 
            onClick={() => setSelectedIds(selectedIds.length === logs.length ? [] : logs.map(l => l.id))}
            className={`p-6 rounded-[2rem] transition-all duration-500 shadow-sm border ${selectedIds.length === logs.length ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-white text-slate-300 border-slate-100 hover:text-slate-900'}`}
          >
            <CheckSquare size={26} />
          </button>
        </div>
      </header>

      {/* Aggregate Stats Section */}
      <StatsRibbon logs={logs} />

      {/* Main Grid Content with Global Scanning Overlay */}
      <div className="relative">
        {/* Global Laser Sweep Overlay */}
        {isRefreshing && (
          <div className="absolute inset-x-0 inset-y-0 z-50 pointer-events-none">
            <div className="sticky top-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_30px_rgba(52,211,153,1)] animate-laser"></div>
            <div className="absolute inset-0 bg-emerald-400/5 backdrop-blur-[1px] animate-in fade-in duration-700"></div>
          </div>
        )}

        {sortedLogs.length === 0 ? (
          <div className="bg-white/40 backdrop-blur-xl border border-slate-100 rounded-[5rem] p-40 text-center shadow-sm animate-in zoom-in-95 duration-1000">
            <div className="w-40 h-40 bg-slate-50 rounded-[4rem] flex items-center justify-center mx-auto mb-12 relative overflow-hidden group">
              <div className="absolute inset-0 bg-emerald-400/10 rounded-full blur-3xl animate-pulse"></div>
              <Scan size={80} className="text-slate-200 relative z-10 group-hover:text-emerald-400 transition-all duration-700" />
            </div>
            <h3 className="text-5xl font-black text-slate-900 tracking-tighter">Terminal Idle</h3>
            <p className="text-slate-400 mt-6 max-w-md mx-auto text-xl font-medium leading-relaxed">
              System waiting for biometric food data. Access the scanner to begin.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 perspective-1000">
            {sortedLogs.map((log, index) => {
              const isSelected = selectedIds.includes(log.id);
              return (
                <div 
                  key={log.id} 
                  onClick={() => setSelectedMeal(log)}
                  className={`group relative bg-white border-2 rounded-3xl transition-all duration-700 cursor-pointer flex flex-col h-full animate-in slide-in-from-bottom-20 fade-in fill-mode-both ${
                    isSelected 
                      ? 'border-emerald-500 shadow-2xl scale-[1.05] z-10' 
                      : 'border-slate-50 shadow-lg shadow-slate-100/40 hover:shadow-xl hover:border-emerald-200 hover:-translate-y-3'
                  }`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="card-3d relative w-full h-full flex flex-col rounded-3xl overflow-hidden">
                    {/* High Fidelity Media Section */}
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={log.imageUrl} 
                        alt={log.nutrition.foodName} 
                        className={`w-full h-full object-cover transition-transform duration-[4s] cubic-bezier(0.4, 0, 0.2, 1) ${
                          isSelected ? 'scale-110' : 'group-hover:scale-125'
                        }`} 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/10 to-transparent opacity-90 z-20"></div>

                      {/* Selection Box */}
                      <div className="absolute top-4 left-4 z-40">
                        <button 
                          onClick={(e) => toggleSelect(e, log.id)}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-500 border-2 ${
                            isSelected 
                              ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg scale-110' 
                              : 'bg-white/80 backdrop-blur-xl border-white/40 text-slate-300 opacity-0 group-hover:opacity-100'
                          }`}
                        >
                          {isSelected ? (
                            <Check size={18} strokeWidth={4} />
                          ) : (
                            <div className="w-4 h-4 rounded-md border-2 border-current"></div>
                          )}
                        </button>
                      </div>

                      <div className="absolute bottom-4 left-4 z-20">
                        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-2xl px-3 py-1.5 rounded-full border border-white/10">
                          <div className={`w-2 h-2 rounded-full ${log.nutrition.healthScore >= 7 ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`}></div>
                          <span className="text-[9px] font-black text-white uppercase tracking-wider">
                            {log.nutrition.healthScore}/10
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-5 flex flex-col flex-1 relative z-20 bg-white">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1 min-w-0 pr-3">
                          <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-600 transition-all duration-500 truncate tracking-tight">
                            {log.nutrition.foodName}
                          </h3>
                          <p className="text-xs font-bold text-slate-400 mt-1.5 flex items-center gap-2">
                            <Calendar size={12} className="text-emerald-500/50" />
                            <span className="uppercase tracking-wider text-[9px]">
                              {new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            </span>
                          </p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-700 transform group-hover:rotate-[15deg] group-hover:scale-110">
                          <ExternalLink size={16} />
                        </div>
                      </div>

                      {/* Micro-Stats Display */}
                      <div className="grid grid-cols-3 gap-3 mt-auto">
                        {[
                          { l: 'Energy', v: log.nutrition.calories, u: 'kcal' },
                          { l: 'Protein', v: log.nutrition.protein, u: 'g' },
                          { l: 'Carbs', v: log.nutrition.carbs, u: 'g' }
                        ].map((stat, i) => (
                          <div key={i} className="text-center group/stat">
                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-wider mb-1">
                              {stat.l}
                            </p>
                            <p className="text-lg font-black text-slate-900 group-hover:text-emerald-500 transition-colors duration-500">
                              {stat.v}
                              <span className="text-[9px] ml-0.5 text-slate-200 font-bold">{stat.u}</span>
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Analysis Progress Line */}
                    <div className="h-2 w-full bg-slate-50 relative overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-[2s] ease-in-out ${
                          log.nutrition.healthScore >= 7 
                            ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' 
                            : 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                        }`}
                        style={{ width: isVisible ? `${log.nutrition.healthScore * 10}%` : '0%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cinematic Modal View */}
      {selectedMeal && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-3xl z-50 flex items-center justify-center p-6 transition-all animate-in fade-in duration-700">
          <div className="bg-white rounded-[3rem] max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-12 duration-700 no-scrollbar relative">
            {/* Modal Header/Image */}
            <div className="relative h-[280px] w-full">
              <img 
                src={selectedMeal.imageUrl} 
                alt={selectedMeal.nutrition.foodName} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white"></div>

              <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-20">
                <div className="bg-emerald-500 text-white px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-2 shadow-xl">
                  <Fingerprint size={14} className="animate-pulse" /> Verified
                </div>
                <button
                  onClick={() => setSelectedMeal(null)}
                  className="w-12 h-12 bg-white/10 backdrop-blur-2xl text-white rounded-2xl hover:bg-white hover:text-slate-900 transition-all duration-500 border border-white/20 flex items-center justify-center group"
                >
                  <X size={24} className="group-hover:rotate-90 transition-transform duration-500" />
                </button>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                <h2 className="text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-tight mb-3">
                  {selectedMeal.nutrition.foodName}
                </h2>
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-emerald-500" />
                  <span className="text-slate-600 font-bold text-sm">
                    {new Date(selectedMeal.timestamp).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Details Grid */}
            <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-20">
              <div className="space-y-6">
                <MealScoreCard 
                  score={selectedMeal.nutrition.healthScore}
                  calories={selectedMeal.nutrition.calories}
                  protein={selectedMeal.nutrition.protein}
                  carbs={selectedMeal.nutrition.carbs}
                  fat={selectedMeal.nutrition.fat}
                  fiber={selectedMeal.nutrition.fiber}
                  sugar={selectedMeal.nutrition.sugar}
                  showDetails={true}
                />
              </div>

              <div className="space-y-6">
                {selectedMeal.nutrition.healthBenefits?.length > 0 && (
                  <section>
                    <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                      <div className="w-8 h-px bg-emerald-200"></div>
                      Health Benefits
                    </h3>
                    <div className="space-y-3">
                      {selectedMeal.nutrition.healthBenefits.map((benefit, i) => (
                        <div key={i} className="group/ben flex items-center gap-4 p-4 bg-emerald-50/40 rounded-2xl border border-emerald-100 hover:bg-emerald-50 transition-all duration-300">
                          <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover/ben:scale-110 flex-shrink-0">
                            <CheckCircle2 size={18} />
                          </div>
                          <span className="text-emerald-900 font-bold text-sm leading-tight">
                            {benefit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                <div className="pt-4">
                  <button
                    onClick={() => setSelectedMeal(null)}
                    className="w-full py-4 bg-slate-950 text-white font-black text-sm rounded-2xl hover:bg-emerald-600 transition-all duration-500 shadow-xl active:scale-[0.98]"
                  >
                    Close Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Immersive Background Elements */}
      <div className="fixed inset-0 -z-30 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-[5%] left-[50%] -translate-x-1/2 w-[1200px] h-[600px] bg-emerald-100/30 rounded-full blur-[200px] animate-pulse"></div>
        <div className="absolute top-[40%] left-[-10%] w-[800px] h-[800px] bg-blue-100/20 rounded-full blur-[180px]"></div>
      </div>
    </div>
  );
};

export default HistoryLog;
