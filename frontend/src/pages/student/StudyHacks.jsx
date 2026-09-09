import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Briefcase, ArrowRight, Lightbulb } from 'lucide-react';

const StudyHacks = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 sm:gap-10 pb-12 pt-2 sm:pt-4">
      {/* Banner */}
      <div className="relative overflow-hidden bg-white border border-[var(--color-border)] rounded-2xl p-5 sm:p-8 lg:p-14 shadow-sm">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 mb-4 sm:mb-6">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center">
              <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--color-accent)]" />
            </div>
            <span className="text-[11px] sm:text-xs font-sans font-bold text-[var(--color-text-secondary)] tracking-widest uppercase">Cognitive Expansion</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-serif font-bold tracking-tight mb-3 sm:mb-6 text-[var(--color-primary)]">
            Study Hacks.
          </h1>
          <p className="text-[var(--color-text-secondary)] text-sm sm:text-base lg:text-xl font-sans leading-relaxed max-w-2xl">
            Accelerate your learning capabilities. Engage in neural training and navigate your career path with advanced AI intelligence.
          </p>
        </div>
        
        <div className="absolute top-10 right-10 opacity-10 pointer-events-none hidden sm:block">
          <Lightbulb className="w-64 h-64 text-[var(--color-accent)]" />
        </div>
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
        
        {/* Brain Gym */}
        <div className="group bg-white rounded-2xl p-5 sm:p-8 lg:p-10 border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all duration-300 shadow-sm flex flex-col h-full">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center mb-4 sm:mb-8">
            <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--color-primary)] group-hover:text-[var(--color-accent)] transition-colors" />
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[var(--color-primary)] mb-2 sm:mb-4">Brain Gym</h3>
          <p className="text-[var(--color-text-secondary)] font-sans text-xs sm:text-sm mb-6 sm:mb-10 leading-relaxed flex-grow">Engage in Memory Palace training and other neuroscience-backed exercises to boost your cognitive retention.</p>
          
          <button 
            onClick={() => navigate('/student/neuroscience')}
            className="w-full py-3 sm:py-4 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-primary)] font-sans font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all group-hover:bg-[var(--color-primary)] group-hover:text-white group-hover:border-[var(--color-primary)]"
          >
            Enter Training <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Career AI */}
        <div className="group bg-white rounded-2xl p-5 sm:p-8 lg:p-10 border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all duration-300 shadow-sm flex flex-col h-full">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center mb-4 sm:mb-8">
            <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--color-primary)] group-hover:text-[var(--color-accent)] transition-colors" />
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[var(--color-primary)] mb-2 sm:mb-4">Career AI</h3>
          <p className="text-[var(--color-text-secondary)] font-sans text-xs sm:text-sm mb-6 sm:mb-10 leading-relaxed flex-grow">Consult with specialized AI systems to discover the ideal career trajectory and academic pathways.</p>
          
          <button 
            onClick={() => navigate('/student/career')}
            className="w-full py-3 sm:py-4 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-primary)] font-sans font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all group-hover:bg-[var(--color-primary)] group-hover:text-white group-hover:border-[var(--color-primary)]"
          >
            Analyze Career <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default StudyHacks;
