import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  LayoutDashboard, BarChart2, Users, UserPlus, Upload, 
  Mail, Code2, Gamepad2, Settings, LogOut, Sparkles, X
} from 'lucide-react';

const AdminSidebar = ({ onClose, isMobile = false }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (onClose) onClose();
    await logout();
    navigate('/login');
  };

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
    <div className="w-full h-full bg-white flex flex-col overflow-hidden">
      {/* Top Logo & Optional Close Button */}
      <div className="p-6 md:p-8 flex items-center justify-between shrink-0 border-b border-[var(--color-border)]/50">
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => {
            if (onClose) onClose();
            navigate('/admin');
          }}
        >
          <Sparkles className="w-6 h-6 text-[var(--color-accent)] shrink-0" />
          <div className="flex flex-col">
            <div className="flex whitespace-nowrap items-baseline gap-1">
              <span className="font-serif font-bold text-xl text-[var(--color-primary)]">AI</span>
              <span className="font-serif font-bold text-xl text-[var(--color-primary)]">Sajan Shah</span>
            </div>
            <span className="text-[10px] font-sans font-bold text-[var(--color-text-hint)] tracking-widest uppercase mt-0.5">Admin Matrix</span>
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

      {/* Navigation */}
      <nav className="flex-1 px-5 py-4 overflow-y-auto overflow-x-hidden scrollbar-thin">
        {sections.map((section, idx) => (
          <div key={idx} className="mb-5">
            <p className="px-3 text-[10px] font-sans font-bold uppercase tracking-widest text-[var(--color-text-hint)] mb-2">
              {section.label}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  onClick={() => {
                    if (onClose) onClose();
                  }}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2 rounded-lg text-[13.5px] font-sans transition-all duration-200
                    ${isActive 
                      ? 'bg-[var(--color-bg)] text-[var(--color-primary)] font-semibold' 
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] hover:text-[var(--color-primary)] font-medium'
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <item.icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-hint)]'}`} />
                      <span className="truncate">{item.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Logout */}
      <div className="p-5 border-t border-[var(--color-border)] shrink-0 bg-white">
        <button 
          onClick={handleLogout}
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
