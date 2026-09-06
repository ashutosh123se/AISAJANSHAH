import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Trophy, Flame, Target, Activity, TrendingUp } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Progress = () => {
  const { userProfile } = useAuth();

  const daysOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const activityData = daysOrder.map(day => ({
    day,
    minutes: userProfile?.dailyActivity?.[day] || 0
  }));

  const goalData = userProfile?.goalTrajectory || [
    { week: 'W1', completion: 15 }, { week: 'W2', completion: 35 }, { week: 'W3', completion: 55 },
    { week: 'W4', completion: 75 }, { week: 'W5', completion: 90 }
  ];

  const stats = [
    { label: 'Current Streak', value: `${userProfile?.streakCount || 1} Days`, icon: Flame, color: '#f26522', bg: 'bg-orange-50' },
    { label: 'Total XP', value: `${userProfile?.xp || 120}`, icon: Trophy, color: '#F5A623', bg: 'bg-amber-50' },
    { label: 'Goals Met', value: '2', icon: Target, color: '#10B981', bg: 'bg-emerald-50' },
    { label: 'Active Days', value: '5', icon: Activity, color: '#3B82F6', bg: 'bg-blue-50' },
  ];

  return (
    <div className="max-w-[1000px] mx-auto w-full px-4 lg:px-6 py-6 lg:py-10">
      <div className="mb-10">
        <h2 className="text-4xl font-serif font-bold text-[var(--color-primary)] tracking-tight mb-2 flex items-center gap-3">
          <div className="w-12 h-12 border border-[var(--color-border)] flex items-center justify-center bg-[var(--color-bg)]">
            <TrendingUp className="w-6 h-6 text-[var(--color-primary)]" />
          </div>
          Performance Telemetry
        </h2>
        <p className="text-[15px] font-sans mt-3 text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
          Track your cognitive transformation journey and analytics across all active vectors.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mb-10">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white border border-[var(--color-border)] p-6 flex flex-col items-center text-center hover:border-[var(--color-primary)] transition-all">
            <div className={`w-12 h-12 rounded-full ${stat.bg} flex items-center justify-center mb-4 border border-[var(--color-border)]`}>
              <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
            </div>
            <p className="text-[24px] font-serif font-bold text-[var(--color-primary)]">
              {stat.value}
            </p>
            <p className="text-[12px] font-sans font-bold mt-1 uppercase tracking-wider text-[var(--color-text-secondary)]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Activity Chart */}
        <div className="bg-white border border-[var(--color-border)] p-6 lg:p-8">
          <h3 className="text-[18px] font-serif font-bold text-[var(--color-primary)] mb-6">
            Platform Activity (Minutes)
          </h3>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAE6DF" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <Tooltip 
                  cursor={{ fill: '#F9F8F6' }}
                  contentStyle={{ background: '#FFFFFF', border: '1px solid #EAE6DF', borderRadius: '4px', color: '#111827' }}
                  itemStyle={{ color: '#E55A28' }}
                />
                <Bar dataKey="minutes" fill="#E55A28" radius={[2, 2, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Goal Progress Chart */}
        <div className="bg-white border border-[var(--color-border)] p-6 lg:p-8">
          <h3 className="text-[18px] font-serif font-bold text-[var(--color-primary)] mb-6">
            90-Day Goal Trajectory (% Progress)
          </h3>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={goalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAE6DF" />
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <Tooltip 
                  contentStyle={{ background: '#FFFFFF', border: '1px solid #EAE6DF', borderRadius: '4px', color: '#111827' }}
                  itemStyle={{ color: '#10B981' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="completion" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#FFFFFF' }}
                  activeDot={{ r: 6, fill: '#10B981', strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
