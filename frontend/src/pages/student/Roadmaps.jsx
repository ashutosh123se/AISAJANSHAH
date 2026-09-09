import React, { useState } from 'react';
import { Route as RouteIcon, Map, Target, Lock, CheckCircle2, PlayCircle, Unlock, ChevronDown, ChevronUp } from 'lucide-react';

const Roadmaps = () => {
  // Initial mock data simulating a backend fetch
  const initialActiveRoadmap = {
    id: 'r1',
    title: '90-Day Exam Mastery',
    description: 'A structured plan to boost focus, improve retention, and tackle your board exams with confidence.',
    modules: [
      {
        id: 'm1',
        title: 'Module 1: The Foundation of Focus',
        lessons: [
          { id: 'l1_1', title: 'Understanding your attention span', completed: true },
          { id: 'l1_2', title: 'Eliminating digital distractions', completed: true },
        ]
      },
      {
        id: 'm2',
        title: 'Module 2: Advanced Study Techniques',
        lessons: [
          { id: 'l2_1', title: 'Mastering the Pomodoro Technique', completed: true },
          { id: 'l2_2', title: 'Active Recall vs Passive Reading', completed: false },
          { id: 'l2_3', title: 'Spaced Repetition Systems', completed: false },
        ]
      },
      {
        id: 'm3',
        title: 'Module 3: The Memory Palace',
        lessons: [
          { id: 'l3_1', title: 'Introduction to Spatial Memory', completed: false },
          { id: 'l3_2', title: 'Building your first Palace', completed: false },
        ]
      },
      {
        id: 'm4',
        title: 'Module 4: Exam Execution',
        lessons: [
          { id: 'l4_1', title: 'Time Management in the Hall', completed: false },
          { id: 'l4_2', title: 'Managing Exam Anxiety', completed: false },
        ]
      }
    ]
  };

  const [activeRoadmap, setActiveRoadmap] = useState(initialActiveRoadmap);
  const [expandedModule, setExpandedModule] = useState(null);
  const [availableRoadmaps, setAvailableRoadmaps] = useState([
    { id: 'r2', title: 'Public Speaking Foundation', desc: "Learn the core techniques Sajan uses on stage.", locked: true },
    { id: 'r3', title: 'Financial Literacy for Teens', desc: "Understand money, saving, and basic investing.", locked: true },
  ]);

  // Calculate dynamic progress
  const allLessons = activeRoadmap.modules.flatMap(m => m.lessons);
  const completedLessons = allLessons.filter(l => l.completed).length;
  const progressPercent = allLessons.length === 0 ? 0 : Math.round((completedLessons / allLessons.length) * 100);

  // Find the next milestone (first incomplete lesson)
  let nextMilestone = null;
  for (const mod of activeRoadmap.modules) {
    const nextLesson = mod.lessons.find(l => !l.completed);
    if (nextLesson) {
      nextMilestone = { moduleTitle: mod.title, lessonTitle: nextLesson.title };
      break;
    }
  }

  const toggleLesson = (moduleId, lessonId) => {
    setActiveRoadmap(prev => {
      const newModules = prev.modules.map(mod => {
        if (mod.id !== moduleId) return mod;
        return {
          ...mod,
          lessons: mod.lessons.map(lesson => 
            lesson.id === lessonId ? { ...lesson, completed: !lesson.completed } : lesson
          )
        };
      });
      return { ...prev, modules: newModules };
    });
  };

  const unlockRoadmap = (id) => {
    setAvailableRoadmaps(prev => prev.map(rm => rm.id === id ? { ...rm, locked: false } : rm));
  };

  const enterTerritory = (roadmap) => {
    // Generate dummy modules for the new roadmap
    const newRoadmap = {
      id: roadmap.id,
      title: roadmap.title,
      description: roadmap.desc,
      modules: [
        {
          id: 'm1',
          title: 'Module 1: The Basics',
          lessons: [
            { id: 'l1_1', title: 'Introduction & Setup', completed: false },
            { id: 'l1_2', title: 'Core Principles', completed: false }
          ]
        },
        {
          id: 'm2',
          title: 'Module 2: Advanced Techniques',
          lessons: [
            { id: 'l2_1', title: 'Deep Dive', completed: false },
            { id: 'l2_2', title: 'Practical Application', completed: false }
          ]
        }
      ]
    };
    // Swap the current one back into available and set the new one as active
    setAvailableRoadmaps(prev => [
      ...prev.filter(rm => rm.id !== roadmap.id),
      { id: activeRoadmap.id, title: activeRoadmap.title, desc: activeRoadmap.description, locked: false }
    ]);
    setActiveRoadmap(newRoadmap);
    setExpandedModule(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-[1000px] mx-auto w-full px-3.5 sm:px-6 py-4 sm:py-8 lg:py-10">
      {/* Header */}
      <div className="mb-6 sm:mb-12 text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-serif font-bold text-[var(--color-primary)] tracking-tight mb-2 sm:mb-4">
          Neural Pathways
        </h2>
        <p className="text-xs sm:text-[15px] font-sans text-[var(--color-text-secondary)] max-w-xl mx-auto">
          Navigate your cognitive growth journey. Follow the path to unlock new skills and optimize your performance.
        </p>
      </div>

      {/* Active Roadmap Hero Card */}
      <div className="bg-white border border-[var(--color-border)] p-5 sm:p-8 lg:p-10 mb-8 sm:mb-16 rounded-xl sm:rounded-2xl">
        <div className="flex flex-col md:flex-row gap-6 sm:gap-10 items-center">
          <div className="flex-1 w-full">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <span className="text-[10px] sm:text-[12px] font-sans font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] px-2.5 sm:px-3 py-1 sm:py-1.5 text-[var(--color-text-secondary)] bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md">
                Active Directive
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-4xl font-serif font-bold text-[var(--color-primary)] mt-1 leading-tight">{activeRoadmap.title}</h3>
            <p className="text-xs sm:text-[15px] font-sans mt-2 sm:mt-4 mb-5 sm:mb-8 text-[var(--color-text-secondary)] max-w-lg leading-relaxed">
              {activeRoadmap.description}
            </p>
            <div className="mb-2">
              <div className="flex justify-between items-end mb-2 sm:mb-3">
                <span className="text-xs sm:text-[14px] font-sans font-medium text-[var(--color-text-secondary)]">Optimization Progress</span>
                <span className="text-sm sm:text-[16px] font-sans font-bold text-[var(--color-primary)]">{progressPercent}%</span>
              </div>
              <div className="w-full max-w-lg h-2 bg-[var(--color-bg)] overflow-hidden border border-[var(--color-border)] rounded-full">
                <div className="h-full bg-[var(--color-primary)] transition-all duration-1000 ease-out" 
                     style={{ width: `${Math.max(2, progressPercent)}%` }}>
                </div>
              </div>
            </div>
            
            {progressPercent === 100 && (
              <div className="mt-6 sm:mt-8 inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 font-sans font-bold text-xs sm:text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" /> Directive Complete!
              </div>
            )}
          </div>

          {nextMilestone && progressPercent < 100 && (
            <div className="w-full md:w-[320px] p-4 sm:p-6 flex-shrink-0 flex flex-col justify-center border border-[var(--color-border)] bg-[var(--color-bg)] rounded-xl">
              <h4 className="text-[11px] sm:text-[12px] font-sans font-bold text-[var(--color-primary)] uppercase tracking-wider mb-2 sm:mb-4 flex items-center gap-2">
                <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Next Parameter
              </h4>
              <p className="text-base sm:text-[18px] font-serif font-semibold text-[var(--color-primary)] leading-snug mb-1 sm:mb-2">
                {nextMilestone.lessonTitle}
              </p>
              <p className="text-xs sm:text-[14px] font-sans text-[var(--color-text-secondary)]">
                {nextMilestone.moduleTitle.split(':')[0]}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Visual Timeline Map */}
      <div className="mb-24">
        <h3 className="text-2xl font-serif font-bold text-[var(--color-primary)] mb-16 text-center flex items-center justify-center gap-3">
          <RouteIcon className="w-6 h-6 text-[var(--color-primary)]" /> The Path Ahead
        </h3>
        
        <div className="relative max-w-4xl mx-auto px-4 md:px-0">
          {/* Main vertical line for desktop (centered) and mobile (left) */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-[var(--color-border)] z-0"></div>
          
          {/* Progress line */}
          <div className="absolute left-8 md:left-1/2 top-0 w-[2px] bg-[var(--color-primary)] z-0 transition-all duration-1000"
               style={{ height: `${progressPercent}%` }}></div>

          <div className="flex flex-col gap-16 md:gap-0 relative z-10">
            {activeRoadmap.modules.map((mod, index) => {
              const isEven = index % 2 === 0;
              const moduleLessons = mod.lessons.length;
              const completedInModule = mod.lessons.filter(l => l.completed).length;
              const isModuleComplete = completedInModule === moduleLessons;
              const isModuleStarted = completedInModule > 0;
              const isExpanded = expandedModule === mod.id;

              // Node status styling
              let nodeBg = 'bg-white'; 
              let nodeBorder = 'border-[var(--color-border)]';
              let badgeColors = 'text-[var(--color-text-secondary)] bg-[var(--color-bg)] border-[var(--color-border)]';
              let nodeTextColor = 'text-[var(--color-primary)]';
              
              if (isModuleComplete) {
                nodeBg = 'bg-green-50';
                nodeBorder = 'border-green-300';
                badgeColors = 'text-green-700 bg-green-50 border-green-200';
              } else if (isModuleStarted || (index === 0 && !isModuleStarted)) {
                nodeBg = 'bg-[var(--color-primary)]';
                nodeBorder = 'border-[var(--color-primary)]';
                badgeColors = 'text-white bg-[var(--color-primary)] border-[var(--color-primary)]';
                nodeTextColor = 'text-white';
              }

              return (
                <div key={mod.id} className={`flex flex-col md:flex-row items-start md:items-center w-full ${isEven ? 'md:flex-row-reverse' : ''} group/module`}>
                  
                  {/* Space filler for the opposite side on desktop */}
                  <div className="hidden md:block md:w-1/2"></div>
                  
                  {/* The Node on the timeline */}
                  <div className={`absolute left-8 md:left-1/2 w-12 h-12 rounded-full border-[2px] transform -translate-x-1/2 z-20 flex items-center justify-center transition-all duration-500 ${nodeBg} ${nodeBorder}`}>
                    {isModuleComplete ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    ) : (
                      <span className={`text-[15px] font-sans font-bold ${nodeTextColor}`}>{index + 1}</span>
                    )}
                  </div>
                  
                  {/* Content Card */}
                  <div className={`w-full md:w-1/2 pl-20 md:pl-0 ${isEven ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                    <div 
                      className={`p-6 lg:p-8 transition-all duration-300 cursor-pointer bg-white border ${
                        isModuleComplete ? 'border-green-300' : 
                        isModuleStarted ? 'border-[var(--color-primary)]' : 
                        'border-[var(--color-border)]'
                      }`}
                    >

                      {/* Interactive click area to expand/collapse */}
                      <div onClick={() => setExpandedModule(isExpanded ? null : mod.id)} className="flex flex-col gap-3">
                        <div className={`text-[12px] font-sans font-bold tracking-wider uppercase flex items-center gap-3 ${isEven ? 'md:justify-end' : ''}`}>
                          <span className={isModuleComplete ? 'text-green-600' : isModuleStarted ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]'}>
                            Phase {index + 1}
                          </span>
                          <div className={`px-3 py-1 text-[10px] border ${badgeColors}`}>
                            {completedInModule}/{moduleLessons} Generated
                          </div>
                        </div>
                        <h4 className="text-[20px] font-serif font-bold text-[var(--color-primary)]">{mod.title.split(': ')[1] || mod.title}</h4>
                        
                        <div className={`flex items-center gap-2 text-[var(--color-text-secondary)] text-[13px] mt-2 font-sans ${isEven ? 'md:justify-end' : ''}`}>
                          {isExpanded ? 'Hide Parameters' : 'View Parameters'} 
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>

                      {/* Expanded Lessons */}
                      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[500px] mt-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="flex flex-col gap-2 border-t border-[var(--color-border)] pt-5">
                          {mod.lessons.map((lesson) => (
                            <div key={lesson.id} 
                                 onClick={() => toggleLesson(mod.id, lesson.id)}
                                 className="flex items-center justify-between p-3.5 cursor-pointer group/lesson border border-transparent hover:border-[var(--color-border)] bg-[var(--color-bg)]">
                              <div className="flex items-center gap-4 text-left w-full">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                                  lesson.completed ? (isModuleComplete ? 'bg-green-500 border-green-500' : 'bg-[var(--color-primary)] border-[var(--color-primary)]') : 'bg-white border-[var(--color-border)]'
                                }`}>
                                  {lesson.completed && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                </div>
                                <span className={`text-[14px] font-sans ${lesson.completed ? 'text-[var(--color-text-hint)] line-through' : 'text-[var(--color-primary)]'}`}>
                                  {lesson.title}
                                </span>
                              </div>
                              {!lesson.completed && (
                                <PlayCircle className="w-4 h-4 text-[var(--color-primary)] opacity-0 group-hover/lesson:opacity-100 transition-opacity shrink-0" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Available Paths / Locked Regions */}
      <div>
        <h3 className="text-2xl font-serif font-bold text-[var(--color-primary)] mb-8 flex items-center gap-3">
          <Lock className="w-6 h-6 text-[var(--color-text-secondary)]" /> Undiscovered Territories
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availableRoadmaps.map((rm) => (
            <div key={rm.id} className="p-8 bg-white border border-[var(--color-border)]">
              
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 flex items-center justify-center border border-[var(--color-border)] bg-[var(--color-bg)]">
                    {rm.locked ? <Map className="w-5 h-5 text-[var(--color-text-secondary)]" /> : <Map className="w-5 h-5 text-[var(--color-primary)]" />}
                  </div>
                  <div className="px-3 py-1.5 text-[11px] font-sans font-bold uppercase tracking-wider bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                    {rm.locked ? 'Locked Area' : 'Accessible'}
                  </div>
                </div>
                
                <h4 className="text-[20px] font-serif font-bold text-[var(--color-primary)] mb-3">{rm.title}</h4>
                <p className="text-[15px] font-sans text-[var(--color-text-secondary)] mb-8 min-h-[44px]">{rm.desc}</p>
                
                {rm.locked ? (
                  <button onClick={() => unlockRoadmap(rm.id)}
                          className="w-full py-3.5 font-sans font-semibold text-[14px] flex items-center justify-center gap-2 bg-white text-[var(--color-primary)] border border-[var(--color-border)] hover:bg-[var(--color-bg)] transition-all">
                    <Unlock className="w-4 h-4" /> Decrypt Territory
                  </button>
                ) : (
                  <button onClick={() => enterTerritory(rm)}
                          className="btn-elegant w-full py-3.5 flex items-center justify-center gap-2">
                    Initialize Pathway
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Roadmaps;
