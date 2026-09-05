import React, { useState, useEffect } from 'react';
import { Users, Activity, Mail, UserPlus, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../utils/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    activeThisWeek: 0,
    emailsSent: 0,
    newThisMonth: 0,
  });

  const [timeStr, setTimeStr] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await apiFetch('/api/admin/stats');
        
        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        }
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const stats = [
    { label: 'TOTAL STUDENTS', value: dashboardData.totalStudents, icon: Users, bg: 'bg-[var(--color-bg)]', color: 'text-[var(--color-primary)]', trend: 'Live Data', up: true },
    { label: 'ACTIVE THIS WEEK', value: dashboardData.activeThisWeek, icon: Activity, bg: 'bg-emerald-50', color: 'text-emerald-600', trend: 'Live Data', up: true },
    { label: 'EMAILS SENT', value: dashboardData.emailsSent, icon: Mail, bg: 'bg-orange-50', color: 'text-orange-600', trend: 'Live Data', up: true },
    { label: 'NEW THIS MONTH', value: dashboardData.newThisMonth, icon: UserPlus, bg: 'bg-blue-50', color: 'text-blue-600', trend: 'Live Data', up: true },
  ];

  const activityData = [
    { day: '01', users: 2400 },
    { day: '05', users: 1398 },
    { day: '10', users: 4800 },
    { day: '15', users: 3908 },
    { day: '20', users: 4800 },
    { day: '25', users: 3800 },
    { day: '30', users: 4300 },
  ];

  const workshopData = [
    { name: 'Memory Workshop', value: 400 },
    { name: 'Goal Setting Mastery', value: 300 },
    { name: 'Public Speaking', value: 300 },
    { name: 'Student Excellence', value: 200 },
  ];
  const COLORS = ['#1A1A1A', '#49B6A1', '#FF8A65', '#E5E2DC'];

  const recentStudents = [
    { id: 1, name: 'Aarav Patel', email: 'aarav@example.com', workshop: 'Memory Workshop', dateAdded: 'Oct 12, 2023', lastLogin: 'Today, 10:30 AM', status: 'Active' },
  ];

  if (loading) {
    return <div className="p-12 max-w-7xl mx-auto w-full flex justify-center items-center h-[50vh]"><p className="text-[var(--color-text-secondary)] font-sans">Loading Real-Time Stats...</p></div>;
  }

  return (
    <div className="w-full h-full">
      <div className="mb-10">
        <h2 className="text-4xl lg:text-5xl font-serif font-bold text-[var(--color-primary)] tracking-tight">
          Good {timeStr}, Sajan Shah.
        </h2>
        <p className="text-[16px] font-sans text-[var(--color-text-secondary)] mt-2">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white border border-[var(--color-border)] rounded-2xl p-8 hover:border-[var(--color-primary)] transition-all duration-300 shadow-sm flex flex-col group">
            <div className="flex justify-between items-start mb-6">
              <span className="text-xs font-sans font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">
                {stat.label}
              </span>
              <div className={`w-12 h-12 rounded-full ${stat.bg} flex items-center justify-center border border-[var(--color-border)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors`}>
                <stat.icon className={`w-5 h-5 ${stat.color} group-hover:text-white`} />
              </div>
            </div>
            <div className="text-4xl font-serif font-bold text-[var(--color-primary)] mb-2 mt-auto">
              {stat.value.toLocaleString()}
            </div>
            <div className={`flex items-center gap-1 text-[13px] font-sans font-semibold ${stat.up ? 'text-emerald-600' : 'text-orange-600'}`}>
              <TrendingUp className="w-4 h-4" />
              {stat.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white border border-[var(--color-border)] rounded-2xl p-8 shadow-sm">
          <h3 className="text-xl font-serif font-bold text-[var(--color-primary)] mb-8">Student Activity — Last 30 Days</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E2DC" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#5C5C5C', fontFamily: 'Inter' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#5C5C5C', fontFamily: 'Inter' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #1A1A1A', background: '#FFFFFF', color: '#1A1A1A', boxShadow: '4px 4px 0px #1A1A1A', fontFamily: 'Inter' }} itemStyle={{ fontWeight: 'bold', color: '#1A1A1A' }} />
                <Line type="monotone" dataKey="users" stroke="#1A1A1A" strokeWidth={3} dot={{ r: 4, fill: '#FFFFFF', strokeWidth: 2, stroke: '#1A1A1A' }} activeDot={{ r: 6, fill: '#1A1A1A', strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-[var(--color-border)] rounded-2xl p-8 shadow-sm flex flex-col">
          <h3 className="text-xl font-serif font-bold text-[var(--color-primary)] mb-8">Workshop Distribution</h3>
          <div className="flex-1 flex flex-row items-center justify-center">
            <div className="h-[250px] w-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={workshopData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {workshopData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #1A1A1A', background: '#FFFFFF', color: '#1A1A1A', boxShadow: '4px 4px 0px #1A1A1A', fontFamily: 'Inter' }} itemStyle={{ fontWeight: 'bold' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="ml-8 flex flex-col gap-4">
              {workshopData.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border border-[var(--color-border)]" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-[14px] font-sans font-medium text-[var(--color-text-secondary)]">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Students Table */}
      <div className="bg-white border border-[var(--color-border)] rounded-2xl shadow-sm mt-8 overflow-hidden">
        <div className="p-8 border-b border-[var(--color-border)] flex justify-between items-center bg-[var(--color-bg)]">
          <h3 className="text-xl font-serif font-bold text-[var(--color-primary)]">Recently Added Students</h3>
          <button onClick={() => navigate('/admin/students')} className="text-[14px] font-sans font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors flex items-center gap-2">
            View All Students <TrendingUp className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-white">
                <th className="px-8 py-5 text-[11px] font-sans font-bold text-[var(--color-text-hint)] uppercase tracking-widest">Name</th>
                <th className="px-8 py-5 text-[11px] font-sans font-bold text-[var(--color-text-hint)] uppercase tracking-widest">Email</th>
                <th className="px-8 py-5 text-[11px] font-sans font-bold text-[var(--color-text-hint)] uppercase tracking-widest">Workshop</th>
                <th className="px-8 py-5 text-[11px] font-sans font-bold text-[var(--color-text-hint)] uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentStudents.map((student) => (
                <tr key={student.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg)] transition-colors">
                  <td className="px-8 py-6 text-[15px] font-sans font-bold text-[var(--color-primary)] whitespace-nowrap">{student.name}</td>
                  <td className="px-8 py-6 text-[14px] font-sans text-[var(--color-text-secondary)]">{student.email}</td>
                  <td className="px-8 py-6 text-[14px] font-sans text-[var(--color-text-secondary)]">{student.workshop}</td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-sans font-bold tracking-wide uppercase bg-emerald-50 text-emerald-600 border border-emerald-100`}>
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
