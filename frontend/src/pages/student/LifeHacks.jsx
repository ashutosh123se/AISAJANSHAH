import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Map, HeartHandshake, ArrowRight, Zap } from 'lucide-react';

const LifeHacks = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 sm:gap-10 pb-12 pt-2 sm:pt-4">
      {/* Banner */}
      <div className="relative overflow-hidden bg-white border border-[var(--color-border)] rounded-2xl p-5 sm:p-8 lg:p-14 shadow-sm">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 mb-4 sm:mb-6">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--color-accent)]" />
            </div>
            <span className="text-[11px] sm:text-xs font-sans font-bold text-[var(--color-text-secondary)] tracking-widest uppercase">Life Optimization</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-serif font-bold tracking-tight mb-3 sm:mb-6 text-[var(--color-primary)]">
            Life Hacks.
          </h1>
          <p className="text-[var(--color-text-secondary)] text-sm sm:text-base lg:text-xl font-sans leading-relaxed max-w-2xl">
            Upgrade your daily operating system. Track your goals, visualize your roadmaps, and maintain optimal mental health.
          </p>
        </div>
        
        <div className="absolute top-10 right-10 opacity-10 pointer-events-none hidden sm:block">
          <Zap className="w-64 h-64 text-[var(--color-accent)]" />
        </div>
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
        
        {/* Goals */}
        <div className="group bg-white rounded-2xl p-5 sm:p-8 lg:p-10 border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all duration-300 shadow-sm flex flex-col h-full">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center mb-4 sm:mb-8">
            <Target className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--color-primary)] group-hover:text-[var(--color-accent)] transition-colors" />
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[var(--color-primary)] mb-2 sm:mb-4">My Goals</h3>
          <p className="text-[var(--color-text-secondary)] font-sans text-xs sm:text-sm mb-6 sm:mb-10 leading-relaxed flex-grow">Define and track your objectives. Transform your ambitions into actionable milestones.</p>
          
          <button 
            onClick={() => navigate('/student/goals')}
            className="w-full py-3 sm:py-4 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-primary)] font-sans font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all group-hover:bg-[var(--color-primary)] group-hover:text-white group-hover:border-[var(--color-primary)]"
          >
            Manage Goals <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Roadmaps */}
        <div className="group bg-white rounded-2xl p-5 sm:p-8 lg:p-10 border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all duration-300 shadow-sm flex flex-col h-full">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center mb-4 sm:mb-8">
            <Map className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--color-primary)] group-hover:text-[var(--color-accent)] transition-colors" />
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[var(--color-primary)] mb-2 sm:mb-4">Roadmaps</h3>
          <p className="text-[var(--color-text-secondary)] font-sans text-xs sm:text-sm mb-6 sm:mb-10 leading-relaxed flex-grow">Visualize your entire journey. Step-by-step navigational matrices for long-term success.</p>
          
          <button 
            onClick={() => navigate('/student/roadmaps')}
            className="w-full py-3 sm:py-4 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-primary)] font-sans font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all group-hover:bg-[var(--color-primary)] group-hover:text-white group-hover:border-[var(--color-primary)]"
          >
            View Roadmaps <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Mental Health */}
        <div className="group bg-white rounded-2xl p-5 sm:p-8 lg:p-10 border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all duration-300 shadow-sm flex flex-col h-full">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center mb-4 sm:mb-8">
            <HeartHandshake className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--color-primary)] group-hover:text-[var(--color-accent)] transition-colors" />
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[var(--color-primary)] mb-2 sm:mb-4">Mental Health</h3>
          <p className="text-[var(--color-text-secondary)] font-sans text-xs sm:text-sm mb-6 sm:mb-10 leading-relaxed flex-grow">Track your emotional state and maintain cognitive equilibrium with AI-assisted logging.</p>
          
          <button 
            onClick={() => navigate('/student/mental-health')}
            className="w-full py-3 sm:py-4 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-primary)] font-sans font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all group-hover:bg-[var(--color-primary)] group-hover:text-white group-hover:border-[var(--color-primary)]"
          >
            Log Emotion <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default LifeHacks;
