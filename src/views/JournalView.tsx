import React, { useState } from 'react';
import {
  Compass,
  Plus,
  Lock,
  Unlock,
  Smile,
  Trash2,
  Calendar,
  Search,
  ChevronLeft,
  X,
  Check,
  Sparkles,
} from 'lucide-react';
import { JournalEntry } from '../types';
import { soundManager } from '../utils/soundEffects';

interface JournalViewProps {
  journal: JournalEntry[];
  onAddEntry: (entry: JournalEntry) => void;
  onDeleteEntry: (entryId: string) => void;
  onBack: () => void;
  isPinLocked: boolean;
  onOpenPinModal: () => void;
  soundEnabled: boolean;
}

export const JournalView: React.FC<JournalViewProps> = ({
  journal,
  onAddEntry,
  onDeleteEntry,
  onBack,
  isPinLocked,
  onOpenPinModal,
  soundEnabled,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State for 5 Guided Prompts
  const [learnToday, setLearnToday] = useState('');
  const [achieveToday, setAchieveToday] = useState('');
  const [mistakes, setMistakes] = useState('');
  const [improveTomorrow, setImproveTomorrow] = useState('');
  const [generalDay, setGeneralDay] = useState('');
  const [mood, setMood] = useState<JournalEntry['mood']>('Productive');
  const [tagsText, setTagsText] = useState('Growth, Focus');

  const moods: { label: JournalEntry['mood']; emoji: string }[] = [
    { label: 'Ecstatic', emoji: '🔥' },
    { label: 'Productive', emoji: '⚡' },
    { label: 'Calm', emoji: '🌱' },
    { label: 'Rough', emoji: '🌧️' },
    { label: 'Exhausted', emoji: '💤' },
  ];

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!learnToday.trim() && !achieveToday.trim() && !generalDay.trim()) return;

    if (soundEnabled) soundManager.playHabitDone();

    const now = new Date();
    const newEntry: JournalEntry = {
      id: `j_${Date.now()}`,
      date: now.toISOString().split('T')[0],
      timestamp: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      mood,
      learnToday,
      achieveToday,
      mistakes,
      improveTomorrow,
      generalDay,
      tags: tagsText.split(',').map((t) => t.trim()).filter(Boolean),
      isLocked: false,
    };

    onAddEntry(newEntry);
    setLearnToday('');
    setAchieveToday('');
    setMistakes('');
    setImproveTomorrow('');
    setGeneralDay('');
    setIsAddModalOpen(false);
  };

  const filteredEntries = journal.filter((entry) => {
    if (selectedMoodFilter !== 'All' && entry.mood !== selectedMoodFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const combined = `${entry.learnToday} ${entry.achieveToday} ${entry.mistakes} ${entry.improveTomorrow} ${entry.generalDay} ${entry.tags.join(' ')}`.toLowerCase();
      return combined.includes(q);
    }
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-12 text-left">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Personal Journal</h2>
            <p className="text-xs text-slate-400">Nightly reflections and mental debriefs.</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenPinModal}
            className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 text-purple-400 hover:text-purple-300 flex items-center justify-center"
            title="Lock / Unlock Journal with PIN"
          >
            {isPinLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </button>
          <button
            onClick={() => {
              if (soundEnabled) soundManager.playClick();
              setIsAddModalOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/30"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New Entry</span>
          </button>
        </div>
      </div>

      {/* If Journal Locked state */}
      {isPinLocked ? (
        <div className="p-10 rounded-3xl bg-slate-900/90 border border-slate-800 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-950/60 border border-purple-500/40 text-purple-400 mx-auto flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white">Journal is PIN Protected</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Your private thoughts are safely encrypted under local PIN lock.
          </p>
          <button
            onClick={onOpenPinModal}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-md transition-all"
          >
            Enter PIN to Unlock
          </button>
        </div>
      ) : (
        <>
          {/* Search Bar & Mood Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reflections, insights, tags..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <button
                onClick={() => setSelectedMoodFilter('All')}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedMoodFilter === 'All'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                All Moods
              </button>
              {moods.map((m) => (
                <button
                  key={m.label}
                  onClick={() => setSelectedMoodFilter(m.label)}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                    selectedMoodFilter === m.label
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <span>{m.emoji}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Entries Feed */}
          <div className="space-y-3">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-2.5 text-left"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-base">
                      {moods.find((m) => m.label === entry.mood)?.emoji || '⚡'}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-white font-mono">{entry.date}</span>
                      <span className="text-[10px] text-slate-500 ml-1.5 font-mono">{entry.timestamp}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/30">
                      {entry.mood}
                    </span>
                    <button
                      onClick={() => onDeleteEntry(entry.id)}
                      className="text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {entry.learnToday && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-cyan-400 block tracking-wider">
                      What I Learned Today
                    </span>
                    <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">{entry.learnToday}</p>
                  </div>
                )}

                {entry.achieveToday && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">
                      Key Wins & Progress
                    </span>
                    <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">{entry.achieveToday}</p>
                  </div>
                )}

                {entry.mistakes && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">
                      Mistakes & Lessons
                    </span>
                    <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">{entry.mistakes}</p>
                  </div>
                )}

                {entry.improveTomorrow && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-purple-400 block tracking-wider">
                      Tomorrow's Focus
                    </span>
                    <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">{entry.improveTomorrow}</p>
                  </div>
                )}

                {entry.tags.length > 0 && (
                  <div className="flex items-center gap-1 pt-1">
                    {entry.tags.map((t) => (
                      <span key={t} className="text-[10px] text-slate-400">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Add Entry Modal with Guided 5 Prompts */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#0a0f1d] border border-slate-800 rounded-3xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white">Daily Reflection Entry</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEntry} className="space-y-3.5 text-left text-xs">
              {/* Mood Selection */}
              <div>
                <label className="text-slate-400 font-medium block mb-1.5">How was your day? (Mood)</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {moods.map((m) => (
                    <button
                      type="button"
                      key={m.label}
                      onClick={() => setMood(m.label)}
                      className={`py-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                        mood === m.label
                          ? 'bg-purple-950/80 border-purple-500 text-white font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      <span className="text-base">{m.emoji}</span>
                      <span className="text-[9px]">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt 1 */}
              <div>
                <label className="text-cyan-400 font-semibold block mb-1">
                  1. What did I learn today? *
                </label>
                <textarea
                  rows={2}
                  value={learnToday}
                  onChange={(e) => setLearnToday(e.target.value)}
                  placeholder="New mental model, technical concept, or insight"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              {/* Prompt 2 */}
              <div>
                <label className="text-emerald-400 font-semibold block mb-1">
                  2. What did I achieve today?
                </label>
                <textarea
                  rows={2}
                  value={achieveToday}
                  onChange={(e) => setAchieveToday(e.target.value)}
                  placeholder="Tangible progress, shipped code, physical reps"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              {/* Prompt 3 */}
              <div>
                <label className="text-amber-400 font-semibold block mb-1">
                  3. What mistakes did I make?
                </label>
                <textarea
                  rows={2}
                  value={mistakes}
                  onChange={(e) => setMistakes(e.target.value)}
                  placeholder="Distractions, ego traps, missed commitments"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              {/* Prompt 4 */}
              <div>
                <label className="text-purple-400 font-semibold block mb-1">
                  4. What should I improve tomorrow?
                </label>
                <textarea
                  rows={2}
                  value={improveTomorrow}
                  onChange={(e) => setImproveTomorrow(e.target.value)}
                  placeholder="Specific boundary, ritual or priority"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={tagsText}
                  onChange={(e) => setTagsText(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xs shadow-md shadow-purple-600/30"
              >
                Save Journal Entry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
