import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Save, Edit2, Check, X } from 'lucide-react';

const ProfileSettings: React.FC = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: 'user',
    uid: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setUserData({
          name: user.name || 'User',
          email: user.email || '',
          role: user.role || 'user',
          uid: user.uid || ''
        });
        setEditedName(user.name || 'User');
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      // Update localStorage
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        user.name = editedName;
        localStorage.setItem('user', JSON.stringify(user));
        setUserData({ ...userData, name: editedName });
      }

      setMessage('Profile updated successfully!');
      setIsEditing(false);
      
      // Reload page to reflect changes
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      setMessage('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedName(userData.name);
    setIsEditing(false);
    setMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-xl border border-emerald-200/50 text-emerald-700 px-6 py-3 rounded-full text-[10px] font-black tracking-[0.4em] uppercase shadow-sm">
          <User size={14} /> Profile Settings
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
          Your Account
        </h1>
        <p className="text-slate-600 font-medium">
          Manage your personal information and preferences
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white p-8 md:p-12 space-y-8">
        {/* Avatar Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl">
            {userData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-black text-slate-900">{userData.name}</h2>
            <p className="text-sm text-slate-500 capitalize">{userData.role === 'trainer' ? 'Trainer Account' : 'Athlete Account'}</p>
          </div>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`p-4 rounded-2xl text-center font-bold ${
            message.includes('success') 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        {/* Profile Information */}
        <div className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <User size={14} /> Full Name
            </label>
            {isEditing ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="flex-1 px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                  placeholder="Enter your name"
                />
                <button
                  onClick={handleSave}
                  disabled={saving || !editedName.trim()}
                  className="px-6 py-4 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Check size={18} />
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-6 py-4 bg-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-300 transition-all flex items-center gap-2"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <span className="font-medium text-slate-900">{userData.name}</span>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-emerald-600 hover:text-emerald-700 font-bold text-sm flex items-center gap-2"
                >
                  <Edit2 size={16} /> Edit
                </button>
              </div>
            )}
          </div>

          {/* Email Field (Read-only) */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Mail size={14} /> Email Address
            </label>
            <div className="px-4 py-4 bg-slate-100 border border-slate-200 rounded-2xl">
              <span className="font-medium text-slate-600">{userData.email}</span>
            </div>
            <p className="text-xs text-slate-500 italic">Email cannot be changed</p>
          </div>

          {/* Role Field (Read-only) */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Shield size={14} /> Account Type
            </label>
            <div className="px-4 py-4 bg-slate-100 border border-slate-200 rounded-2xl">
              <span className="font-medium text-slate-600 capitalize">
                {userData.role === 'trainer' ? 'Trainer' : 'Athlete'}
              </span>
            </div>
          </div>

          {/* User ID (for reference) */}
          {userData.uid && (
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">
                User ID
              </label>
              <div className="px-4 py-4 bg-slate-100 border border-slate-200 rounded-2xl">
                <span className="font-mono text-xs text-slate-600 break-all">{userData.uid}</span>
              </div>
            </div>
          )}
        </div>

        {/* Account Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-200">
          <div className="text-center p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
            <p className="text-2xl font-black text-emerald-600">Active</p>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mt-1">Account Status</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <p className="text-2xl font-black text-blue-600">Firebase</p>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mt-1">Auth Provider</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-2xl border border-purple-100">
            <p className="text-2xl font-black text-purple-600">Verified</p>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mt-1">Security Status</p>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
        <h3 className="text-sm font-black text-slate-900 mb-3">Account Information</h3>
        <ul className="space-y-2 text-sm text-slate-600">
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-0.5">•</span>
            <span>Your data is securely stored in Firebase Firestore</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-0.5">•</span>
            <span>All meal logs and fitness data are private to your account</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-0.5">•</span>
            <span>You can export your data at any time from the Admin panel</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileSettings;
