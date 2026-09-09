import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquareText, 
  PenLine, 
  Target, 
  Map, 
  Brain, 
  HeartHandshake, 
  Briefcase, 
  TrendingUp, 
  UserCircle,
  LogOut,
  Sparkles,
  KeyRound,
  X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import ChangePasswordModal from '../auth/ChangePasswordModal';

const StudentSidebar = ({ onClose, isMobile = false }) => {
  const { logout, userProfile } = useAuth();
  const navigate = useNavigate();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      if (onClose) onClose();
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleItemClick = (path) => {
    if (onClose) onClose();
    if (path) navigate(path);
  };

  const navGroups = [
    {
      title: 'Overview',
      items: [
        { name: 'Dashboard', path: '/student', icon: LayoutDashboard, exact: true },
        { name: 'AI Sajan Chat', path: '/student/chat', icon: MessageSquareText },
        { name: 'Goals & Targets', path: '/student/goals', icon: Target },
        { name: 'Roadmaps', path: '/student/roadmaps', icon: Map },
      ]
    },
    {
      title: 'Mind & Training',
      items: [
        { name: 'Brain Gym', path: '/student/neuroscience', icon: Brain },
        { name: 'Study Hacks', path: '/student/study-hacks', icon: Brain },
        { name: 'Life Hacks', path: '/student/life-hacks', icon: Target },
        { name: 'Mental Health', path: '/student/mental-health', icon: HeartHandshake },
      ]
    },
    {
      title: 'Tools & Growth',
      items: [
        { name: 'Career AI', path: '/student/career', icon: Briefcase },
        { name: 'Linking Tool', path: '/student/paragraph-tool', icon: PenLine },
        { name: 'Progress Matrix', path: '/student/progress', icon: TrendingUp },
        { name: 'Profile', path: '/student/profile', icon: UserCircle },
      ]
    }
  ];

  return (
    <div className="w-full h-full bg-white flex flex-col overflow-hidden">
      {/* Brand & Optional Mobile Close Button */}
      <div className="p-6 md:p-8 flex items-center justify-between shrink-0 border-b border-[var(--color-border)]/50">
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => handleItemClick('/student')}
        >
          <Sparkles className="w-6 h-6 text-[var(--color-accent)] shrink-0" />
          <div className="flex whitespace-nowrap items-baseline gap-1">
            <span className="font-serif font-bold text-xl text-[var(--color-primary)]">AI</span>
            <span className="font-serif font-bold text-xl text-[var(--color-primary)]">Sajan Shah</span>
          </div>
        </div>

        {isMobile && (
          <button
            onClick={onClose}
            aria-label="Close Navigation"
            className="p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] active:scale-95 transition-all"
          >
            <X className="w-5 h-5 text-[var(--color-primary)]" />
          </button>
        )}
      </div>

      {/* User Info (Mini) */}
      {userProfile && (
        <div className="px-6 pt-5 pb-2 shrink-0">
          <div 
            onClick={() => handleItemClick('/student/profile')}
            className="bg-[var(--color-bg)] rounded-lg p-3.5 border border-[var(--color-border)] flex items-center gap-3 hover:border-[var(--color-primary)] transition-colors cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-white border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)] font-serif font-bold text-base shrink-0">
              {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-sans font-bold text-[var(--color-primary)] truncate">{userProfile.name || 'Student'}</p>
              <p className="text-xs font-sans text-[var(--color-text-secondary)] truncate mt-0.5">{userProfile.email}</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (onClose) onClose();
              setIsPasswordModalOpen(true);
            }}
            className="w-full mt-2 py-1.5 px-3 rounded-md text-xs font-sans font-semibold text-[var(--color-accent)] hover:bg-orange-50 border border-orange-200/60 transition-colors flex items-center justify-center gap-1.5"
          >
            <KeyRound className="w-3.5 h-3.5" />
            Change Password
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-5 py-4 overflow-y-auto overflow-x-hidden scrollbar-thin">
        {navGroups.map((group, idx) => (
          <div key={idx} className="mb-5">
            <p className="px-3 text-[10px] font-sans font-bold uppercase tracking-widest text-[var(--color-text-hint)] mb-2">
              {group.title}
            </p>
            
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.exact}
                  onClick={() => {
                    if (onClose) onClose();
                  }}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-[13.5px] font-sans transition-all duration-200 ${
                      isActive
                        ? 'nav-active'
                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] hover:text-[var(--color-primary)] font-medium'
                    }`
                  }
                >
                  <item.icon className="w-[18px] h-[18px] shrink-0" />
                  <span className="truncate">{item.name}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-5 border-t border-[var(--color-border)] shrink-0 bg-white">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-[14px] font-sans font-medium text-[var(--color-text-secondary)] hover:bg-red-50 hover:text-red-600 transition-all duration-200 text-left"
        >
          <LogOut className="w-[18px] h-[18px]" />
          Log Out
        </button>
      </div>

      <ChangePasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
      />
    </div>
  );
};

export default StudentSidebar;
