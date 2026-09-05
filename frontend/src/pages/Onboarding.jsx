import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, updateDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase';
import { isDevAuthEnabled } from '../devAuth';
import { apiFetch } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import { ChevronLeft, Check } from 'lucide-react';
import Button from '../components/ui/Button';

const Onboarding = () => {
  const { userProfile, setUserProfile } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const totalSteps = 6;
  
  // Form State
  const [name, setName] = useState(userProfile?.name || '');
  const [ageGroup, setAgeGroup] = useState('');
  const [situation, setSituation] = useState('');
  const [challenges, setChallenges] = useState([]);
  const [customChallenge, setCustomChallenge] = useState('');
  const [goal90Day, setGoal90Day] = useState('');
  const [language, setLanguage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleFinish = async () => {
    if (!userProfile?.uid) return;
    
    try {
      setIsSubmitting(true);
      setSubmitError('');
      const allChallenges = [...challenges];
      if (customChallenge.trim()) {
        allChallenges.push(customChallenge.trim());
      }
      
      const updateData = {
        name,
        onboardingComplete: true,
        onboardingCompleted: true,
        onboardingData: {
          ageGroup,
          situation,
          challenges: allChallenges,
          goal90Day,
          language
        }
      };

      const useLocal = isDevAuthEnabled && !isFirebaseConfigured;

      if (useLocal) {
        const response = await apiFetch('/api/student/onboarding', {
          method: 'POST',
          body: JSON.stringify({
            name: updateData.name,
            onboardingData: updateData.onboardingData,
          }),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(data.error || data.details || 'Failed to save onboarding');
        }
        const nextProfile = { ...userProfile, ...updateData, ...(data.user || {}) };
        setUserProfile(nextProfile);
        localStorage.setItem('aisajan_local_session', JSON.stringify(nextProfile));
      } else {
        if (!db) {
          throw new Error('Firebase is not configured. Cannot save onboarding.');
        }
        const userRef = doc(db, 'users', userProfile.uid);
        await updateDoc(userRef, updateData);
        setUserProfile({ ...userProfile, ...updateData });
      }
      
      navigate('/student');
    } catch (err) {
      console.error("Error saving onboarding data:", err);
      setSubmitError(err.message || 'Could not finish onboarding. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleChallenge = (val) => {
    setChallenges(prev => 
      prev.includes(val) ? prev.filter(c => c !== val) : [...prev, val]
    );
  };

  // --- Step Renders ---
  
  const renderStep1 = () => (
    <div className="flex flex-col items-center">
      <h2 className="text-[28px] font-serif font-bold text-[var(--color-primary)] text-center tracking-tight">
        Arre yaar, welcome! 🎉
      </h2>
      <p className="text-[15px] font-sans text-[var(--color-text-secondary)] text-center mt-3 mb-8">
        I'm Sajan Shah. Before we begin, tell me a little about yourself.
      </p>
      <input
        type="text"
        className="w-full h-12 bg-[var(--color-bg)] border border-[var(--color-border)] px-4 text-[15px] text-[var(--color-primary)] focus:border-[var(--color-primary)] focus:bg-white outline-none transition-all font-sans"
        placeholder="Your full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button 
        className="btn-elegant w-full mt-8 justify-center h-12" 
        onClick={nextStep}
        disabled={name.length < 2}
      >
        Let's Go! →
      </button>
    </div>
  );

  const renderStep2 = () => {
    const options = ["Under 15", "15 — 18", "18 — 25", "25 and above"];
    return (
      <div className="flex flex-col">
        <h2 className="text-[26px] font-serif font-bold text-[var(--color-primary)] text-center tracking-tight">
          How old are you?
        </h2>
        <div className="grid grid-cols-2 gap-4 mt-8">
          {options.map(opt => (
            <div 
              key={opt}
              onClick={() => { setAgeGroup(opt); setTimeout(nextStep, 300); }}
              className={`relative px-5 py-4 border cursor-pointer text-center text-[15px] font-sans font-bold transition-all duration-200
                ${ageGroup === opt 
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white' 
                  : 'border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                }`}
            >
              {opt}
              {ageGroup === opt && (
                <div className="absolute top-2 right-2">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderStep3 = () => {
    const options = [
      { id: "School Student", icon: "🎒" },
      { id: "College Student", icon: "🎓" },
      { id: "Working Professional", icon: "💼" },
      { id: "Entrepreneur", icon: "🚀" },
      { id: "Parent", icon: "👨‍👩‍👧" },
    ];
    return (
      <div className="flex flex-col">
        <h2 className="text-[26px] font-serif font-bold text-[var(--color-primary)] text-center tracking-tight">
          What best describes you?
        </h2>
        <div className="flex flex-col gap-3 mt-8">
          {options.map(opt => (
            <div 
              key={opt.id}
              onClick={() => { setSituation(opt.id); setTimeout(nextStep, 300); }}
              className={`flex items-center gap-4 px-[18px] py-[14px] border cursor-pointer transition-all duration-200
                ${situation === opt.id 
                  ? 'border-[var(--color-primary)] bg-[var(--color-bg)] text-[var(--color-primary)]' 
                  : 'border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                }`}
            >
              <span className="text-[20px]">{opt.icon}</span>
              <span className="text-[15px] font-sans font-bold">{opt.id}</span>
              {situation === opt.id && (
                <Check className="w-5 h-5 ml-auto text-[var(--color-primary)]" />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderStep4 = () => {
    const options = [
      "Focus & Concentration", "Exam Stress", "Career Confusion", 
      "Low Confidence", "Phone Addiction", "Parental Pressure", 
      "Time Management", "Self Doubt", "Memory Issues", "Motivation"
    ];
    return (
      <div className="flex flex-col">
        <h2 className="text-[26px] font-serif font-bold text-[var(--color-primary)] text-center tracking-tight">
          What's your biggest struggle right now?
        </h2>
        <p className="text-[13px] font-sans font-bold uppercase tracking-widest text-[var(--color-text-hint)] text-center mt-3">Select all that apply</p>
        
        <div className="flex flex-wrap gap-3 mt-8 justify-center">
          {options.map(opt => {
            const isSelected = challenges.includes(opt);
            return (
              <div 
                key={opt}
                onClick={() => toggleChallenge(opt)}
                className={`px-4 py-2 border cursor-pointer text-[14px] transition-all duration-200 font-sans font-medium
                  ${isSelected 
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white' 
                    : 'border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                  }`}
              >
                {opt}
              </div>
            );
          })}
        </div>
        
        <input
          type="text"
          className="w-full h-12 bg-[var(--color-bg)] border border-[var(--color-border)] px-4 mt-6 text-[14px] text-[var(--color-primary)] focus:border-[var(--color-primary)] focus:bg-white outline-none font-sans transition-all"
          placeholder="Anything else? Tell me..."
          value={customChallenge}
          onChange={(e) => setCustomChallenge(e.target.value)}
        />
        
        <button 
          className="btn-elegant w-full mt-8 justify-center h-12" 
          onClick={nextStep}
          disabled={challenges.length === 0 && !customChallenge.trim()}
        >
          Continue
        </button>
      </div>
    );
  };

  const renderStep5 = () => (
    <div className="flex flex-col">
      <h2 className="text-[26px] font-serif font-bold text-[var(--color-primary)] text-center tracking-tight">
        What do you want to achieve in 90 days?
      </h2>
      <p className="text-[15px] text-[var(--color-text-secondary)] italic text-center mt-3 font-serif">
        "Be specific, yaar. Vague goals = vague results. — Sajan Shah"
      </p>
      
      <div className="mt-8 relative">
        <textarea
          className="w-full min-h-[140px] resize-none bg-[var(--color-bg)] border border-[var(--color-border)] p-4 text-[15px] text-[var(--color-primary)] focus:border-[var(--color-primary)] focus:bg-white outline-none font-sans transition-all"
          placeholder="I want to..."
          maxLength={500}
          value={goal90Day}
          onChange={(e) => setGoal90Day(e.target.value)}
        />
        <div className="absolute bottom-3 right-3 text-[12px] font-sans font-bold text-[var(--color-text-hint)] bg-transparent px-1">
          {goal90Day.length} / 500
        </div>
      </div>
      
      <p className="text-[13px] text-[var(--color-text-secondary)] mt-4 leading-relaxed font-sans bg-white border border-[var(--color-border)] p-4">
        <strong className="text-[var(--color-primary)]">Example:</strong> I want to score 90% in my board exams by improving focus and studying 3 hours daily with zero phone distractions.
      </p>
      
      <button 
        className="btn-elegant w-full mt-8 justify-center h-12" 
        onClick={nextStep}
        disabled={goal90Day.trim().length < 10}
      >
        Almost Done
      </button>
    </div>
  );

  const renderStep6 = () => {
    const options = [
      { id: 'hinglish', label: 'Hinglish', flag: '🇮🇳', rec: true, sub: 'Hindi + English mixed' },
      { id: 'english', label: 'English Only', flag: '🇬🇧' },
      { id: 'hindi', label: 'Hindi Only', flag: '🇮🇳' },
      { id: 'gujarati', label: 'Gujarati', flag: '🇮🇳' },
    ];
    return (
      <div className="flex flex-col">
        <h2 className="text-[26px] font-serif font-bold text-[var(--color-primary)] text-center tracking-tight">
          How should I talk to you?
        </h2>
        
        <div className="grid grid-cols-2 gap-4 mt-8">
          {options.map(opt => (
            <div 
              key={opt.id}
              onClick={() => setLanguage(opt.id)}
              className={`relative p-5 border cursor-pointer flex flex-col items-center justify-center gap-2 transition-all duration-200
                ${language === opt.id 
                  ? 'border-[var(--color-primary)] bg-[var(--color-bg)]' 
                  : 'border-[var(--color-border)] bg-white hover:border-[var(--color-primary)]'
                }`}
            >
              {opt.rec && (
                <span className="absolute -top-3 right-2 bg-[var(--color-primary)] text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-widest border border-white">
                  Recommended
                </span>
              )}
              <span className="text-[28px]">{opt.flag}</span>
              <span className={`text-[15px] font-sans font-bold text-center ${language === opt.id ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]'}`}>
                {opt.label}
              </span>
              {opt.sub && (
                <span className="text-[11px] font-sans font-medium text-[var(--color-text-hint)] text-center mt-1">
                  {opt.sub}
                </span>
              )}
            </div>
          ))}
        </div>
        
        <button 
          className="btn-elegant w-full mt-8 justify-center h-14" 
          onClick={handleFinish}
          disabled={!language || isSubmitting}
        >
          {isSubmitting ? 'Initializing Matrix...' : 'Start My Journey'}
        </button>
        {submitError && (
          <p className="mt-4 text-sm font-sans text-red-600 text-center bg-red-50 border border-red-100 rounded-lg px-4 py-3">
            {submitError}
          </p>
        )}
      </div>
    );
  };

  const stepRenders = {
    1: renderStep1,
    2: renderStep2,
    3: renderStep3,
    4: renderStep4,
    5: renderStep5,
    6: renderStep6,
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-[var(--color-bg)] z-50">
        <div 
          className="h-full bg-[var(--color-primary)] transition-all duration-400 ease-out"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>

      <div className="max-w-[520px] mx-auto min-h-screen flex flex-col pt-12 pb-8 px-6 lg:px-12 relative">
        {step > 1 && (
          <button 
            onClick={prevStep}
            className="absolute top-12 left-6 lg:left-12 flex items-center gap-1 text-[13px] font-sans font-bold uppercase tracking-widest text-[var(--color-text-hint)] hover:text-[var(--color-primary)] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        )}
        
        <div className="text-center mb-10 mt-14">
          <span className="text-[11px] font-sans font-bold text-[var(--color-text-hint)] uppercase tracking-widest border border-[var(--color-border)] px-4 py-1.5 bg-[var(--color-bg)]">
            Step {step} of {totalSteps}
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {stepRenders[step]()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
