import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  LayoutDashboard, BarChart2, Users, UserPlus, Upload, 
  Mail, Code2, Gamepad2, Settings, LogOut, Sparkles
} from 'lucide-react';

const AdminSidebar = () => {
  const { logout } = useAuth();

  const sections = [
    {
      label: 'OVERVIEW',
      items: [
        { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
        { label: 'Analytics', path: '/admin/analytics', icon: BarChart2 },
      ]
    },
    {
      label: 'STUDENTS',
      items: [
        { label: 'All Students', path: '/admin/students', icon: Users },
        { label: 'Add Student', path: '/admin/add-student', icon: UserPlus },
        { label: 'Upload CSV', path: '/admin/upload-csv', icon: Upload },
        { label: 'Email Logs', path: '/admin/email-logs', icon: Mail },
      ]
    },
    {
      label: 'CONTENT',
      items: [
        { label: 'AI Prompt Editor', path: '/admin/prompt-editor', icon: Code2 },
        { label: 'Brain Gym Scores', path: '/admin/content', icon: Gamepad2 },
      ]
    },
    {
      label: 'SYSTEM',
      items: [
        { label: 'Settings', path: '/admin/settings', icon: Settings },
      ]
    }
  ];

  return (
    <div className="w-full h-full bg-white flex flex-col overflow-y-auto">
      {/* Top Logo */}
      <div className="p-8 flex items-center gap-3 shrink-0">
        <img src="/favicon.png" alt="Sajan Shah Logo" className="w-9 h-9 object-contain shrink-0" />
        <div className="flex flex-col">
          <div className="flex whitespace-nowrap items-baseline gap-1">
            <span className="font-serif font-bold text-xl text-[var(--color-primary)]">AI</span>
            <span className="font-serif font-bold text-xl text-[var(--color-primary)]">Sajan Shah</span>
          </div>
          <span className="text-[10px] font-sans font-bold text-[var(--color-text-hint)] tracking-widest uppercase mt-0.5">Admin Matrix</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 pb-6 overflow-y-auto overflow-x-hidden mt-4">
        {sections.map((section, idx) => (
          <div key={idx} className="mb-6">
            <p className="px-3 text-[10px] font-sans font-bold uppercase tracking-widest text-[var(--color-text-hint)] mb-2">
              {section.label}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-sans transition-all duration-200
                    ${isActive 
                      ? 'bg-[var(--color-bg)] text-[var(--color-primary)] font-semibold' 
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] hover:text-[var(--color-primary)] font-medium'
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <item.icon className={`w-[18px] h-[18px] ${isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-hint)]'}`} />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Logout */}
      <div className="p-6 mt-auto border-t border-[var(--color-border)] shrink-0">
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[var(--color-text-secondary)] hover:text-red-600 hover:bg-red-50 transition-all duration-200 text-[14px] font-sans font-medium text-left"
        >
          <LogOut className="w-[18px] h-[18px]" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
