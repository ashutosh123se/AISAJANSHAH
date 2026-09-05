import React, { useState } from 'react';
import { User, Bell, Shield, Globe, Save, Trophy, Flame, Target, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import { ToastContainer } from '../../components/ui/Toast';

const Profile = () => {
  const { userProfile, setUserProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    name: userProfile?.name || '',
    email: userProfile?.email || '',
    phone: userProfile?.phone || '',
    language: userProfile?.onboardingData?.language || 'hinglish',
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedProfile = {
        ...userProfile,
        name: formData.name,
        phone: formData.phone,
        onboardingData: {
          ...(userProfile?.onboardingData || {}),
          language: formData.language,
        },
      };

      setUserProfile(updatedProfile);

      const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
      await fetch(`${API_BASE}/api/student/onboarding`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          onboardingData: updatedProfile.onboardingData,
        }),
      }).catch(() => {});

      addToast('Profile updated successfully!');
    } catch {
      addToast('Failed to update profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'SS';
    const parts = name.split(' ');
    return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();
  };

  // --- Progress Data ---
  const daysOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const activityData = daysOrder.map(day => ({
    day,
    minutes: userProfile?.dailyActivity?.[day] || 0
  }));

  const goalData = userProfile?.goalTrajectory || [
    { week: 'W1', completion: 0 }, { week: 'W2', completion: 0 }, { week: 'W3', completion: 0 },
    { week: 'W4', completion: 0 }, { week: 'W5', completion: 0 }
  ];

  const stats = [
    { label: 'Current Streak', value: `${userProfile?.streakCount || 0} Days`, icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Total XP', value: `${userProfile?.xp || 0}`, icon: Trophy, color: 'text-[var(--color-primary)]', bg: 'bg-[var(--color-bg)]' },
    { label: 'Goals Met', value: '0', icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Active Days', value: '0', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  return (
    <div className="max-w-[1000px] mx-auto w-full px-4 lg:px-6 py-6 lg:py-10">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div className="mb-12">
        <h2 className="text-4xl lg:text-5xl font-serif font-bold text-[var(--color-primary)] tracking-tight mb-4">
          My Profile & Progress.
        </h2>
        <p className="text-[16px] font-sans text-[var(--color-text-secondary)] max-w-2xl">
          Manage your personal information and monitor your continuous optimization.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mb-16">
        {/* Left Col */}
        <div className="w-full md:w-[320px] shrink-0 flex flex-col gap-6">
          <div className="rounded-2xl p-10 flex flex-col items-center text-center bg-white border border-[var(--color-border)] shadow-sm relative overflow-hidden group">
            <div className="w-32 h-32 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center mb-6 relative cursor-pointer hover:border-[var(--color-primary)] transition-colors">
              <span className="text-[var(--color-primary)] font-serif font-bold text-5xl">
                {getInitials(formData.name)}
              </span>
              <div className="absolute inset-0 bg-white/90 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <span className="text-[var(--color-primary)] text-sm font-semibold font-sans">Change Photo</span>
              </div>
            </div>
            <h3 className="text-2xl font-serif font-bold text-[var(--color-primary)] relative z-10">
              {formData.name || 'Student'}
            </h3>
            <p className="text-sm font-sans mt-2 text-[var(--color-text-secondary)] relative z-10">
              {formData.email}
            </p>
            <div className="mt-8 inline-block px-5 py-2 rounded-full text-xs font-sans font-bold tracking-widest uppercase text-white bg-[var(--color-primary)] relative z-10">
              Active Member
            </div>
          </div>
        </div>

        {/* Right Col */}
        <div className="flex-1 flex flex-col gap-8">
          <div className="rounded-2xl p-10 bg-white border border-[var(--color-border)] shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3 mb-8 relative z-10">
              <div className="w-10 h-10 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center">
                <User className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[var(--color-primary)]">
                Personal Information
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              <div>
                <label className="block text-sm font-semibold text-[var(--color-primary)] mb-2">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full h-12 px-4 rounded-lg border border-[var(--color-border)] bg-transparent focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all outline-none font-sans text-sm text-[var(--color-primary)]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--color-primary)] mb-2">Email Address</label>
                <input type="email" name="email" value={formData.email} disabled className="w-full h-12 px-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-hint)] cursor-not-allowed font-sans text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--color-primary)] mb-2">Phone Number</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full h-12 px-4 rounded-lg border border-[var(--color-border)] bg-transparent focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all outline-none font-sans text-sm text-[var(--color-primary)]" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-10 bg-white border border-[var(--color-border)] shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3 mb-8 relative z-10">
              <div className="w-10 h-10 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center">
                <Globe className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[var(--color-primary)]">
                AI Preferences
              </h3>
            </div>
            
            <div className="grid grid-cols-1 gap-6 relative z-10">
              <div>
                <label className="block text-sm font-semibold mb-2 text-[var(--color-primary)]">
                  AI Communication Language
                </label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full bg-transparent border border-[var(--color-border)] rounded-lg py-3.5 px-4 text-[15px] text-[var(--color-primary)] transition-all duration-300 outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] appearance-none"
                  style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%231A1A1A\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
                >
                  <option value="hinglish">Hinglish (Hindi + English)</option>
                  <option value="english">English Only</option>
                  <option value="hindi">Hindi Only</option>
                  <option value="gujarati">Gujarati</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button 
              onClick={handleSave} 
              disabled={isSaving}
              className="btn-elegant"
            >
              {!isSaving && <Save className="w-4 h-4" />}
              {isSaving ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </div>
      </div>

      {/* --- Progress Section --- */}
      <div className="mt-12 border-t border-[var(--color-border)] pt-16">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center">
            <Activity className="w-6 h-6 text-[var(--color-primary)]" />
          </div>
          <h2 className="text-4xl font-serif font-bold text-[var(--color-primary)] tracking-tight">
            Performance Telemetry.
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <div key={idx} className={`rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-300 bg-white border border-[var(--color-border)] hover:border-[var(--color-primary)] relative overflow-hidden shadow-sm`}>
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 border border-[var(--color-border)] ${stat.bg} relative z-10`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <p className="text-3xl font-serif font-bold text-[var(--color-primary)] relative z-10">
                {stat.value}
              </p>
              <p className="text-xs font-sans font-bold mt-2 uppercase tracking-widest text-[var(--color-text-secondary)] relative z-10">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Activity Chart */}
          <div className="rounded-2xl p-8 lg:p-10 bg-white border border-[var(--color-border)] shadow-sm relative overflow-hidden group">
            <h3 className="text-xl font-serif font-bold text-[var(--color-primary)] mb-10 flex items-center gap-3">
              <Activity className="w-5 h-5 text-[var(--color-accent)]" /> Platform Engagement
            </h3>
            <div className="h-[300px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E2DC" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#5C5C5C', fontFamily: 'Inter' }} dy={15} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#5C5C5C', fontFamily: 'Inter' }} />
                  <Tooltip 
                    cursor={{ fill: '#F9F8F6' }}
                    contentStyle={{ background: '#FFFFFF', border: '1px solid #1A1A1A', borderRadius: '8px', color: '#1A1A1A', boxShadow: '4px 4px 0px #1A1A1A', fontFamily: 'Inter' }}
                    itemStyle={{ color: '#1A1A1A', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="minutes" fill="#1A1A1A" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Goal Progress Chart */}
          <div className="rounded-2xl p-8 lg:p-10 bg-white border border-[var(--color-border)] shadow-sm relative overflow-hidden group">
            <h3 className="text-xl font-serif font-bold text-[var(--color-primary)] mb-10 flex items-center gap-3">
              <Target className="w-5 h-5 text-[var(--color-accent)]" /> 90-Day Trajectory
            </h3>
            <div className="h-[300px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={goalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E2DC" />
                  <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#5C5C5C', fontFamily: 'Inter' }} dy={15} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#5C5C5C', fontFamily: 'Inter' }} />
                  <Tooltip 
                    contentStyle={{ background: '#FFFFFF', border: '1px solid #1A1A1A', borderRadius: '8px', color: '#1A1A1A', boxShadow: '4px 4px 0px #1A1A1A', fontFamily: 'Inter' }}
                    itemStyle={{ color: '#49B6A1', fontWeight: 'bold' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="completion" 
                    stroke="#49B6A1" 
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#FFFFFF', strokeWidth: 2, stroke: '#1A1A1A' }}
                    activeDot={{ r: 8, fill: '#49B6A1', strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Profile;
