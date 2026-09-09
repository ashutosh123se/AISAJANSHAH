import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import StudentSidebar from './StudentSidebar';
import { Menu, Bell, Sparkles } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex font-sans relative overflow-hidden">
      {/* Elegant Flat Background - No Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[var(--color-bg)]"></div>

      {/* Sidebar (Desktop) */}
      <div className="hidden lg:block w-[280px] shrink-0 relative z-40 border-r border-[var(--color-border)] bg-white shadow-sm h-screen">
        <StudentSidebar />
      </div>

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
          className={`absolute inset-y-0 left-0 w-[300px] max-w-[85vw] bg-white shadow-2xl z-10 flex flex-col transform transition-transform duration-300 ease-out ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <StudentSidebar onClose={() => setMobileMenuOpen(false)} isMobile={true} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-white border-b border-[var(--color-border)] flex items-center justify-between px-4 shrink-0 shadow-sm z-20">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Navigation Menu"
              className="p-2 -ml-1 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] active:scale-95 transition-all"
            >
              <Menu className="w-6 h-6 text-[var(--color-primary)]" />
            </button>
            <div 
              onClick={() => navigate('/student')}
              className="flex items-center gap-2 cursor-pointer select-none"
            >
              <Sparkles className="w-5 h-5 text-[var(--color-accent)] shrink-0" />
              <span className="font-serif font-bold text-lg text-[var(--color-primary)]">AI Sajan Shah</span>
            </div>
          </div>
          <button 
            onClick={() => navigate('/student/profile')}
            aria-label="Student Profile"
            className="p-2 rounded-full text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] relative transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
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
        <main className={`flex-1 flex flex-col min-h-0 ${isChat ? '' : 'overflow-y-auto px-4 md:px-6 lg:px-12 pb-12'}`}>
          <div className={`${isChat ? 'w-full h-full flex flex-col' : 'max-w-6xl mx-auto w-full h-full'}`}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
