import React, { useState } from 'react';
import { Compass, Briefcase, GraduationCap, TrendingUp, Search, AlertCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { apiFetch } from '../../utils/api';
import { isDevAuthEnabled } from '../../devAuth';
import { generateDevCareerAnalysis } from '../../utils/devCareer';

const CareerAI = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isDemo, setIsDemo] = useState(false);
  const { isDevAuth } = useAuth();

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    setError(null);
    setResult(null);
    setIsDemo(false);

    try {
      const response = await apiFetch('/api/career/analyze', {
        method: 'POST',
        body: JSON.stringify({ query: query.trim() }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to analyze career path');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Career Analysis Error:', err);
      // Useful fallback instead of a dead-end error
      setResult(generateDevCareerAnalysis(query));
      setIsDemo(true);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto w-full px-4 lg:px-6 py-6 lg:py-10">
      <div className="mb-10">
        <h2 className="text-4xl font-serif font-bold text-[var(--color-primary)] tracking-tight mb-2 flex items-center gap-3">
          <div className="w-12 h-12 border border-[var(--color-border)] flex items-center justify-center bg-[var(--color-bg)]">
            <Compass className="w-6 h-6 text-[var(--color-primary)]" />
          </div>
          Career AI
        </h2>
        <p className="text-[15px] font-sans mt-3 text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
          Discover career paths tailored to your unique neural blueprint. Sajan&apos;s AI will calculate the optimal trajectory.
        </p>
      </div>

      <div className="p-8 mb-10 bg-white border border-[var(--color-border)]">
        <h3 className="text-[18px] font-serif font-bold text-[var(--color-primary)] mb-6">
          Input your desired parameters or dream trajectories
        </h3>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 group/input">
            <Search className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-[var(--color-text-hint)] group-focus-within/input:text-[var(--color-primary)] transition-colors" />
            <input
              type="text"
              placeholder="e.g., I want to be a data scientist... or I like designing interfaces"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
              className="w-full h-14 pl-14 pr-4 text-[15px] font-sans text-[var(--color-primary)] bg-[var(--color-bg)] border border-[var(--color-border)] transition-all outline-none focus:border-[var(--color-primary)]"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={!query.trim() || isSearching}
            className="btn-elegant h-14 px-8 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSearching ? 'Computing...' : 'Analyze Vector'}
          </button>
        </div>

        {error && (
          <div className="mt-6 p-4 flex items-center gap-3 text-[14px] font-sans text-red-600 bg-red-50 border border-red-200">
            <AlertCircle className="w-5 h-5" /> {error}
          </div>
        )}
      </div>

      {result && (
        <div className="p-8 lg:p-10 animate-in fade-in slide-in-from-bottom-4 bg-white border border-[var(--color-border)]">
          {isDemo && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-sm font-sans text-amber-800 rounded-lg">
              Demo career plan generated locally. Add <code className="bg-amber-100 px-1 rounded">OPENAI_API_KEY</code> to backend/.env for live AI analysis.
            </div>
          )}

          {result.isHarmful && (
            <div className="mb-8 p-6 bg-red-50 border-2 border-red-500 flex items-start gap-4">
              <div className="w-12 h-12 bg-white border border-red-300 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h4 className="text-lg font-serif font-bold text-red-900 mb-1">
                  {result.warningTitle || '⚠️ Unethical & Destructive Path Detected'}
                </h4>
                <p className="text-[14px] font-sans text-red-800 leading-relaxed">
                  {result.warningMessage || `"${query}" is illegal, dangerous, and destructive to society. Real strength comes from building and protecting communities. Sajan AI has redirected your energy toward a noble alternative path below.`}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 border border-[var(--color-border)] flex items-center justify-center bg-[var(--color-bg)]">
                  <Briefcase className="w-5 h-5 text-[var(--color-primary)]" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-[var(--color-primary)]">
                  {result.title}
                </h3>
              </div>
              <p className="text-[15px] font-sans max-w-3xl leading-relaxed text-[var(--color-text-secondary)]">
                {result.description}
              </p>
            </div>
            <div className={`p-4 flex flex-col items-center justify-center shrink-0 min-w-[100px] border ${result.isHarmful ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
              <span className="text-[28px] font-serif font-bold">{result.match}%</span>
              <span className={`text-[11px] font-sans font-bold uppercase tracking-widest ${result.isHarmful ? 'text-red-600' : 'text-green-600'}`}>
                {result.isHarmful ? 'Viability' : 'Match'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10 pt-10 border-t border-[var(--color-border)]">
            <div>
              <h4 className="text-[16px] font-serif font-bold text-[var(--color-primary)] flex items-center gap-2 mb-6">
                <GraduationCap className="w-5 h-5 text-[var(--color-text-secondary)]" />
                Strategic Action Plan
              </h4>
              <div className="flex flex-col gap-5">
                {result.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 bg-[var(--color-bg)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors">
                    <div className="w-8 h-8 flex items-center justify-center font-bold text-[14px] shrink-0 mt-0.5 border border-[var(--color-border)] bg-white text-[var(--color-primary)]">
                      {idx + 1}
                    </div>
                    <p className="text-[15px] font-sans text-[var(--color-text-secondary)] leading-relaxed">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[16px] font-serif font-bold text-[var(--color-primary)] flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-[var(--color-text-secondary)]" />
                Required Competencies
              </h4>
              <div className="flex flex-wrap gap-3">
                {result.skills.map((skill, idx) => (
                  <span key={idx} className="px-4 py-2 text-[14px] font-sans font-medium bg-[var(--color-bg)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors cursor-default">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="mt-10 p-8 bg-[var(--color-bg)] border border-[var(--color-border)]">
                <p className="text-[16px] font-sans italic font-medium text-[var(--color-text-secondary)] leading-relaxed">
                  &quot;Your career is a marathon, not a sprint. Focus on building these skills daily, and the results will follow.&quot;
                </p>
                <div className="flex items-center gap-3 mt-6">
                  <div className="w-10 h-10 border border-[var(--color-border)] bg-white flex items-center justify-center">
                    <span className="text-[var(--color-primary)] font-serif font-bold text-[14px]">SS</span>
                  </div>
                  <p className="text-[14px] font-serif font-bold text-[var(--color-primary)]">
                    — Sajan Shah <span className="text-[var(--color-text-hint)] font-sans font-medium ml-1">| AI Mentor</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerAI;
