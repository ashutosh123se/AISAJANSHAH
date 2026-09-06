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
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const StudentSidebar = () => {
  const { logout, userProfile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const navGroups = [
    {
      title: 'Overview',
      items: [
        { name: 'Dashboard', path: '/student', icon: LayoutDashboard, exact: true },
        { name: 'Life Hacks', path: '/student/life-hacks', icon: Target },
        { name: 'Study Hacks', path: '/student/study-hacks', icon: Brain },
      ]
    },
    {
      title: 'Standalone',
      items: [
        { name: 'Ai Sajan', path: '/student/chat', icon: MessageSquareText },
        { name: 'Linking', path: '/student/paragraph-tool', icon: PenLine },
        { name: 'Profile', path: '/student/profile', icon: UserCircle },
      ]
    }
  ];

  return (
    <div className="w-full h-full bg-white flex flex-col overflow-y-auto">
      {/* Brand */}
      <div className="p-8 flex items-center gap-3 shrink-0">
        <img src="/favicon.png" alt="Sajan Shah Logo" className="w-9 h-9 object-contain shrink-0" />
        <div className="flex whitespace-nowrap items-baseline gap-1">
          <span className="font-serif font-bold text-xl text-[var(--color-primary)]">AI</span>
          <span className="font-serif font-bold text-xl text-[var(--color-primary)]">Sajan Shah</span>
        </div>
      </div>

      {/* User Info (Mini) */}
      {userProfile && (
        <div className="px-6 mb-8 shrink-0">
          <div className="bg-[var(--color-bg)] rounded-lg p-4 border border-[var(--color-border)] flex items-center gap-3 hover:border-[var(--color-primary)] transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-white border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)] font-serif font-bold text-lg">
              {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-sans font-bold text-[var(--color-primary)] truncate">{userProfile.name || 'Student'}</p>
              <p className="text-xs font-sans text-[var(--color-text-secondary)] truncate mt-0.5">{userProfile.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-6 pb-6 overflow-y-auto overflow-x-hidden">
        {navGroups.map((group, idx) => {
          if (group.title === 'Overview' || group.title === 'Standalone') {
            return (
              <div key={idx} className={group.title === 'Overview' ? 'mb-2 space-y-1' : 'mt-2 mb-4 space-y-1'}>
                {group.items.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    end={item.exact}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-sans transition-all duration-200 ${
                        isActive
                          ? 'nav-active'
                          : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] hover:text-[var(--color-primary)] font-medium'
                      }`
                    }
                  >
                    <item.icon className="w-[18px] h-[18px]" />
                    {item.name}
                  </NavLink>
                ))}
              </div>
            );
          }

          return (
            <div key={idx} className="mb-6">
              <p className="px-3 text-[10px] font-sans font-bold uppercase tracking-widest text-[var(--color-text-hint)] mb-2">
                {group.title}
              </p>
              
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    end={item.exact}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-sans transition-all duration-200 ${
                        isActive
                          ? 'nav-active'
                          : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] hover:text-[var(--color-primary)] font-medium'
                      }`
                    }
                  >
                    <item.icon className="w-[18px] h-[18px]" />
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-6 mt-auto border-t border-[var(--color-border)] shrink-0">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-[14px] font-sans font-medium text-[var(--color-text-secondary)] hover:bg-red-50 hover:text-red-600 transition-all duration-200 text-left"
        >
          <LogOut className="w-[18px] h-[18px]" />
          Log Out
        </button>
      </div>
    </div>
  );
};

export default StudentSidebar;
