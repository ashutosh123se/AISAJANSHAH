import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { Menu, Sparkles } from 'lucide-react';

const AdminLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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
    <div className="h-screen bg-[var(--color-bg)] flex font-sans relative overflow-hidden">
      {/* Elegant Flat Background - No Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[var(--color-bg)]"></div>

      {/* Admin Sidebar (Desktop) */}
      <div className="hidden lg:block w-[260px] flex-shrink-0 relative z-40 border-r border-[var(--color-border)] bg-white h-full">
        <AdminSidebar />
      </div>

      {/* Mobile Drawer (Slide-out on Phone Displays) */}
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
          className={`absolute inset-y-0 left-0 w-[280px] max-w-[85vw] bg-white shadow-2xl z-10 flex flex-col transform transition-transform duration-300 ease-out ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <AdminSidebar onClose={() => setMobileMenuOpen(false)} isMobile={true} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen relative z-10 overflow-hidden">
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
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2 cursor-pointer select-none"
            >
              <Sparkles className="w-5 h-5 text-[var(--color-accent)] shrink-0" />
              <span className="font-serif font-bold text-lg text-[var(--color-primary)]">Admin Matrix</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-12">
          <div className="w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
