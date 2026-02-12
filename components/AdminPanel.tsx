import React, { useState, useEffect } from 'react';
import { Terminal, Database, Activity, RefreshCw, Trash2, ShieldCheck, ChefHat, Utensils, Clock, AlertTriangle, Flame, Zap } from 'lucide-react';
import { server } from '../server/mockServer';

interface StatusCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  subtext?: string;
  backgroundImage?: string;
}

const StatusCard: React.FC<StatusCardProps> = ({ title, value, icon: Icon, color, subtext, backgroundImage }) => (
  <div className="relative group overflow-hidden bg-white rounded-3xl border border-slate-100 shadow-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
    {/* Background Image Overlay */}
    {backgroundImage && (
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700">
        <img src={backgroundImage} alt="" className="w-full h-full object-cover" />
      </div>
    )}
    
    <div className="relative p-6 z-10">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-2xl bg-slate-50 transition-colors duration-300 group-hover:bg-white">
          <Icon size={24} className={`${color} transition-transform duration-500 group-hover:scale-110`} />
        </div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Live Metric</div>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-slate-900 tracking-tight">{value}</span>
          {subtext && <span className="text-xs font-bold text-slate-400">{subtext}</span>}
        </div>
      </div>
      
      <div className="mt-4 h-1 w-full bg-slate-50 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color.replace('text', 'bg')} transition-all duration-1000 ease-out`} 
          style={{ width: '65%' }}
        />
      </div>
    </div>
  </div>
);

