import React, { useState, useEffect } from 'react';
import { Sparkles, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const LoadingScreen = ({ error }) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = [
    "Loading your personal mentor...",
    "Preparing your journey...",
    "Almost ready, beta!",
    "Setting things up for you..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] relative flex flex-col items-center justify-center overflow-hidden">
      <div className="z-10 flex flex-col items-center max-w-sm w-full px-6 text-center">
        {error ? (
          <div className="flex flex-col items-center gap-4 bg-white border border-[var(--color-border)] p-8">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-[15px] font-serif font-bold text-[var(--color-primary)] mb-1">System Timeout</p>
              <p className="text-[13px] text-[var(--color-text-secondary)] font-sans">{error}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="btn-elegant w-full mt-4 justify-center"
            >
              Reboot Sequence
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-8 bg-white border border-[var(--color-border)] p-12">
            
            <div className="relative w-16 h-16 border border-[var(--color-border)] bg-[var(--color-bg)] flex items-center justify-center z-10">
              <img src="/favicon.png" alt="Sajan Shah Logo" className="w-10 h-10 object-contain" />
              {/* Optional: Simple pulse border effect */}
              <motion.div
                animate={{ scale: [1, 1.2], opacity: [0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-[-1px] border border-[var(--color-primary)]"
              />
            </div>

            <div className="relative overflow-hidden">
              <h2 className="text-[24px] font-serif font-bold flex gap-2 tracking-tight uppercase">
                <span className="text-[var(--color-primary)]">AI Sajan Shah</span>
              </h2>
            </div>

            <motion.p 
              key={messageIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-[13px] font-sans font-medium text-[var(--color-text-secondary)] h-5"
            >
              {messages[messageIndex]}
            </motion.p>

            <div className="flex gap-2 mt-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  className="w-1.5 h-1.5 bg-[var(--color-primary)]"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;
