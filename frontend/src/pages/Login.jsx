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
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#0C0B0A] text-white relative overflow-x-hidden font-sans">
      {/* Ambient background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#E55A28]/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] rounded-full bg-[#D4A017]/10 blur-[130px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(229,90,40,0.12),transparent_70%)] pointer-events-none" />

      {/* ── Desktop Left Brand Column (Hidden on mobile) ── */}
      <div className="hidden lg:flex flex-col justify-between relative overflow-hidden flex-[1.15] p-10 xl:p-14 z-10 border-r border-white/10 bg-black/40">
        <div className="auth-brand-texture" aria-hidden="true" />
        <div className="auth-brand-accent-bar" aria-hidden="true" />

        {/* Top Logo showcase */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF7A45] via-[#E55A28] to-[#C2451B] flex items-center justify-center text-white shadow-xl shadow-orange-500/25 border border-white/20">
              <Sparkles className="w-7 h-7" />
            </div>
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-black/90 text-white/90 border border-orange-500/40 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Live 24/7
            </span>
          </div>

          <div>
            <span className="text-[11px] font-bold tracking-[0.25em] text-[#E55A28] uppercase block">AI Personal Mentor</span>
            <h1 className="text-2xl xl:text-3xl font-serif font-bold text-white tracking-tight">Sajan Shah</h1>
          </div>
        </div>

        {/* Middle Value Proposition */}
        <div className="my-auto py-10">
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md mb-8 max-w-lg">
            <p className="font-serif italic text-lg text-white/90 leading-relaxed">
              &ldquo;Your mind is your greatest asset — let me help you unlock it.&rdquo;
            </p>
            <p className="font-cursive text-xl text-[#FF8C5A] mt-2">— The Sajan Shah Family</p>
          </div>

          <h2 className="text-3xl xl:text-4xl font-serif font-bold text-white mb-6 leading-tight">
            Unlock Your <span className="italic bg-gradient-to-r from-[#FFB347] to-[#E55A28] bg-clip-text text-transparent">True Potential</span>
          </h2>

          <div className="grid grid-cols-3 gap-3 max-w-lg">
            {FEATURES.map((f) => (
              <div key={f.title} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-orange-500/40 hover:bg-white/[0.06] transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-[#E55A28]">{f.num}</span>
                  <f.icon className="w-4 h-4 text-[#FF8C5A]" />
                </div>
                <h4 className="font-serif font-semibold text-xs text-white mb-1">{f.title}</h4>
                <p className="text-[11px] text-white/50 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="flex items-center gap-6 pt-6 border-t border-white/10">
          <div>
            <div className="text-2xl font-serif font-bold bg-gradient-to-r from-[#FF8C5A] to-[#E55A28] bg-clip-text text-transparent">15M+</div>
            <div className="text-[10px] font-bold tracking-wider uppercase text-white/40">Lives Transformed</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div>
            <div className="text-2xl font-serif font-bold text-white">3×</div>
            <div className="text-[10px] font-bold tracking-wider uppercase text-white/40">TEDx Speaker</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div>
            <div className="text-2xl font-serif font-bold text-[#FFD700]">90</div>
            <div className="text-[10px] font-bold tracking-wider uppercase text-white/40">Day Matrix</div>
          </div>
        </div>
      </div>

      {/* ── Form Column (Mobile & Desktop) ── */}
      <div className="flex-1 flex flex-col justify-between min-h-screen p-5 sm:p-8 lg:p-12 xl:p-16 relative z-20">
        
        {/* Mobile Header (Brand Showcase on mobile) */}
        <div className="lg:hidden flex items-center justify-between pt-2 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#FF7A45] to-[#E55A28] flex items-center justify-center text-white shadow-lg shadow-orange-500/20 border border-white/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif font-bold text-lg text-white leading-none block">AI Sajan Shah</span>
              <span className="text-[10px] font-sans font-bold tracking-widest text-[#FF8C5A] uppercase mt-1 block">AI Mentor Matrix</span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-white/10 text-white border border-white/15 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Live 24/7
          </span>
        </div>

        {/* Center Form Card */}
        <div className="w-full max-w-md mx-auto my-auto py-4">
          <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-9 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E55A28] to-transparent opacity-70" />

            <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-xs sm:text-sm font-sans text-white/60">
                Sign in to continue your learning journey
              </p>
            </div>

            {displayError && (
              <div className="mb-5 p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 text-xs sm:text-sm flex items-start gap-2.5 backdrop-blur-sm">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                <span>{displayError}</span>
              </div>
            )}

            <form onSubmit={handleEmailLogin} className="flex flex-col gap-4 sm:gap-5">
              <div>
                <label className="text-xs font-semibold text-white/70 mb-1.5 block tracking-wider uppercase" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4 pointer-events-none" />
                  <input
                    id="email"
                    type="email"
                    className="w-full pl-10 pr-4 py-3 sm:py-3.5 rounded-xl border border-white/10 bg-white/[0.05] focus:bg-white/[0.08] focus:border-[#E55A28] text-sm text-white placeholder-white/30 outline-none transition-all focus:ring-2 focus:ring-[#E55A28]/20"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-white/70 mb-1.5 block tracking-wider uppercase" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4 pointer-events-none" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="w-full pl-10 pr-11 py-3 sm:py-3.5 rounded-xl border border-white/10 bg-white/[0.05] focus:bg-white/[0.08] focus:border-[#E55A28] text-sm text-white placeholder-white/30 outline-none transition-all focus:ring-2 focus:ring-[#E55A28]/20"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-1 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs sm:text-sm font-sans text-white/70">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-white/20 bg-white/10 text-[#E55A28] focus:ring-[#E55A28] focus:ring-offset-0"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-xs sm:text-sm font-sans font-medium text-[#FF8C5A] hover:text-[#FFA07A] transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 sm:py-4 rounded-xl font-sans font-semibold text-sm sm:text-base text-white bg-gradient-to-r from-[#FF6B35] to-[#E55A28] hover:opacity-95 shadow-lg shadow-orange-500/25 active:scale-[0.99] transition-all mt-2 border border-white/15"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>

        {/* Mobile Footer Trust Badges */}
        <div className="lg:hidden pt-6 pb-2 text-center border-t border-white/10">
          <p className="font-serif italic text-xs text-white/60">
            &ldquo;Your mind is your greatest asset — let me help you unlock it.&rdquo;
          </p>
          <div className="flex items-center justify-center gap-3 mt-3 text-[10px] font-bold uppercase tracking-wider text-white/40">
            <span>15M+ Students</span>
            <span>•</span>
            <span>3× TEDx</span>
            <span>•</span>
            <span>90-Day Matrix</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