const AdminPanel: React.FC = () => {
  const [state, setState] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isNuking, setIsNuking] = useState(false);

  const fetchStatus = async () => {
    const status = await server.getStatus();
    setState(status);
    setLoading(false);
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleNuke = () => {
    setIsNuking(true);
    server.resetDatabase();
    setTimeout(() => setIsNuking(false), 2000);
  };

  if (loading || !state) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-bold animate-pulse">BOOTING KITCHEN OS...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-2 rounded-xl shadow-lg shadow-emerald-200">
              <ShieldCheck className="text-white" size={28} />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Backend <span className="text-emerald-500">Console</span>
            </h1>
          </div>
          <p className="text-slate-500 font-medium flex items-center gap-2">
            <Activity size={14} className="text-emerald-500" />
            Monitoring <span className="font-bold text-slate-700">NutriVision</span> infrastructure in real-time.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Nodes</span>
            <span className="text-sm font-bold text-slate-700">Cluster: NYC-E-04</span>
          </div>
          <div className="flex items-center gap-3 px-5 py-2.5 bg-white shadow-sm border border-emerald-100 text-emerald-600 rounded-2xl text-sm font-bold hover:bg-emerald-50 transition-colors cursor-default">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            System Operational
          </div>
        </div>
      </header>

      {/* Top Grid: Stats & Visuals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatusCard 
          title="System Uptime" 
          value={`${state.uptime}s`} 
          icon={Clock} 
          color="text-blue-500"
          subtext="99.9% Efficiency"
          backgroundImage="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=400"
        />
        
        <StatusCard 
          title="Total Requests" 
          value={state.totalRequests.toLocaleString()} 
          icon={Zap} 
          color="text-emerald-500"
          subtext="L7 Load Balanced"
          backgroundImage="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=400"
        />
        
        <StatusCard 
          title="Storage Load" 
          value={`${(state.dbSize / 1024).toFixed(1)}`} 
          icon={Database} 
          color="text-amber-500"
          subtext="KB Synchronized"
          backgroundImage="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=400"
        />
        
        {/* Danger Zone Card */}
        <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden group">
          {/* Animated Flame background */}
          <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Flame size={120} className="text-rose-500 rotate-12" />
          </div>
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <h4 className="font-bold mb-1 flex items-center gap-2 text-rose-400">
                <AlertTriangle size={18} />
                System Reset
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Permanently purge user sessions, order history, and cache buffers.
              </p>
            </div>
            
            <button 
              onClick={handleNuke}
              disabled={isNuking}
              className={`mt-4 w-full py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
                isNuking 
                  ? 'bg-rose-600 text-white cursor-wait' 
                  : 'bg-white/5 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/30 hover:border-rose-500'
              }`}
            >
              {isNuking ? (
                <> <RefreshCw size={14} className="animate-spin" /> Purging... </>
              ) : (
                <> <Trash2 size={14} /> Wipe Environment </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Live Terminal & Visual Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Terminal Logs */}
        <div className="lg:col-span-2 bg-slate-950 rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-800 flex flex-col group">
          <div className="p-5 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
              </div>
              <div className="h-4 w-[1px] bg-slate-700 mx-2"></div>
              <div className="flex items-center gap-2">
                <Terminal size={16} className="text-emerald-400" />
                <span className="text-xs font-mono font-bold text-slate-400 tracking-tight">
                  service_monitor <span className="text-emerald-500/50">--stream</span>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-slate-500">
              <span className="text-[10px] font-mono">UTF-8</span>
              <RefreshCw size={14} className="animate-spin-slow cursor-pointer hover:text-emerald-400 transition-colors" />
            </div>
          </div>
          
          <div className="p-6 font-mono text-[11px] h-[450px] overflow-y-auto space-y-3 custom-scrollbar">
            {state.logs.map((log: any, idx: number) => (
              <div 
                key={log.id} 
                className="flex flex-col md:flex-row gap-2 md:gap-4 group/line animate-slide-up" 
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <span className="text-slate-600 shrink-0 select-none">
                  [{new Date(log.timestamp).toLocaleTimeString()}]
                </span>
                <div className="flex items-center gap-3">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-black shrink-0 w-14 text-center ${
                    log.method === 'GET' ? 'bg-blue-500/10 text-blue-400' : 
                    log.method === 'POST' ? 'bg-emerald-500/10 text-emerald-400' : 
                    'bg-rose-500/10 text-rose-400'
                  }`}>
                    {log.method}
                  </span>
                  <span className="text-slate-200 shrink-0 font-bold">{log.endpoint}</span>
                  <span className={`shrink-0 font-bold ${log.status >= 400 ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {log.status}
                  </span>
                </div>
                <span className="text-slate-500 truncate group-hover/line:text-slate-300 transition-colors">
                  — {log.message}
                </span>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <span className="w-2 h-4 bg-emerald-500 animate-pulse"></span>
              <span className="text-emerald-500/50 italic">Listening for requests...</span>
            </div>
          </div>
        </div>

        {/* Side Panel: System Context */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <ChefHat className="text-emerald-500" size={20} />
              Kitchen Load
            </h3>
            
            <div className="space-y-4">
              {[
                { 
                  label: 'Active Orders', 
                  val: 14, 
                  max: 20, 
                  icon: Utensils, 
                  img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=200' 
                },
                { 
                  label: 'Staff Online', 
                  val: 8, 
                  max: 12, 
                  icon: Activity, 
                  img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=200' 
                }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border-2 border-transparent group-hover:border-emerald-500 transition-all">
                    <img 
                      src={item.img} 
                      alt="" 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-500">{item.label}</span>
                      <span className="text-slate-900">{item.val}/{item.max}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 transition-all duration-1000" 
                        style={{ width: `${(item.val / item.max) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-emerald-600 p-6 rounded-[2rem] text-white shadow-xl shadow-emerald-200/50 relative overflow-hidden group">
            <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-4 translate-y-4 group-hover:scale-110 transition-transform duration-700">
              <Zap size={140} />
            </div>
            <div className="relative z-10">
              <h4 className="font-black text-xl mb-2">Pro Performance</h4>
              <p className="text-emerald-100 text-xs leading-relaxed mb-4">
                Your current API response time is <b>24ms</b>. This is 15% faster than the regional average.
              </p>
              <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-wider">
                Tier 1 Optimized
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="pt-8 border-t border-slate-200 flex justify-between items-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
        <div>© 2026 NutriVision Cloud Services</div>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-emerald-500 transition-colors">Documentation</a>
          <a href="#" className="hover:text-emerald-500 transition-colors">Security Audit</a>
          <a href="#" className="hover:text-emerald-500 transition-colors">API Keys</a>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.3);
        }
      `}} />
    </div>
  );
};

export default AdminPanel;
