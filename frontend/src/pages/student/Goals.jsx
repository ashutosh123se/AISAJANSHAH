import React, { useState, useEffect } from 'react';
import { Target, Edit2, Calendar, Clock, Check, Save, Plus, X, Zap, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ACTIONS_KEY = 'aisajan_actions_store';
const HABITS_KEY = 'aisajan_habits_store';
const GOAL_KEY = 'aisajan_goal_store';

const defaultActions = [
  { id: 1, text: 'Complete Chapter 4 & 5 of Physics', completed: false },
  { id: 2, text: 'Take 2 Full-length Mock Tests', completed: true },
  { id: 3, text: 'Review all incorrect mock test answers', completed: false }
];

const defaultHabits = [
  { id: 1, name: 'Meditation (10 mins)', checked: false, streak: 12 },
  { id: 2, name: 'Read Notes before sleep', checked: true, streak: 5 },
  { id: 3, name: 'Drink 3L Water', checked: false, streak: 21 }
];

const Goals = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  
  const [goal, setGoal] = useState(() => {
    try {
      const saved = localStorage.getItem(GOAL_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      title: userProfile?.onboardingData?.goal90Day || 'Score 95% in Final Board Exams',
      targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    };
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(goal.title);

  const [weeklyActions, setWeeklyActions] = useState(() => {
    try {
      const saved = localStorage.getItem(ACTIONS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return defaultActions;
  });
  const [isAddingAction, setIsAddingAction] = useState(false);
  const [newActionText, setNewActionText] = useState('');

  const [habits, setHabits] = useState(() => {
    try {
      const saved = localStorage.getItem(HABITS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return defaultHabits;
  });
  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [newHabitText, setNewHabitText] = useState('');

  useEffect(() => {
    if (userProfile?.onboardingData?.goal90Day && !localStorage.getItem(GOAL_KEY)) {
      setGoal(prev => ({ ...prev, title: userProfile.onboardingData.goal90Day }));
    }
  }, [userProfile]);

  const toggleAction = (id) => {
    setWeeklyActions(prev => {
      const next = prev.map(a => a.id === id ? { ...a, completed: !a.completed } : a);
      try { localStorage.setItem(ACTIONS_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const toggleHabit = (id) => {
    setHabits(prev => {
      const next = prev.map(h => h.id === id ? { ...h, checked: !h.checked, streak: h.checked ? Math.max(0, h.streak - 1) : h.streak + 1 } : h);
      try { localStorage.setItem(HABITS_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };
  
  const saveGoal = () => {
    setGoal(prev => {
      const next = { ...prev, title: tempTitle };
      try { localStorage.setItem(GOAL_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
    setIsEditing(false);
  };

  const addAction = () => {
    if (newActionText.trim()) {
      setWeeklyActions(prev => {
        const next = [...prev, { id: Date.now(), text: newActionText.trim(), completed: false }];
        try { localStorage.setItem(ACTIONS_KEY, JSON.stringify(next)); } catch {}
        return next;
      });
      setNewActionText('');
      setIsAddingAction(false);
    }
  };

  const addHabit = () => {
    if (newHabitText.trim()) {
      setHabits(prev => {
        const next = [...prev, { id: Date.now(), name: newHabitText.trim(), checked: false, streak: 0 }];
        try { localStorage.setItem(HABITS_KEY, JSON.stringify(next)); } catch {}
        return next;
      });
      setNewHabitText('');
      setIsAddingHabit(false);
    }
  };

  const targetDateObj = new Date(goal.targetDate || Date.now() + 90 * 24 * 60 * 60 * 1000);
  const daysRemaining = Math.max(0, Math.ceil((targetDateObj - new Date()) / (1000 * 60 * 60 * 24)));
  
  // Calculate dynamic progress
  const totalItems = weeklyActions.length + habits.length;
  const completedItems = weeklyActions.filter(a => a.completed).length + habits.filter(h => h.checked).length;
  const progressPercent = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);

  if (!goal.title && !isEditing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 mt-12 relative">
        <div className="w-24 h-24 border border-[var(--color-border)] rounded-full flex items-center justify-center mb-8 bg-white">
          <Target className="w-10 h-10 text-[var(--color-primary)]" />
        </div>
        <h3 className="text-3xl font-serif font-bold text-center text-[var(--color-primary)] relative z-10 mb-3">No Parameters Set</h3>
        <p className="text-[15px] font-sans text-center max-w-md text-[var(--color-text-secondary)] leading-relaxed relative z-10">
          Let's get crystal clear on your trajectory. Sajan will compute the optimal path to your target.
        </p>
        <button className="mt-10 btn-elegant px-8 flex items-center gap-2"
          onClick={() => setIsEditing(true)}>
          <Target className="w-5 h-5" /> Initialize Target
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto w-full px-4 lg:px-6 py-6 lg:py-10">

      {/* Main Goal Card */}
      <div className="bg-white border border-[var(--color-border)] p-8 mb-8">
        
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--color-bg)] border border-[var(--color-border)]">
              <Target className="w-4 h-4 text-[var(--color-text-secondary)]" />
              <span className="text-[12px] font-sans font-bold text-[var(--color-text-secondary)] uppercase tracking-[0.2em]">
                Primary Directive (90 Days)
              </span>
            </div>
            {!isEditing && (
              <button className="p-2.5 bg-white hover:bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-primary)] transition-colors"
                onClick={() => setIsEditing(true)}>
                <Edit2 className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {isEditing ? (
            <div className="flex items-center gap-3">
              <input 
                type="text" 
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveGoal()}
                className="w-full bg-white border border-[var(--color-border)] text-[var(--color-primary)] px-5 py-3 focus:outline-none focus:border-[var(--color-primary)] transition-colors font-sans"
                autoFocus
              />
              <button onClick={saveGoal} className="btn-elegant px-4 h-12">
                <Save className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[var(--color-primary)] leading-tight mb-2 tracking-tight">
              {goal.title}
            </h2>
          )}

          <div className="mt-8">
            <div className="flex justify-between items-end mb-3">
              <span className="text-[14px] font-sans font-medium text-[var(--color-text-secondary)]">Optimization Progress</span>
              <span className="text-[16px] font-sans font-bold text-[var(--color-primary)]">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-[var(--color-bg)] overflow-hidden border border-[var(--color-border)]">
              <div className="h-full bg-[var(--color-primary)] transition-all duration-1000 ease-out"
                style={{ width: `${Math.max(2, progressPercent)}%` }} />
            </div>
          </div>
          <div className="flex items-center gap-6 mt-6 text-[14px] font-sans font-medium">
            <div className="flex items-center gap-2 text-[var(--color-text-secondary)] bg-[var(--color-bg)] px-3 py-1.5 border border-[var(--color-border)]">
              <Calendar className="w-4 h-4" />
              Target: {targetDateObj.toLocaleDateString()}
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 border ${daysRemaining < 14 ? 'text-orange-600 bg-orange-50 border-orange-200' : 'text-[var(--color-text-secondary)] bg-[var(--color-bg)] border-[var(--color-border)]'}`}>
              <Clock className={`w-4 h-4 ${daysRemaining < 14 ? 'text-orange-600' : 'text-[var(--color-text-secondary)]'}`} />
              {daysRemaining} days remaining
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weekly Actions */}
        <div className="p-6 lg:p-8 flex flex-col bg-white border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border border-[var(--color-border)] rounded-full flex items-center justify-center bg-[var(--color-bg)]">
                <Target className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[var(--color-primary)]">Action Vectors</h3>
            </div>
            <button onClick={() => setIsAddingAction(true)}
              className="w-10 h-10 border border-[var(--color-border)] bg-white hover:bg-[var(--color-bg)] text-[var(--color-primary)] flex items-center justify-center transition-colors">
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2">
            <div className="flex flex-col gap-3">
              {weeklyActions.map((action) => (
                <div key={action.id}
                  className="flex items-start gap-4 p-4 border border-[var(--color-border)] bg-[var(--color-bg)] cursor-pointer hover:border-[var(--color-primary)] transition-colors"
                  onClick={() => toggleAction(action.id)}>
                  <div className={`w-5 h-5 rounded-[4px] mt-0.5 flex items-center justify-center shrink-0 border ${action.completed ? 'bg-[var(--color-primary)] border-[var(--color-primary)]' : 'bg-white border-[var(--color-border)]'}`}>
                    {action.completed && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                  </div>
                  <span className={`text-[15px] font-sans pt-px transition-colors ${action.completed ? 'text-[var(--color-text-hint)] line-through' : 'text-[var(--color-primary)]'}`}>
                    {action.text}
                  </span>
                </div>
              ))}
              {weeklyActions.length === 0 && !isAddingAction && (
                <div className="text-center py-8 px-4 border border-[var(--color-border)] bg-[var(--color-bg)] mt-2">
                  <Target className="w-6 h-6 text-[var(--color-text-hint)] mx-auto mb-3" />
                  <p className="text-[14px] font-sans text-[var(--color-text-secondary)]">
                    No active parameters. Define a new action to generate momentum.
                  </p>
                </div>
              )}
            </div>
            
            {isAddingAction && (
              <div className="mt-4 flex items-center gap-2 bg-[var(--color-bg)] p-2 border border-[var(--color-border)]">
                <input 
                  type="text" 
                  placeholder="Define new objective..."
                  value={newActionText}
                  onChange={(e) => setNewActionText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addAction()}
                  className="flex-1 bg-transparent border-none text-[var(--color-primary)] px-3 py-2 text-[14px] focus:outline-none placeholder-[var(--color-text-hint)] font-sans"
                  autoFocus
                />
                <button onClick={addAction} className="btn-elegant w-10 h-10 px-0 flex justify-center items-center">
                  <Check className="w-4 h-4" />
                </button>
                <button onClick={() => setIsAddingAction(false)} className="w-10 h-10 border border-[var(--color-border)] bg-white text-[var(--color-primary)] flex justify-center items-center">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Daily Habits */}
          <div className="p-6 lg:p-8 flex flex-col bg-white border border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border border-[var(--color-border)] rounded-full flex items-center justify-center bg-[var(--color-bg)]">
                  <Zap className="w-5 h-5 text-[var(--color-primary)]" />
                </div>
                <h3 className="text-lg font-serif font-bold text-[var(--color-primary)]">Neural Habits</h3>
              </div>
              <button onClick={() => setIsAddingHabit(true)}
                className="w-10 h-10 border border-[var(--color-border)] bg-white hover:bg-[var(--color-bg)] text-[var(--color-primary)] flex items-center justify-center transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col gap-3">
                {habits.map((habit) => (
                  <div key={habit.id} onClick={() => toggleHabit(habit.id)}
                    className="flex items-center justify-between p-4 border border-[var(--color-border)] bg-[var(--color-bg)] cursor-pointer hover:border-[var(--color-primary)] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${habit.checked ? 'bg-[var(--color-primary)] border-[var(--color-primary)]' : 'bg-white border-[var(--color-border)]'}`}>
                        {habit.checked && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                      </div>
                      <span className={`text-[15px] font-sans transition-colors ${habit.checked ? 'text-[var(--color-text-hint)] line-through' : 'text-[var(--color-primary)]'}`}>
                        {habit.name}
                      </span>
                    </div>
                    <span className={`text-[12px] font-sans font-bold px-2.5 py-1 border ${habit.checked ? 'text-white bg-[var(--color-primary)] border-[var(--color-primary)]' : 'text-[var(--color-text-secondary)] bg-white border-[var(--color-border)]'}`}>
                      {habit.streak}d
                    </span>
                  </div>
                ))}
                {habits.length === 0 && !isAddingHabit && (
                  <div className="text-center py-6 px-4 bg-[var(--color-bg)] border border-[var(--color-border)] mt-2">
                    <p className="text-[14px] font-sans text-[var(--color-text-secondary)]">No habit routines installed.</p>
                  </div>
                )}
              </div>
              
              {isAddingHabit && (
                <div className="mt-4 flex items-center gap-2 bg-[var(--color-bg)] p-2 border border-[var(--color-border)]">
                  <input 
                    type="text" 
                    placeholder="Initialize new habit..."
                    value={newHabitText}
                    onChange={(e) => setNewHabitText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addHabit()}
                    className="flex-1 bg-transparent border-none text-[var(--color-primary)] px-3 py-2 text-[14px] focus:outline-none placeholder-[var(--color-text-hint)] font-sans"
                    autoFocus
                  />
                  <button onClick={addHabit} className="btn-elegant w-10 h-10 px-0 flex justify-center items-center">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => setIsAddingHabit(false)} className="w-10 h-10 border border-[var(--color-border)] bg-white text-[var(--color-primary)] flex justify-center items-center">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* AI Check-in Card */}
          <div className="p-6 lg:p-8 bg-[var(--color-primary)] border border-[var(--color-primary)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <span className="text-[12px] font-sans font-bold text-white/80 uppercase tracking-widest">
                AI Telemetry Check
              </span>
            </div>
            <h3 className="text-[18px] font-serif font-semibold text-white leading-snug mb-6">
              How are your optimization parameters holding up this week, {userProfile?.name?.split(' ')[0] || 'champ'}?
            </h3>
            <div className="flex flex-wrap gap-3">
              {['Executing perfectly ⚡', 'Experiencing friction 🤔', 'Require recalibration 🆘', 'Surpassing targets 🎯'].map((btn) => (
                <button key={btn} onClick={() => navigate('/student/chat', { state: { initialMessage: btn, isGoalCheckin: true } })}
                  className="text-[13px] font-sans font-medium px-4 py-2.5 bg-white/10 hover:bg-white text-white hover:text-[var(--color-primary)] transition-colors border border-white/20 hover:border-white">
                  {btn}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Goals;
