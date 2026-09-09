import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { MessageSquareText, Target, Brain, TrendingUp, ArrowRight, Sparkles, KeyRound, Lock, UserCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import ChangePasswordModal from '../../components/auth/ChangePasswordModal';
import Toast, { ToastContainer } from '../../components/ui/Toast';

const Dashboard = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const firstName = userProfile?.name ? userProfile.name.split(' ')[0] : 'Student';

  return (
    <div className="flex flex-col gap-8 pb-10">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <ChangePasswordModal 
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={() => addToast('Password successfully updated!', 'success')}
      />

      {/* Welcome Banner */}
      <div className="relative overflow-hidden card p-5 sm:p-8 lg:p-12">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 mb-4 sm:mb-6">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-[11px] sm:text-xs font-semibold text-[var(--color-text-secondary)] tracking-widest uppercase">AI Mentor Online</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl lg:text-5xl font-serif font-bold tracking-tight mb-3 sm:mb-4 text-[var(--color-primary)]">
            Welcome back, {firstName}.
          </h1>
          <p className="text-[var(--color-text-secondary)] text-sm sm:text-base lg:text-xl font-sans leading-relaxed mb-6 sm:mb-8 max-w-2xl">
            Your personal intelligence matrix is ready. Let's continue accelerating your 90-day goals and cognitive expansion.
          </p>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <button 
              className="btn-elegant w-full sm:w-auto justify-center"
              onClick={() => navigate('/student/chat')}
            >
              <MessageSquareText className="w-4 h-4 sm:w-5 sm:h-5 mr-2 shrink-0" />
              <span>Resume AI Session</span>
            </button>
            <button 
              className="px-5 h-[42px] sm:h-[46px] rounded-full border border-[var(--color-border)] text-[var(--color-primary)] font-semibold text-sm sm:text-[15px] font-sans hover:border-[var(--color-primary)] transition-all flex items-center justify-center bg-white w-full sm:w-auto"
              onClick={() => navigate('/student/goals')}
            >
              <Target className="w-4 h-4 sm:w-5 sm:h-5 mr-2 shrink-0" />
              <span>View Objectives</span>
            </button>
            <button 
              className="px-5 h-[42px] sm:h-[46px] rounded-full border border-orange-200 bg-orange-50 text-[var(--color-accent)] font-semibold text-sm sm:text-[15px] font-sans hover:bg-orange-100 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
              onClick={() => setIsPasswordModalOpen(true)}
            >
              <KeyRound className="w-4 h-4 shrink-0" />
              <span>Change Password</span>
            </button>
          </div>
        </div>
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Widget 1 */}
        <div className="card p-5 sm:p-6 lg:p-8 flex flex-col">
          <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mb-4 sm:mb-6">
            <Target className="w-6 h-6 text-[var(--color-primary)]" />
          </div>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-serif font-bold text-[var(--color-primary)] mb-2 sm:mb-3">Active Targets</h3>
          <p className="text-[var(--color-text-secondary)] font-sans text-xs sm:text-sm mb-6 sm:mb-8 leading-relaxed flex-1">90-day optimization goals currently in progress.</p>
          
          <button 
            onClick={() => navigate('/student/goals')}
            className="w-full py-2.5 sm:py-3 border border-[var(--color-border)] text-[var(--color-primary)] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-[var(--color-bg)] transition-colors rounded-lg"
          >
            Manage Timeline <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Widget 2 */}
        <div className="card p-5 sm:p-6 lg:p-8 flex flex-col">
          <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mb-4 sm:mb-6">
            <Brain className="w-6 h-6 text-[var(--color-primary)]" />
          </div>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-serif font-bold text-[var(--color-primary)] mb-2 sm:mb-3">Neural Training</h3>
          <p className="text-[var(--color-text-secondary)] font-sans text-xs sm:text-sm mb-6 sm:mb-8 leading-relaxed flex-1">Daily cognitive enhancement exercises formulated by AI.</p>
          
          <button 
            onClick={() => navigate('/student/neuroscience')}
            className="w-full py-2.5 sm:py-3 border border-[var(--color-border)] text-[var(--color-primary)] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-[var(--color-bg)] transition-colors rounded-lg"
          >
            Initiate Sequence <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Widget 3 */}
        <div className="card p-5 sm:p-6 lg:p-8 flex flex-col">
          <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mb-4 sm:mb-6">
            <TrendingUp className="w-6 h-6 text-[var(--color-primary)]" />
          </div>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-serif font-bold text-[var(--color-primary)] mb-2 sm:mb-3">Analytics</h3>
          <p className="text-[var(--color-text-secondary)] font-sans text-xs sm:text-sm mb-6 sm:mb-8 leading-relaxed flex-1">Performance telemetry and progression metrics.</p>
          
          <button 
            onClick={() => navigate('/student/progress')}
            className="w-full py-2.5 sm:py-3 border border-[var(--color-border)] text-[var(--color-primary)] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-[var(--color-bg)] transition-colors rounded-lg"
          >
            Access Telemetry <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Widget 4 - Password & Security */}
        <div className="card p-5 sm:p-6 lg:p-8 flex flex-col border border-orange-200 bg-orange-50/40">
          <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mb-4 sm:mb-6 bg-orange-100 text-[var(--color-accent)] rounded-full">
            <KeyRound className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-serif font-bold text-[var(--color-primary)] mb-2 sm:mb-3">Account Security</h3>
          <p className="text-[var(--color-text-secondary)] font-sans text-xs sm:text-sm mb-6 sm:mb-8 leading-relaxed flex-1">Update your login password and manage credentials.</p>
          
          <button 
            onClick={() => setIsPasswordModalOpen(true)}
            className="w-full py-2.5 sm:py-3 bg-[var(--color-primary)] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity rounded-lg"
          >
            <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
