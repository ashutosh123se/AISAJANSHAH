import React, { useState } from 'react';
import { Copy, BookOpen, CheckCircle2, Sparkles, Brain, Zap, RefreshCw, ArrowRight, Wand2, Quote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import { isDevAuthEnabled } from '../../devAuth';
import { generateDevMemoryStory } from '../../utils/devMemoryStory';

const ParagraphTool = () => {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [devDemo, setDevDemo] = useState(false);

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    setResult(null);
    setError(null);
    setDevDemo(false);

    try {
      const response = await apiFetch('/api/memory-story', {
        method: 'POST',
        body: JSON.stringify({ text: text.trim() }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate story');
      setResult(data);
    } catch (err) {
      console.error('Memory story error:', err);

      if (isDevAuthEnabled) {
        setResult(generateDevMemoryStory(text));
        setDevDemo(true);
        setError(null);
      } else {
        setError(
          err.message === 'Not authenticated. Please log in again.'
            ? 'Session expired. Please log out and sign in again.'
            : 'Could not reach the AI server. Make sure the backend is running with OPENAI_API_KEY set.'
        );
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const textToCopy = `🧠 MEMORY STORY: ${result.title}\n\n${result.story}\n\n🔑 CONCEPT MAP:\n${result.conceptMap.map(c => `• ${c.storyElement} → ${c.realConcept}`).join('\n')}\n\n⚡ MEMORY HOOK:\n${result.memoryHook}\n\n📖 QUICK REVISION:\n${result.quickRevision}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="max-w-[900px] mx-auto w-full px-4 lg:px-6 py-6 lg:py-10">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 flex items-center justify-center border border-[var(--color-border)] rounded-full bg-white">
            <Brain className="w-6 h-6 text-[var(--color-primary)]" />
          </div>
          <div>
            <h2 className="text-3xl font-serif font-bold text-[var(--color-primary)]">
              Memory Story Maker
            </h2>
            <p className="text-[15px] font-sans text-[var(--color-text-secondary)] mt-1">
              Paste any text → Sajan creates an illogical story you'll never forget <span className="text-xl inline-block ml-1">🧠✨</span>
            </p>
          </div>
        </div>

        {/* How it works banner */}
        <div className="mt-6 bg-white border border-[var(--color-border)] rounded-none p-5 flex flex-col sm:flex-row gap-4 sm:items-center">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-8 h-8 rounded-full border border-[var(--color-border)] flex items-center justify-center shrink-0">
              <span className="text-sm font-semibold text-[var(--color-primary)]">1</span>
            </div>
            <span className="text-[14px] font-sans font-medium text-[var(--color-primary)]">Paste text</span>
          </div>
          
          <div className="hidden sm:flex shrink-0 text-[var(--color-border)]">
            <ArrowRight className="w-4 h-4" />
          </div>
          
          <div className="flex items-center gap-3 flex-1">
            <div className="w-8 h-8 rounded-full border border-[var(--color-border)] flex items-center justify-center shrink-0">
              <span className="text-sm font-semibold text-[var(--color-primary)]">2</span>
            </div>
            <span className="text-[14px] font-sans font-medium text-[var(--color-primary)]">Generate Story</span>
          </div>
          
          <div className="hidden sm:flex shrink-0 text-[var(--color-border)]">
            <ArrowRight className="w-4 h-4" />
          </div>
          
          <div className="flex items-center gap-3 flex-1">
            <div className="w-8 h-8 rounded-full border border-[var(--color-border)] flex items-center justify-center shrink-0">
              <span className="text-sm font-semibold text-[var(--color-primary)]">3</span>
            </div>
            <span className="text-[14px] font-sans font-medium text-[var(--color-primary)]">Lock in Memory</span>
          </div>
        </div>
      </div>

      {/* Input Card */}
      <div className="bg-white border border-[var(--color-border)] rounded-none p-6 lg:p-8">

        <label className="block text-[15px] font-serif font-semibold text-[var(--color-primary)] mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Initialize Memory Matrix
        </label>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste any paragraph, chapter, article, notes, or any text here... Sajan will turn it into an illogical but unforgettable memory story!"
          className="w-full min-h-[240px] bg-[var(--color-bg)] border border-[var(--color-border)] rounded-none p-5 text-[15px] font-sans text-[var(--color-primary)] placeholder-[var(--color-text-hint)] focus:border-[var(--color-primary)] focus:ring-0 outline-none transition-all resize-y"
        />

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 text-[14px] font-sans text-red-600 flex items-center gap-3">
            <span className="font-bold">⚠️</span>
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 mt-6">
          <span className="text-[13px] font-sans text-[var(--color-text-hint)] flex items-center gap-2">
            <span className="inline-flex items-center justify-center bg-[var(--color-bg)] px-2.5 py-1 font-mono text-xs border border-[var(--color-border)]">{wordCount} words</span>
            {wordCount > 500 && <span className="text-orange-600">• Deep processing required</span>}
          </span>
          <button
            onClick={handleAnalyze}
            disabled={!text.trim() || isAnalyzing}
            className="btn-elegant w-full sm:w-auto px-8"
          >
            {isAnalyzing ? (
              <span className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-[var(--color-text-hint)] border-t-[var(--color-primary)] rounded-full animate-spin" />
                Synthesizing Concept...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Generate Story Sequence
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isAnalyzing && (
        <div className="mt-8 bg-white p-10 border border-[var(--color-border)] text-center">
          <div className="flex flex-col items-center gap-5">
            <div className="w-16 h-16 border border-[var(--color-border)] rounded-full flex items-center justify-center bg-[var(--color-bg)]">
              <Brain className="w-8 h-8 text-[var(--color-primary)] animate-pulse" />
            </div>
            <div>
              <p className="text-[18px] font-serif font-bold text-[var(--color-primary)] tracking-wide">
                Processing Input Matrix...
              </p>
              <p className="text-[14px] font-sans text-[var(--color-text-secondary)] mt-2">
                Weaving a highly memorable narrative from your concepts
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Result */}
      {result && !isAnalyzing && (
        <div className="mt-8 space-y-6">
          {devDemo && (
            <div className="p-4 bg-amber-50 border border-amber-200 text-sm font-sans text-amber-800 rounded-lg">
              Demo story generated locally. Start the backend with <code className="bg-amber-100 px-1 rounded">OPENAI_API_KEY</code> for real AI-powered stories.
            </div>
          )}

          {/* Story Card — Main Hero */}
          <div className="bg-white border border-[var(--color-border)] p-8 lg:p-12">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-10 border-b border-[var(--color-border)] pb-8">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 border border-[var(--color-border)] rounded-full flex items-center justify-center shrink-0 bg-[var(--color-bg)]">
                  <Wand2 className="w-6 h-6 text-[var(--color-primary)]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-[var(--color-text-secondary)]" />
                    <p className="text-[var(--color-text-secondary)] text-[12px] font-sans font-bold uppercase tracking-[0.2em]">
                      Synthesized Memory
                    </p>
                  </div>
                  <h3 className="text-[var(--color-primary)] text-[28px] lg:text-[32px] font-serif font-bold leading-tight">
                    {result.title}
                  </h3>
                </div>
              </div>
              
              <button
                onClick={handleCopy}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-[var(--color-border)] text-[var(--color-primary)] text-[14px] font-semibold transition-all hover:bg-[var(--color-bg)] shrink-0"
              >
                {copied ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-[var(--color-primary)]" />}
                {copied ? 'Copied to Clipboard' : 'Copy Sequence'}
              </button>
            </div>

            <div className="relative">
              <Quote className="absolute -top-6 -left-6 w-12 h-12 text-[var(--color-border)] rotate-180" />
              <p className="relative z-10 text-[var(--color-text-secondary)] text-[18px] lg:text-[20px] font-serif tracking-wide leading-[2.2] whitespace-pre-wrap pl-8 border-l-2 border-[var(--color-border)]">
                {result.story}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Concept Decoder */}
            <div className="bg-white p-8 border border-[var(--color-border)] flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 border border-[var(--color-border)] rounded-full flex items-center justify-center bg-[var(--color-bg)]">
                  <span className="text-xl">🔑</span>
                </div>
                <h4 className="text-[14px] font-serif font-bold text-[var(--color-primary)] uppercase tracking-wider">
                  Concept Matrix Decoder
                </h4>
              </div>
              <div className="space-y-3 flex-1">
                {result.conceptMap.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 border border-[var(--color-border)] bg-[var(--color-bg)]">
                    <span className="text-2xl shrink-0 mt-1">{item.emoji}</span>
                    <div className="min-w-0">
                      <p className="text-[14px] font-serif font-bold text-[var(--color-primary)] mb-1">
                        "{item.storyElement}"
                      </p>
                      <p className="text-[14px] font-sans text-[var(--color-text-secondary)] leading-relaxed">
                        {item.realConcept}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {/* Memory Hook */}
              <div className="bg-[var(--color-primary)] p-8 border border-[var(--color-primary)]">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-[14px] font-sans font-medium text-white/80 uppercase tracking-wider">
                    Core Memory Hook
                  </h4>
                </div>
                <p className="text-[18px] font-serif font-semibold text-white leading-relaxed">
                  "{result.memoryHook}"
                </p>
              </div>

              {/* Quick Revision */}
              <div className="bg-white p-8 border border-[var(--color-border)]">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 border border-[var(--color-border)] rounded-full flex items-center justify-center bg-[var(--color-bg)]">
                    <BookOpen className="w-5 h-5 text-[var(--color-primary)]" />
                  </div>
                  <h4 className="text-[14px] font-serif font-bold text-[var(--color-primary)] uppercase tracking-wider">
                    Technical Summary
                  </h4>
                </div>
                <p className="text-[15px] font-sans text-[var(--color-text-secondary)] leading-relaxed">
                  {result.quickRevision}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              className="flex-1 px-6 h-[50px] border border-[var(--color-border)] text-[var(--color-primary)] font-semibold text-[15px] font-sans hover:border-[var(--color-primary)] transition-all flex items-center justify-center bg-white"
              onClick={() => { setResult(null); setText(''); }}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Initialize New Session
            </button>
            <button
              className="flex-1 btn-elegant"
              onClick={() => navigate('/student/chat')}
            >
              <Brain className="w-4 h-4 mr-2" />
              Discuss in Neural Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParagraphTool;
