import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import StudentSidebar from './StudentSidebar';
import { Menu, Bell } from 'lucide-react';

const StudentLayout = () => {
  const location = useLocation();
  const isChat = location.pathname === '/student/chat';
  
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex font-sans relative overflow-hidden">
      {/* Elegant Flat Background - No Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[var(--color-bg)]"></div>

      {/* Sidebar (Desktop) */}
      <div className="hidden lg:block w-[280px] shrink-0 relative z-40 border-r border-[var(--color-border)] bg-white shadow-sm">
        <StudentSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-white border-b border-[var(--color-border)] flex items-center justify-between px-6 shrink-0 shadow-sm z-20">
          <div className="flex items-center gap-3">
            <button className="p-2 -ml-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] transition-colors">
              <Menu className="w-[22px] h-[22px]" />
            </button>
            <img src="/favicon.png" alt="Sajan Shah Logo" className="w-7 h-7 object-contain shrink-0" />
            <span className="font-serif font-bold text-xl text-[var(--color-primary)]">AI Sajan Shah</span>
          </div>
          <button className="p-2 rounded-full text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] relative transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
        </header>

        {/* Desktop Header */}
        {!isChat && (
          <header className="hidden lg:flex h-20 bg-transparent items-center justify-end px-12 shrink-0 z-10">
            <button className="p-3 rounded-full text-[var(--color-text-secondary)] bg-white border border-[var(--color-border)] shadow-sm hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] relative transition-all">
              <Bell className="w-[22px] h-[22px]" />
              <span className="absolute top-2.5 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </header>
        )}

        {/* Page Content */}
        <main className={`flex-1 flex flex-col min-h-0 ${isChat ? '' : 'overflow-y-auto px-6 lg:px-12 pb-12'}`}>
          <div className={`${isChat ? 'w-full h-full flex flex-col' : 'max-w-6xl mx-auto w-full h-full'}`}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
