import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Zap, Award, 
  ChevronDown, ChevronUp, Flame, UtensilsCrossed, Layers, Activity, 
  X, Info
} from 'lucide-react';

interface MealScoreCardProps {
  score: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  showDetails?: boolean;
  mealName?: string;
  imageUrl?: string;
}

const MealScoreCard: React.FC<MealScoreCardProps> = ({
  score = 8.8,
  calories = 650,
  protein = 32,
  carbs = 45,
  fat = 22,
  fiber = 8,
  sugar = 4,
  mealName = "Grilled Salmon & Quinoa Bowl",
  imageUrl = "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=800",
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showMacroDetails, setShowMacroDetails] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 8) return { bg: 'from-emerald-500 to-teal-600', text: 'text-emerald-600', label: 'Excellent', icon: Award };
    if (score >= 6) return { bg: 'from-blue-500 to-indigo-600', text: 'text-blue-600', label: 'Good', icon: CheckCircle2 };
    return { bg: 'from-rose-500 to-red-600', text: 'text-rose-600', label: 'Poor', icon: TrendingDown };
  };

  const scoreData = getScoreColor(score);
  const ScoreIcon = scoreData.icon;

  const totalMacros = (protein * 4) + (carbs * 4) + (fat * 9);
  const proteinPercent = Math.round(((protein * 4) / totalMacros) * 100);
  const carbsPercent = Math.round(((carbs * 4) / totalMacros) * 100);
  const fatPercent = Math.round(((fat * 9) / totalMacros) * 100);

  // Granular breakdown mock data
  const macroBreakdown = {
    protein: [
      { name: 'Animal Protein', value: `${Math.round(protein * 0.75)}g`, p: 75 },
      { name: 'Plant Protein', value: `${Math.round(protein * 0.25)}g`, p: 25 },
    ],
    carbs: [
      { name: 'Complex Carbs', value: `${Math.round(carbs * 0.73)}g`, p: 73 },
      { name: 'Fiber', value: `${fiber}g`, p: 18 },
      { name: 'Sugars', value: `${sugar}g`, p: 9 },
    ],
    fats: [
      { name: 'Healthy Fats', value: `${Math.round(fat * 0.82)}g`, p: 82 },
      { name: 'Saturated Fats', value: `${Math.round(fat * 0.18)}g`, p: 18 },
    ]
  };

  return (
    <>
      <div className="w-full bg-white rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden flex flex-col relative z-10">
        {/* Top Bento Row: Image & Score */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-0 border-b border-slate-100">
          <div className="md:col-span-3 relative h-40 md:h-auto overflow-hidden">
            <img 
              src={imageUrl} 
              alt={mealName}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-3">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-300 text-[8px] font-bold uppercase tracking-wider mb-2">
                <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                Verified
              </span>
              <h2 className="text-base font-black text-white tracking-tight leading-none uppercase">
                {mealName}
              </h2>
            </div>
          </div>

          <div className={`md:col-span-2 p-4 flex flex-col justify-between bg-gradient-to-br ${scoreData.bg} text-white`}>
            <div className="flex justify-between items-start">
              <div className="p-2 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
                <ScoreIcon size={14} />
              </div>
              <div className="text-right">
                <p className="text-[8px] font-black uppercase tracking-tighter opacity-70">Index</p>
                <p className="text-xs font-bold">{scoreData.label}</p>
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-4xl font-black tracking-tighter">{score}</span>
              <span className="text-base font-bold opacity-40">/10</span>
            </div>

            <div className="mt-2 h-1 w-full bg-black/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all duration-1000"
                style={{ width: `${score * 10}%` }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        {isExpanded && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 group transition-all">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                    <Flame size={14} className="fill-orange-50" />
                  </div>
                  <div>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Energy</p>
                    <p className="text-base font-black text-slate-800">
                      {calories}
                      <span className="text-[10px] ml-1 opacity-40">kcal</span>
                    </p>
                  </div>
                </div>
                <Activity size={14} className="text-slate-200" />
              </div>

              <div className="p-3 rounded-xl border border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Layers size={10} className="text-indigo-500" />
                    Macros
                  </h4>
                </div>

                <div className="space-y-2">
                  {[
                    { label: 'Protein', val: protein, p: proteinPercent, color: 'bg-blue-500' },
                    { label: 'Carbs', val: carbs, p: carbsPercent, color: 'bg-emerald-500' },
                    { label: 'Fats', val: fat, p: fatPercent, color: 'bg-amber-500' },
                  ].map((m, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold uppercase">
                        <span className="text-slate-400">{m.label}</span>
                        <span className="text-slate-600">{m.val}g</span>
                      </div>
                      <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${m.color} transition-all duration-1000`}
                          style={{ width: `${m.p}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 group">
                  <UtensilsCrossed size={12} className="text-emerald-500 mb-1 group-hover:rotate-12 transition-transform" />
                  <p className="text-[8px] font-bold text-emerald-600 uppercase mb-0.5">Fiber</p>
                  <p className="text-base font-black text-emerald-900">{fiber}g</p>
                </div>
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 group">
                  <Flame size={12} className="text-rose-500 mb-1 group-hover:scale-125 transition-transform" />
                  <p className="text-[8px] font-bold text-rose-600 uppercase mb-0.5">Sugar</p>
                  <p className="text-base font-black text-rose-900">{sugar}g</p>
                </div>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl text-white">
                <div className="flex items-center gap-1.5 mb-2">
                  <Zap size={12} className="text-amber-400" />
                  <h4 className="text-[8px] font-black uppercase tracking-widest">Insight</h4>
                </div>
                <p className="text-[10px] font-medium text-slate-300 leading-relaxed mb-2">
                  High bioavailable protein. Optimal fiber for metabolic health.
                </p>
                <button
                  onClick={() => setShowMacroDetails(true)}
                  className="w-full py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 border border-white/10 transition-all"
                >
                  View Breakdown
                  <TrendingUp size={10} className="text-emerald-400" />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-slate-50 p-3 flex justify-center border-t border-slate-100">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
            {isExpanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
          </button>
        </div>
      </div>

      {/* Macro Breakdown Overlay */}
      {showMacroDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setShowMacroDetails(false)}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300"
          />
          
          <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-white/20 animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900">Macro Analysis</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Granular breakdown of your meal
                </p>
              </div>
              <button 
                onClick={() => setShowMacroDetails(false)}
                className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all hover:rotate-90"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Visual Summary */}
              <div className="grid grid-cols-3 gap-2 h-12 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-blue-500 flex items-center justify-center text-[9px] font-black text-white uppercase tracking-tighter">
                  Protein {proteinPercent}%
                </div>
                <div className="bg-emerald-500 flex items-center justify-center text-[9px] font-black text-white uppercase tracking-tighter">
                  Carbs {carbsPercent}%
                </div>
                <div className="bg-amber-500 flex items-center justify-center text-[9px] font-black text-white uppercase tracking-tighter">
                  Fat {fatPercent}%
                </div>
              </div>

              {/* Granular Stats */}
              <div className="space-y-6">
                {/* Protein Breakdown */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Protein Quality
                    </h4>
                  </div>
                  <div className="grid gap-2">
                    {macroBreakdown.protein.map((p, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-xs font-bold text-slate-700">{p.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-black text-slate-900">{p.value}</span>
                          <div className="w-16 h-1 bg-slate-200 rounded-full overflow-hidden">
                            <div style={{ width: `${p.p}%` }} className="h-full bg-blue-500" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Carbs Breakdown */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Carbohydrate Source
                    </h4>
                  </div>
                  <div className="grid gap-2">
                    {macroBreakdown.carbs.map((p, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-xs font-bold text-slate-700">{p.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-black text-slate-900">{p.value}</span>
                          <div className="w-16 h-1 bg-slate-200 rounded-full overflow-hidden">
                            <div style={{ width: `${p.p}%` }} className="h-full bg-emerald-500" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fats Breakdown */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Fatty Acid Profile
                    </h4>
                  </div>
                  <div className="grid gap-2">
                    {macroBreakdown.fats.map((p, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-xs font-bold text-slate-700">{p.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-black text-slate-900">{p.value}</span>
                          <div className="w-16 h-1 bg-slate-200 rounded-full overflow-hidden">
                            <div style={{ width: `${p.p}%` }} className="h-full bg-amber-500" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex gap-3">
                <Info size={20} className="text-blue-500 flex-shrink-0" />
                <p className="text-[10px] font-medium text-blue-700 leading-relaxed">
                  Bioavailability is high. This macro ratio promotes sustained energy levels for 3-5 hours post-consumption.
                </p>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100">
              <button 
                onClick={() => setShowMacroDetails(false)}
                className="w-full py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-200 transition-all hover:bg-slate-800"
              >
                Close Analysis
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MealScoreCard;
