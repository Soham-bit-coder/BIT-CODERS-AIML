
import React, { useState, useEffect } from 'react';
import { LayoutGrid, Camera, History, User, HeartPulse, Settings, ChefHat, TrendingUp, Scan, LogOut, UserCircle } from 'lucide-react';
import { authService } from '../services/authService';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const [userName, setUserName] = useState('User');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('user');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setUserName(user.name || 'User');
        setUserEmail(user.email || '');
        setUserRole(user.role || 'user');
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'scan', label: 'Scan Food', icon: Camera },
    { id: 'barcode', label: 'Barcode', icon: Scan },
    { id: 'history', label: 'Logs', icon: History },
    { id: 'fitness', label: 'Fitness', icon: HeartPulse },
    { id: 'meals', label: 'Meal Plan', icon: ChefHat },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'admin', label: 'Admin', icon: Settings },
  ];

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pl-64 flex flex-col animate-fade-in">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 flex-col p-6 animate-slide-right z-40">
        <div className="flex items-center gap-2 mb-8 animate-slide-down">
          <div className="bg-emerald-500 p-2 rounded-lg text-white animate-float">
            <HeartPulse size={24} />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">NutriVision AI</h1>
        </div>
        
        <nav className="space-y-2 flex-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover-lift ${
                  activeTab === tab.id 
                    ? 'bg-emerald-50 text-emerald-600 font-semibold shine' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100 relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold shadow-lg">
              {getInitials(userName)}
            </div>
            <div className="flex-1 overflow-hidden text-left">
              <p className="text-sm font-semibold text-slate-900 truncate">{userName}</p>
              <p className="text-xs text-slate-500 truncate capitalize">{userRole === 'trainer' ? 'Trainer' : 'Athlete'}</p>
            </div>
          </button>

          {/* Profile Menu Dropdown */}
          {showProfileMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-in">
              <div className="p-4 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900 truncate">{userName}</p>
                <p className="text-xs text-slate-500 truncate">{userEmail}</p>
              </div>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  setActiveTab('profile');
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <UserCircle size={18} />
                <span className="text-sm font-medium">Profile Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={18} />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full">
        {children}
      </main>

      {/* Bottom Nav - Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 safe-area-bottom z-50 shadow-lg overflow-x-auto">
        <div className="flex justify-start items-center px-2 py-2 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 transition-all px-3 py-1.5 rounded-xl flex-shrink-0 ${
                  isActive ? 'text-emerald-500 bg-emerald-50' : 'text-slate-400'
                }`}
              >
                <Icon size={20} />
                <span className="text-[8px] font-bold uppercase tracking-wide whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
