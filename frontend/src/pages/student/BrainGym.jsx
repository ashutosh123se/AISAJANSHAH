import React, { useState, useEffect, useRef } from 'react';
import { Brain, Zap, Clock, Puzzle, Play, RefreshCw, Trophy, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { apiFetch } from '../../utils/api';
import { isDevAuthEnabled } from '../../devAuth';

const BrainGym = () => {
  const { userProfile, setUserProfile, isDevAuth } = useAuth();
  
  // Game States: 'menu', 'countdown', 'memorize', 'recall', 'success', 'gameover'
  const [gameState, setGameState] = useState('menu');
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [activeSquare, setActiveSquare] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const [scoreToSave, setScoreToSave] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const gridSize = 9; // 3x3 grid

  const startGame = () => {
    setLevel(1);
    setScoreToSave(0);
    startLevel(1);
  };

  const startLevel = (currentLevel) => {
    setGameState('countdown');
    setCountdown(3);
    setSequence([]);
    setPlayerSequence([]);
    setActiveSquare(null);
  };

  // Handle countdown
  useEffect(() => {
    if (gameState === 'countdown') {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        generateSequence();
      }
    }
  }, [gameState, countdown]);

  const generateSequence = () => {
    const seqLength = level + 2; // Level 1 = 3 items, Level 2 = 4 items, etc.
    const newSequence = [];
    for (let i = 0; i < seqLength; i++) {
      newSequence.push(Math.floor(Math.random() * gridSize));
    }
    setSequence(newSequence);
    setGameState('memorize');
  };

  // Play sequence automatically
  useEffect(() => {
    if (gameState === 'memorize' && sequence.length > 0) {
      let step = 0;
      
      const playStep = () => {
        if (step >= sequence.length) {
          setActiveSquare(null);
          setGameState('recall');
          return;
        }
        
        setActiveSquare(sequence[step]);
        
        setTimeout(() => {
          setActiveSquare(null); // brief pause between squares
          step++;
          setTimeout(playStep, 200);
        }, 600); // 600ms flash duration
      };

      const initialDelay = setTimeout(playStep, 500);
      return () => clearTimeout(initialDelay);
    }
  }, [gameState, sequence]);

  const handleSquareClick = (index) => {
    if (gameState !== 'recall') return;

    // Flash square briefly
    setActiveSquare(index);
    setTimeout(() => setActiveSquare(null), 200);

    const newPlayerSequence = [...playerSequence, index];
    setPlayerSequence(newPlayerSequence);

    // Check correctness of current step
    const currentStep = newPlayerSequence.length - 1;
    if (newPlayerSequence[currentStep] !== sequence[currentStep]) {
      // Wrong move -> Game Over
      endGame(false);
      return;
    }

    // Check if sequence is fully completed
    if (newPlayerSequence.length === sequence.length) {
      endGame(true);
    }
  };

  const endGame = async (success) => {
    if (success) {
      setGameState('success');
      setTimeout(() => {
        setLevel(prev => prev + 1);
        startLevel(level + 1);
      }, 1500);
    } else {
      setGameState('gameover');
      const xpEarned = (level - 1) * 20; // 20 XP per completed level
      setScoreToSave(xpEarned);
      
      if (xpEarned > 0) {
        saveScore(xpEarned);
      }
    }
  };

  const saveScore = async (xp) => {
    setIsSaving(true);
    try {
      // Dig mode: update XP locally
      if (isDevAuth || isDevAuthEnabled) {
        setUserProfile((prev) => {
          const nextXp = (prev?.xp || 0) + xp;
          const nextLevel = Math.floor(nextXp / 100) + 1;
          return { ...prev, xp: nextXp, level: nextLevel };
        });
        return;
      }

      const response = await apiFetch('/api/braingym/score', {
        method: 'POST',
        body: JSON.stringify({ xpGained: xp }),
      });

      if (response.ok) {
        const data = await response.json();
        setUserProfile((prev) => ({ ...prev, xp: data.xp, level: data.level }));
      }
    } catch (error) {
      console.error('Error saving score:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (gameState !== 'menu') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] px-4 py-8">
        <div className="w-full max-w-lg mx-auto">
          <button onClick={() => setGameState('menu')} className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] mb-8 transition-colors font-sans font-medium px-4 py-2 hover:bg-[var(--color-bg)] border border-transparent hover:border-[var(--color-border)]">
            <ArrowLeft className="w-5 h-5" /> Abort Sequence
          </button>
          
          <div className="p-8 lg:p-10 text-center bg-white border border-[var(--color-border)]">
            
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
                <span className="text-[15px] font-sans font-bold text-[var(--color-primary)] tracking-wide uppercase">Level {level}</span>
              </div>
              <span className="text-[12px] font-sans font-bold tracking-widest px-4 py-1.5 bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                MEMORY PALACE
              </span>
            </div>

            {gameState === 'countdown' && (
              <div className="h-[320px] flex flex-col items-center justify-center animate-in zoom-in duration-300">
                <h3 className="text-[20px] font-sans font-bold text-[var(--color-text-secondary)] mb-6 uppercase tracking-widest">Initializing</h3>
                <span className="text-[80px] font-serif font-bold text-[var(--color-primary)]">{countdown}</span>
              </div>
            )}

            {(gameState === 'memorize' || gameState === 'recall' || gameState === 'success') && (
              <div className="flex flex-col items-center">
                <h3 className={`text-[18px] font-serif font-bold mb-8 min-h-[28px] tracking-wide transition-colors duration-300 ${gameState === 'memorize' ? 'text-[var(--color-primary)]' : (gameState === 'success' ? 'text-green-600' : 'text-[var(--color-primary)]')}`}>
                  {gameState === 'memorize' ? 'Scanning Pattern...' : (gameState === 'success' ? 'Sequence Verified!' : 'Input Required.')}
                </h3>
                
                <div className="grid grid-cols-3 gap-4 w-[280px] h-[280px] mx-auto p-4 bg-[var(--color-bg)] border border-[var(--color-border)]">
                  {Array.from({ length: gridSize }).map((_, idx) => (
                    <div 
                      key={idx}
                      onClick={() => handleSquareClick(idx)}
                      className={`transition-all duration-300 border border-[var(--color-border)] ${gameState === 'recall' ? 'cursor-pointer hover:scale-105 active:scale-95' : ''}`}
                      style={{ 
                        background: activeSquare === idx 
                          ? (gameState === 'memorize' ? 'var(--color-primary)' : '#fff') 
                          : '#fff',
                        boxShadow: activeSquare === idx ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
                        transform: activeSquare === idx ? 'scale(1.05)' : 'scale(1)'
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {gameState === 'gameover' && (
              <div className="h-[320px] flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-red-50 border border-red-200 flex items-center justify-center mb-6">
                  <RefreshCw className="w-10 h-10 text-red-600" />
                </div>
                <h3 className="text-[28px] font-serif font-bold text-[var(--color-primary)] mb-2">System Failure</h3>
                <p className="text-[15px] font-sans text-[var(--color-text-secondary)] mb-8">Maximum level reached: {level}</p>
                
                <div className="bg-[var(--color-bg)] border border-[var(--color-border)] px-8 py-4 mb-8 flex items-center gap-4">
                  <Zap className="w-6 h-6 text-yellow-500 fill-yellow-500/20" />
                  <span className="text-[20px] font-sans font-bold text-[var(--color-primary)]">+{scoreToSave} XP</span>
                </div>

                <div className="flex gap-4 w-full max-w-[320px]">
                  <button onClick={() => setGameState('menu')} className="flex-1 py-3.5 font-sans font-bold bg-white text-[var(--color-primary)] border border-[var(--color-border)] hover:bg-[var(--color-bg)] transition-colors">
                    Exit
                  </button>
                  <button onClick={startGame} className="btn-elegant flex-1 py-3.5 flex items-center justify-center">
                    Reboot
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Initial Menu State
  return (
    <div className="max-w-[1000px] mx-auto w-full px-4 lg:px-6 py-6 lg:py-10">
      <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-10">
        <div>
          <h2 className="text-4xl font-serif font-bold text-[var(--color-primary)] flex items-center gap-3 tracking-tight mb-2">
            <div className="w-12 h-12 border border-[var(--color-border)] flex items-center justify-center bg-[var(--color-bg)]">
              <Brain className="w-6 h-6 text-[var(--color-primary)]" />
            </div>
            Brain Gym
          </h2>
          <p className="text-[15px] font-sans text-[var(--color-text-secondary)] max-w-2xl">
            Train your cognitive neural pathways. Execute mini-games engineered from modern neuroscience techniques.
          </p>
        </div>
        
        <div className="p-5 flex items-center gap-5 shrink-0 bg-white border border-[var(--color-border)]">
          <div>
            <p className="text-[11px] font-sans font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">
              Total Intelligence
            </p>
            <p className="text-3xl font-serif font-bold text-[var(--color-primary)] mt-1">
              {userProfile?.xp || 0} <span className="text-lg text-[var(--color-text-secondary)] font-sans font-medium">XP</span>
            </p>
          </div>
          <div className="w-14 h-14 border border-[var(--color-border)] flex items-center justify-center bg-[var(--color-bg)]">
            <span className="text-[14px] font-bold font-sans text-[var(--color-primary)]">Lvl {userProfile?.level || 1}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Dynamic Game Card */}
        <div className="p-6 flex flex-col h-full transition-all duration-300 cursor-pointer bg-white border border-[var(--color-border)] hover:border-[var(--color-primary)]"
          onClick={startGame}>
          
          <div className="flex flex-col h-full">
            <div className="w-12 h-12 flex items-center justify-center mb-5 border border-[var(--color-border)] bg-[var(--color-bg)]">
              <Puzzle className="w-6 h-6 text-[var(--color-primary)]" />
            </div>
            
            <h3 className="text-xl font-serif font-bold text-[var(--color-primary)]">Memory Palace</h3>
            <p className="text-[14px] font-sans mt-3 flex-1 text-[var(--color-text-secondary)] leading-relaxed">
              Memorize the flashing sequence. The pattern complexity increases exponentially.
            </p>
            
            <div className="flex items-center gap-3 mt-6 pt-5 border-t border-[var(--color-border)]">
              <span className="text-[11px] font-sans font-bold tracking-widest uppercase px-3 py-1.5 bg-[var(--color-bg)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                +XP Protocol
              </span>
            </div>
            
            <button className="btn-elegant w-full mt-5 h-12 flex items-center justify-center gap-2">
              <Play className="w-4 h-4" /> Execute Sequence
            </button>
          </div>
        </div>

        {/* Future Games */}
        {[
          { title: 'Cognitive Overdrive', icon: Zap, requiredLevel: 3, requiredXp: 200 },
          { title: 'Focus Sprinter', icon: Clock, requiredLevel: 5, requiredXp: 400 }
        ].map((game, idx) => {
          const currentLevel = userProfile?.level || 1;
          const isUnlocked = currentLevel >= game.requiredLevel;
          
          return (
            <div key={idx} className={`p-6 flex flex-col h-full bg-[var(--color-bg)] border border-[var(--color-border)] ${isUnlocked ? 'opacity-100 hover:border-[var(--color-primary)]' : 'opacity-60 grayscale-[50%]'}`}>
              <div className={`w-12 h-12 flex items-center justify-center mb-5 bg-white border border-[var(--color-border)]`}>
                <game.icon className="w-6 h-6 text-[var(--color-primary)]" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[var(--color-primary)]">{game.title}</h3>
              <p className="text-[14px] font-sans mt-3 flex-1 text-[var(--color-text-secondary)] leading-relaxed">
                {isUnlocked 
                  ? 'Protocol authorized. Module synthesis in progress.'
                  : `Clearance required: Level ${game.requiredLevel} (${game.requiredXp} XP total) to unlock.`}
              </p>
              <button className={`w-full mt-6 h-12 text-[14px] font-sans font-bold flex items-center justify-center cursor-not-allowed ${isUnlocked ? 'bg-white border border-[var(--color-border)] text-[var(--color-primary)] hover:bg-[var(--color-bg)]' : 'bg-[var(--color-bg)] text-[var(--color-text-hint)] border border-[var(--color-border)]'}`}>
                {isUnlocked ? 'Module compiling...' : `Locked: Lvl ${game.requiredLevel} required`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BrainGym;
