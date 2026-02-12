import React from 'react';
import { LucideIcon } from 'lucide-react';

interface NutrientCardProps {
  label: string;
  value: string | number;
  unit: string;
  color: string;
  percentage?: number;
  icon?: LucideIcon;
  delay?: number;
}

const NutrientCard: React.FC<NutrientCardProps> = ({ 
  label, 
  value, 
  unit, 
  color, 
  percentage, 
  icon: Icon,
  delay = 0 
}) => {
  return (
    <div 
      className="group relative bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:border-slate-200 overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>

      <div className={`absolute -right-4 -top-4 w-20 md:w-24 h-20 md:h-24 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-2xl ${color}`} />
      
      <div className="flex justify-between items-start mb-3 md:mb-4 relative z-10">
        {Icon && (
          <div className={`p-1.5 md:p-2 rounded-lg md:rounded-xl bg-slate-50 group-hover:scale-110 transition-transform duration-500`}>
            <Icon className={`w-4 h-4 md:w-5 md:h-5 ${color.replace('bg-', 'text-')}`} />
          </div>
        )}
        {percentage !== undefined && (
          <span className={`text-[10px] md:text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded-lg ${color.replace('bg-', 'text-')} bg-opacity-10 ring-1 ring-inset ${color.replace('bg-', 'ring-')}/20`}>
            {percentage}%
          </span>
        )}
      </div>

      <div className="relative z-10">
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight transition-all duration-300">
            {value}
          </span>
          <span className="text-xs md:text-sm text-slate-500 font-medium">{unit}</span>
        </div>
        <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      </div>

      {percentage !== undefined && (
        <div className="mt-3 md:mt-5 w-full bg-slate-100 h-1.5 md:h-2 rounded-full overflow-hidden relative">
          <div 
            className={`h-full ${color} transition-all duration-1000 ease-out relative`} 
            style={{ width: `${Math.min(percentage, 100)}%` }}
          >
            <div className="absolute inset-0 bg-white/30 animate-shimmer" style={{ width: '50%' }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default NutrientCard;
