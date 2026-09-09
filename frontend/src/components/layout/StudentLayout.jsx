import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, NavLink } from 'react-router-dom';
import StudentSidebar from './StudentSidebar';
import { Menu, Bell, Sparkles, LayoutDashboard, MessageSquareText, Target, Brain, MoreHorizontal } from 'lucide-react';

const StudentLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isChat = location.pathname === '/student/chat';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const mobileBottomNavItems = [
    { name: 'Home', path: '/student', icon: LayoutDashboard, exact: true },
    { name: 'AI Sajan', path: '/student/chat', icon: MessageSquareText },
    { name: 'Goals', path: '/student/goals', icon: Target },
    { name: 'Study', path: '/student/study-hacks', icon: Brain },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col lg:flex-row font-sans relative overflow-x-hidden">
      {/* Elegant Flat Background */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[var(--color-bg)]"></div>

      {/* Sidebar (Desktop) */}
      <aside className="hidden lg:block w-[280px] shrink-0 relative z-40 border-r border-[var(--color-border)] bg-white shadow-sm h-screen sticky top-0">
        <StudentSidebar />
      </aside>

      {/* Mobile Drawer (Slide-out Navigation on Phone Displays) */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Sliding Drawer Panel */}
        <div
          className={`absolute inset-y-0 left-0 w-[290px] max-w-[85vw] bg-white shadow-2xl z-10 flex flex-col transform transition-transform duration-300 ease-out ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <StudentSidebar onClose={() => setMobileMenuOpen(false)} isMobile={true} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:h-screen lg:overflow-hidden relative z-10">
        {/* Mobile Top Header */}
        <header className="lg:hidden h-14 bg-white/95 backdrop-blur-md border-b border-[var(--color-border)] sticky top-0 z-30 flex items-center justify-between px-3.5 shrink-0 shadow-xs">
          <div className="flex items-center gap-2.5">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Navigation Menu"
              className="p-1.5 -ml-1 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] active:scale-95 transition-all"
            >
              <Menu className="w-5 h-5 text-[var(--color-primary)]" />
            </button>
            <div 
              onClick={() => navigate('/student')}
              className="flex items-center gap-1.5 cursor-pointer select-none"
            >
              <Sparkles className="w-4 h-4 text-[var(--color-accent)] shrink-0" />
              <span className="font-serif font-bold text-base sm:text-lg text-[var(--color-primary)] tracking-tight">AI Sajan Shah</span>
            </div>
          </div>
          <button 
            onClick={() => navigate('/student/profile')}
            aria-label="Student Profile"
            className="p-1.5 -mr-1 rounded-full text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] relative transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
        </header>

        {/* Desktop Header */}
        {!isChat && (
          <header className="hidden lg:flex h-20 bg-transparent items-center justify-end px-12 shrink-0 z-10">
            <button 
              onClick={() => navigate('/student/profile')}
              className="p-3 rounded-full text-[var(--color-text-secondary)] bg-white border border-[var(--color-border)] shadow-sm hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] relative transition-all"
            >
              <Bell className="w-[22px] h-[22px]" />
              <span className="absolute top-2.5 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </header>
        )}

        {/* Page Content */}
        <main className={`flex-1 flex flex-col min-h-0 ${isChat ? 'h-[calc(100dvh-3.5rem)] lg:h-full' : 'overflow-y-auto overflow-x-hidden px-3.5 sm:px-6 lg:px-12 py-4 sm:py-6 pb-24 lg:pb-12'}`}>
          <div className={`${isChat ? 'w-full h-full flex flex-col' : 'max-w-6xl mx-auto w-full h-full'}`}>
            <Outlet />
          </div>
        </main>

        {/* Mobile Bottom Quick Navigation (Hidden during active chat) */}
        {!isChat && (
          <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[var(--color-border)] px-2 py-1.5 pb-[max(6px,env(safe-area-inset-bottom))] shadow-lg flex items-center justify-around">
            {mobileBottomNavItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.exact}
                className={({ isActive }) => `
                  flex flex-col items-center justify-center py-1 px-3 rounded-lg text-xs transition-colors min-w-[56px]
                  ${isActive 
                    ? 'text-[var(--color-accent)] font-bold' 
                    : 'text-[var(--color-text-secondary)] font-medium hover:text-[var(--color-primary)]'
                  }
                `}
              >
                <item.icon className="w-5 h-5 mb-0.5" />
                <span className="text-[11px]">{item.name}</span>
              </NavLink>
            ))}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex flex-col items-center justify-center py-1 px-3 rounded-lg text-xs text-[var(--color-text-secondary)] font-medium hover:text-[var(--color-primary)] min-w-[56px]"
            >
              <MoreHorizontal className="w-5 h-5 mb-0.5" />
              <span className="text-[11px]">More</span>
            </button>
          </nav>
        )}
      </div>
    </div>
  );
};

export default StudentLayout;
