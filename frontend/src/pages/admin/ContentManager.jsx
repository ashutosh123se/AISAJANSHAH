import React, { useState, useEffect } from 'react';
import { Gamepad2, Search, Trophy, Medal, Star } from 'lucide-react';
import { apiFetch } from '../../utils/api';
import Input from '../../components/ui/Input';

const BrainGymScores = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await apiFetch('/api/admin/students');
        
        if (response.ok) {
          const data = await response.json();
          // Filter out users without XP, or just show them with 0. 
          // Let's sort by XP descending.
          const sortedData = data.sort((a, b) => (b.xp || 0) - (a.xp || 0));
          setStudents(sortedData);
        }
      } catch (error) {
        console.error('Error fetching student scores:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student => 
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-6">
        <div>
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-[var(--color-primary)] tracking-tight flex items-center gap-4">
            <Gamepad2 className="w-10 h-10 text-[var(--color-accent)]" />
            Brain Gym Leaderboard.
          </h2>
          <p className="text-[16px] font-sans text-[var(--color-text-secondary)] mt-2">
            Track student progress, XP, and levels from playing Brain Gym exercises.
          </p>
        </div>
      </div>

      <div className="bg-white border border-[var(--color-border)] rounded-2xl shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-8 border-b border-[var(--color-border)] flex flex-col sm:flex-row gap-4 justify-between items-center bg-[var(--color-bg)]">
          <div className="w-full sm:w-[400px] relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-[var(--color-text-hint)]" />
            </div>
            <input 
              type="text"
              placeholder="Search by student name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-primary)] placeholder-[var(--color-text-hint)] focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all outline-none font-sans text-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-white border-b border-[var(--color-border)]">
                <th className="px-8 py-5 text-[11px] font-sans font-bold text-[var(--color-text-hint)] uppercase tracking-widest w-24 text-center">Rank</th>
                <th className="px-8 py-5 text-[11px] font-sans font-bold text-[var(--color-text-hint)] uppercase tracking-widest">Student Info</th>
                <th className="px-8 py-5 text-[11px] font-sans font-bold text-[var(--color-text-hint)] uppercase tracking-widest text-center">Level</th>
                <th className="px-8 py-5 text-[11px] font-sans font-bold text-[var(--color-text-hint)] uppercase tracking-widest text-right">Total XP</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="text-center py-12 text-[var(--color-text-secondary)] font-sans">Loading scores...</td></tr>
              ) : filteredStudents.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-12 text-[var(--color-text-secondary)] font-sans">No students found.</td></tr>
              ) : (
                filteredStudents.map((student, index) => {
                  let RankIcon = null;
                  let rankColor = "text-[var(--color-text-hint)]";
                  if (index === 0) {
                    RankIcon = Trophy;
                    rankColor = "text-yellow-600";
                  } else if (index === 1) {
                    RankIcon = Medal;
                    rankColor = "text-slate-400";
                  } else if (index === 2) {
                    RankIcon = Medal;
                    rankColor = "text-amber-700";
                  }

                  return (
                    <tr key={student.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg)] transition-colors bg-white">
                      <td className="px-8 py-6 text-center">
                        <div className="flex justify-center items-center h-full">
                          {RankIcon ? (
                            <RankIcon className={`w-8 h-8 ${rankColor}`} />
                          ) : (
                            <span className="text-[16px] font-sans font-bold text-[var(--color-text-hint)]">#{index + 1}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-primary)] flex items-center justify-center font-serif font-bold text-lg shrink-0">
                            {student.name ? student.name.substring(0,2).toUpperCase() : 'ST'}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[15px] font-sans font-bold text-[var(--color-primary)]">{student.name}</span>
                            <span className="text-[14px] font-sans text-[var(--color-text-secondary)]">{student.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          <Star className="w-4 h-4" />
                          <span className="text-[13px] font-bold font-sans">Level {student.level || 1}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className="text-[18px] font-sans font-bold text-emerald-600">
                          {(student.xp || 0).toLocaleString()} XP
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BrainGymScores;
