import React, { useState } from 'react';
import { AlertCircle, ChevronRight, BookOpen, Focus, Shield, HeartHandshake, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';

const MentalHealth = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const navigate = useNavigate();

  const moods = [
    { id: 'great',   emoji: '😄', label: 'Great',   borderColor: 'border-emerald-500/50', bgColor: 'bg-emerald-500/10', color: 'text-emerald-400', shadow: 'shadow-[0_0_20px_rgba(16,185,129,0.2)]',  msg: "That's fantastic! Keep this positive energy flowing. Remember what made you feel good today." },
    { id: 'good',    emoji: '🙂', label: 'Good',    borderColor: 'border-blue-500/50', bgColor: 'bg-blue-500/10', color: 'text-blue-400', shadow: 'shadow-[0_0_20px_rgba(59,130,246,0.2)]',  msg: "Glad you're doing well. Steady progress is the key to lasting success." },
    { id: 'okay',    emoji: '😐', label: 'Okay',    borderColor: 'border-slate-500/50', bgColor: 'bg-slate-500/10', color: 'text-slate-400', shadow: 'shadow-[0_0_20px_rgba(100,116,139,0.2)]', msg: "It's normal to have neutral days. Sajan is here if you want to chat and boost your mood." },
    { id: 'low',     emoji: '😔', label: 'Low',     borderColor: 'border-purple-500/50', bgColor: 'bg-purple-500/10', color: 'text-purple-400', shadow: 'shadow-[0_0_20px_rgba(168,85,247,0.2)]',  msg: "I hear you. It's completely okay to feel low sometimes. Take a deep breath." },
    { id: 'anxious', emoji: '😰', label: 'Anxious', borderColor: 'border-orange-500/50', bgColor: 'bg-orange-500/10', color: 'text-orange-400', shadow: 'shadow-[0_0_20px_rgba(249,115,22,0.2)]',  msg: "Anxiety is tough, but you are tougher. Let's take it one step at a time." },
  ];

  const modules = [
    { id: 1, title: 'Exam Stress',       desc: 'Manage anxiety before exams',     icon: BookOpen,      gradient: 'from-blue-500 to-blue-700', hoverColor: 'text-blue-400', hoverBorder: 'hover:border-blue-500/50', prompt: 'Hi Sajan! I am experiencing exam stress and anxiety before my exams. Can you help me manage this and give me practical strategies to stay calm and perform at my best?' },
    { id: 2, title: 'Focus Issues',      desc: 'Beat distractions scientifically', icon: Focus,         gradient: 'from-emerald-500 to-emerald-700', hoverColor: 'text-emerald-400', hoverBorder: 'hover:border-emerald-500/50', prompt: 'Hi Sajan! I am facing focus issues and get easily distracted while studying. Can you guide me with scientific techniques to improve my concentration and study effectively?' },
    { id: 3, title: 'Low Confidence',    desc: 'Build unshakeable self-belief',    icon: Shield,        gradient: 'from-orange-500 to-orange-700', hoverColor: 'text-orange-400', hoverBorder: 'hover:border-orange-500/50', prompt: 'Hi Sajan! I am dealing with low confidence and self-doubt lately. How can I build unshakeable self-belief and regain my confidence?' },
    { id: 4, title: 'Parental Pressure', desc: 'Handle expectations with ease',    icon: HeartHandshake, gradient: 'from-purple-500 to-purple-700', hoverColor: 'text-purple-400', hoverBorder: 'hover:border-purple-500/50', prompt: 'Hi Sajan! I am feeling a lot of parental pressure and high expectations. Can you give me guidance on how to handle these expectations with ease and peace of mind?' },
  ];

  return (
    <div className="max-w-[1000px] mx-auto w-full px-4 lg:px-6 py-6 lg:py-10">

      {/* Banner */}
      <div className="p-8 lg:p-10 mb-8 border border-[var(--color-border)] bg-white">
        <div>
          <h2 className="text-4xl font-serif font-bold text-[var(--color-primary)] tracking-tight mb-2">Mind Care</h2>
          <p className="text-[16px] font-sans mt-3 max-w-2xl text-[var(--color-text-secondary)] leading-relaxed">
            A safe space for your mental wellness. Taking care of your mind is the first step to unlocking your ultimate potential.
          </p>
          <div className="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-[var(--color-bg)] border border-[var(--color-border)]">
            <Shield className="w-4 h-4 text-[var(--color-text-secondary)]" />
            <p className="text-[12px] font-sans text-[var(--color-text-secondary)]">
              Provides emotional support and AI mentorship, not professional medical advice.
            </p>
          </div>
        </div>
      </div>

      {/* Mood Check-in */}
      <div className="p-8 lg:p-10 text-center mb-8 bg-white border border-[var(--color-border)]">
        <h3 className="text-xl font-serif font-bold text-[var(--color-primary)]">Telemetry Check: <span className="text-[var(--color-text-secondary)] font-medium">How are you feeling today?</span></h3>
        <div className="flex justify-center gap-4 lg:gap-6 mt-8 flex-wrap">
          {moods.map((mood) => (
            <div key={mood.id} onClick={() => setSelectedMood(mood)}
              className={`flex flex-col items-center justify-center gap-3 p-4 cursor-pointer transition-all duration-300 w-[90px] h-[100px] border ${selectedMood?.id === mood.id ? `border-[var(--color-primary)] bg-[var(--color-bg)]` : 'border-[var(--color-border)] bg-white hover:bg-[var(--color-bg)]'}`}>
              <span className="text-3xl">{mood.emoji}</span>
              <span className={`text-[13px] font-sans font-bold tracking-wide ${selectedMood?.id === mood.id ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]'}`}>
                {mood.label}
              </span>
            </div>
          ))}
        </div>
        {selectedMood && (
          <div className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className={`inline-block px-6 py-4 bg-[var(--color-bg)] border border-[var(--color-border)] mb-6`}>
              <p className={`text-[15px] font-sans font-medium text-[var(--color-primary)] max-w-lg mx-auto leading-relaxed`}>{selectedMood.msg}</p>
            </div>
            {['low', 'anxious', 'okay'].includes(selectedMood.id) && (
              <div className="flex flex-wrap justify-center gap-4">
                <button onClick={() => navigate('/student/chat', { state: { initialMessage: `Hi Sajan! I am feeling ${selectedMood.label.toLowerCase()} today. ${selectedMood.msg}` } })}
                  className="btn-elegant px-8 py-3.5">
                  Initialize Sajan AI
                </button>
                {['low', 'anxious'].includes(selectedMood.id) && (
                  <>
                    <button className="px-8 py-3.5 font-sans font-bold text-[var(--color-primary)] border border-[var(--color-primary)] bg-white hover:bg-[var(--color-bg)] transition-all duration-300">
                      Breathe Protocol
                    </button>
                    <button className="px-8 py-3.5 font-sans font-bold text-[var(--color-text-secondary)] border border-[var(--color-border)] bg-white hover:bg-[var(--color-bg)] transition-all duration-300">
                      Log to Journal
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Support Modules */}
      <div className="mb-8">
        <h3 className="text-xl font-serif font-bold text-[var(--color-primary)] mb-6 flex items-center gap-2">
          Targeted Support <Zap className="w-5 h-5 text-[var(--color-primary)]" />
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
          {modules.map((mod) => (
            <div key={mod.id} onClick={() => navigate('/student/chat', { state: { initialMessage: mod.prompt } })}
              className={`p-6 lg:p-8 cursor-pointer transition-all duration-300 relative group bg-white border border-[var(--color-border)] hover:border-[var(--color-primary)]`}>
              <div className={`w-12 h-12 flex items-center justify-center mb-5 border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-primary)]`}>
                <mod.icon className="w-6 h-6" />
              </div>
              <h4 className="text-[18px] font-serif font-bold text-[var(--color-primary)] transition-colors">{mod.title}</h4>
              <p className="text-[14px] font-sans mt-2 text-[var(--color-text-secondary)]">{mod.desc}</p>
              <div className="absolute top-8 right-8 transition-colors">
                <ChevronRight className={`w-5 h-5 text-[var(--color-text-secondary)] transition-all duration-300 transform group-hover:translate-x-1 group-hover:text-[var(--color-primary)]`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Crisis Resources (Commented out)
      <div className="p-6 lg:p-8 flex items-start gap-5 border border-red-200 bg-red-50">
        <div className="w-12 h-12 bg-white border border-red-200 flex items-center justify-center shrink-0">
          <AlertCircle className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h3 className="text-[18px] font-serif font-bold text-red-700 mb-4">Critical System Override: Need immediate support?</h3>
          <div className="flex flex-col gap-3">
            <p className="text-[15px] font-sans font-bold text-red-900 flex items-center gap-2">
              iCall India: <a href="tel:9152987821" className="text-red-600 hover:text-red-500 transition-colors">9152987821</a>
            </p>
            <p className="text-[15px] font-sans font-bold text-red-900 flex items-center gap-2">
              Vandrevala Foundation: <a href="tel:18602662345" className="text-red-600 hover:text-red-500 transition-colors">1860-2662-345</a>
            </p>
          </div>
          <p className="text-[14px] font-sans mt-4 text-red-700">You are not alone. Professional diagnostic help is available immediately.</p>
        </div>
      </div>
      */}
    </div>
  );
};

export default MentalHealth;
