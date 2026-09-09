import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Brain, Target, Compass, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const FEATURES = [
  {
    icon: Brain,
    num: '01',
    title: 'Memory Techniques',
    desc: 'Retain and recall faster with neuroscience-backed methods.',
  },
  {
    icon: Target,
    num: '02',
    title: 'Goal Setting',
    desc: 'Turn ambitions into a clear 90-day action plan.',
  },
  {
    icon: Compass,
    num: '03',
    title: 'Career Guidance',
    desc: 'Personalized roadmaps for your professional journey.',
  },
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, userProfile, isAdmin, loading, error: authError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (userProfile) {
      navigate(isAdmin ? '/admin' : '/student', { replace: true });
    }
  }, [userProfile, isAdmin, navigate, loading]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setLocalError('Please enter both email and password.');
      return;
    }
    try {
      setIsSubmitting(true);
      setLocalError('');
      const profile = await login(email, password);
      navigate(profile.role === 'admin' ? '/admin' : '/student');
    } catch (err) {
      setLocalError(err.message || 'Failed to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayError = localError || authError;

  return (
    <div className="auth-page">
      {/* ── Brand panel (left) ── */}
      <div className="auth-brand">
        <div className="auth-brand-texture" aria-hidden="true" />
        <div className="auth-brand-accent-bar" aria-hidden="true" />
        <p className="auth-brand-watermark" aria-hidden="true">TRANSFORM · GROW · ACHIEVE</p>

        <div className="auth-brand-glow auth-brand-glow--accent" aria-hidden="true" />
        <div className="auth-brand-glow auth-brand-glow--warm" aria-hidden="true" />
        <div className="auth-brand-orbit" aria-hidden="true">
          <span /><span /><span />
        </div>

        {/* Logo showcase */}
        <div className="auth-brand-header auth-animate-in">
          <div className="auth-logo-showcase">
            <div className="auth-logo-orbit-ring" aria-hidden="true" />
            <div className="auth-logo-diamond">
              <img src="/favicon.png" alt="Sajan Shah Logo" className="w-9 h-9 object-contain" />
            </div>
            <span className="auth-logo-live">
              <span className="auth-logo-live-dot" />
              Live 24/7
            </span>
          </div>

          <div className="auth-logo-lockup">
            <span className="auth-logo-prefix">AI</span>
            <h1 className="auth-logo-hero">Sajan Shah</h1>
            <div className="auth-logo-swoosh" aria-hidden="true">
              <svg viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 8C40 2 80 2 120 6C150 9 175 10 198 4" stroke="url(#swoosh)" strokeWidth="2.5" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="swoosh" x1="0" y1="0" x2="200" y2="0">
                    <stop stopColor="#E55A28" stopOpacity="0"/>
                    <stop offset="0.3" stopColor="#E55A28"/>
                    <stop offset="0.7" stopColor="#FFB347"/>
                    <stop offset="1" stopColor="#FFB347" stopOpacity="0"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <p className="auth-logo-tagline">Your Personal Mentor, Always On</p>
          </div>
        </div>

        <div className="auth-brand-body auth-animate-in auth-animate-in--delay-1">
          <div className="auth-quote-block">
            <p className="auth-quote-text">
              &ldquo;Your mind is your greatest asset — let me help you unlock it.&rdquo;
            </p>
            <p className="auth-quote-sig">— The Sajan Shah Family</p>
          </div>

          <h2 className="auth-headline">
            Unlock Your
            <em> True Potential</em>
          </h2>

          <div className="feature-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-card-top">
                  <span className="feature-num">{f.num}</span>
                  <div className="feature-icon">
                    <f.icon className="w-[18px] h-[18px]" strokeWidth={1.75} />
                  </div>
                </div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="auth-stats-bar auth-animate-in auth-animate-in--delay-2">
          <div className="auth-stat-item">
            <span className="auth-stat-value auth-stat-value--accent">15M+</span>
            <span className="auth-stat-label">Lives Transformed</span>
          </div>
          <div className="auth-stat-divider" aria-hidden="true" />
          <div className="auth-stat-item">
            <span className="auth-stat-value">3×</span>
            <span className="auth-stat-label">TEDx Speaker</span>
          </div>
          <div className="auth-stat-divider" aria-hidden="true" />
          <div className="auth-stat-item">
            <span className="auth-stat-value auth-stat-value--gold">90</span>
            <span className="auth-stat-label">Day Framework</span>
          </div>
        </div>
      </div>

      {/* ── Login form (right) ── */}
      <div className="auth-form-panel flex flex-col justify-center min-h-screen py-8 px-4 sm:px-6 lg:px-12">
        <div className="auth-form-inner w-full max-w-md mx-auto bg-white sm:bg-transparent p-6 sm:p-0 rounded-2xl sm:rounded-none border sm:border-0 border-[var(--color-border)] shadow-sm sm:shadow-none">
          
          {/* Mobile & Tablet Brand Header */}
          <div className="lg:hidden flex items-center justify-between mb-8 pb-5 border-b border-[var(--color-border)]/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF7A45] to-[#E55A28] flex items-center justify-center text-white shadow-md shadow-orange-500/20">
                <Sparkles className="w-5 h-5" strokeWidth={2} />
              </div>
              <div>
                <span className="font-serif font-bold text-lg text-[var(--color-primary)] leading-none block">AI Sajan Shah</span>
                <span className="text-[10px] font-sans font-bold tracking-widest text-[var(--color-accent)] uppercase mt-0.5 block">AI Mentor Matrix</span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-green-50 text-green-700 border border-green-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Live 24/7
            </span>
          </div>

          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-primary)] mb-2">Welcome Back</h2>
            <p className="text-sm sm:text-[15px] font-sans text-[var(--color-text-secondary)]">
              Sign in to continue your learning journey
            </p>
          </div>

          {displayError && (
            <div className="alert-error mb-5 sm:mb-6 p-3.5 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
              <span>{displayError}</span>
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="flex flex-col gap-4 sm:gap-5">
            <div>
              <label className="form-label text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 block" htmlFor="email">Email Address</label>
              <div className="form-input-icon-wrap relative">
                <Mail className="input-icon absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-hint)] w-4 h-4" />
                <input
                  id="email"
                  type="email"
                  className="form-input w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] focus:bg-white focus:border-[var(--color-accent)] text-sm font-sans outline-none transition-all"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="form-label text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 block" htmlFor="password">Password</label>
              <div className="form-input-icon-wrap relative">
                <Lock className="input-icon absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-hint)] w-4 h-4" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input w-full pl-10 pr-11 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] focus:bg-white focus:border-[var(--color-accent)] text-sm font-sans outline-none transition-all"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="input-action absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-hint)] hover:text-[var(--color-primary)] p-1 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="checkbox-label flex items-center gap-2 cursor-pointer select-none text-xs sm:text-sm font-sans text-[var(--color-text-secondary)]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[var(--color-border)] text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                className="text-xs sm:text-sm font-sans font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="btn-elegant w-full py-3.5 rounded-xl font-semibold text-sm sm:text-[15px] mt-2 shadow-md shadow-orange-500/20 active:scale-[0.99] transition-all"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Quick quote note on mobile */}
          <div className="lg:hidden mt-8 pt-6 border-t border-[var(--color-border)]/60 text-center">
            <p className="text-xs font-sans text-[var(--color-text-hint)] leading-relaxed">
              &ldquo;Your mind is your greatest asset — let me help you unlock it.&rdquo;
            </p>
            <p className="font-serif italic text-xs text-[var(--color-accent)] mt-1">— Sajan Shah</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
