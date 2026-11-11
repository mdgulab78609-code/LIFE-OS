import React, { useState } from 'react';
import {
  ShieldAlert,
  Plus,
  Flame,
  RotateCcw,
  Sparkles,
  Heart,
  ChevronLeft,
  X,
  Trash2,
  DollarSign,
  TrendingDown,
} from 'lucide-react';
import { BadHabit } from '../types';
import { soundManager } from '../utils/soundEffects';

interface BadHabitsViewProps {
  badHabits: BadHabit[];
  onAddBadHabit: (habit: BadHabit) => void;
  onRecordRelapse: (habitId: string, reason: string) => void;
  onDeleteBadHabit: (habitId: string) => void;
  onBack: () => void;
  soundEnabled: boolean;
}

export const BadHabitsView: React.FC<BadHabitsViewProps> = ({
  badHabits,
  onAddBadHabit,
  onRecordRelapse,
  onDeleteBadHabit,
  onBack,
  soundEnabled,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [relapseHabitId, setRelapseHabitId] = useState<string | null>(null);
  const [relapseReason, setRelapseReason] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [reasonToQuit, setReasonToQuit] = useState('');
  const [targetAvoidanceDays, setTargetAvoidanceDays] = useState(30);
  const [moneySavedPerDay, setMoneySavedPerDay] = useState(0);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (soundEnabled) soundManager.playHabitDone();

    const newHabit: BadHabit = {
      id: `bh_${Date.now()}`,
      name,
      reasonToQuit,
      targetAvoidanceDays: Number(targetAvoidanceDays) || 30,
      cleanSinceDate: new Date().toISOString().split('T')[0],
      relapses: [],
      moneySavedPerDay: Number(moneySavedPerDay) || 0,
    };

    onAddBadHabit(newHabit);
    setName('');
    setReasonToQuit('');
    setIsAddModalOpen(false);
  };

  const handleConfirmRelapse = () => {
    if (!relapseHabitId) return;
    if (soundEnabled) soundManager.playClick();
    onRecordRelapse(relapseHabitId, relapseReason || 'Momentary lapse in willpower');
    setRelapseHabitId(null);
    setRelapseReason('');
  };

  const getCleanDays = (cleanSinceDate: string) => {
    const diff = new Date().getTime() - new Date(cleanSinceDate).getTime();
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-12 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Break Bad Habits</h2>
            <p className="text-xs text-slate-400">Eliminate self-limiting habits with positive reinforcement.</p>
          </div>
        </div>
        <button
          onClick={() => {
            if (soundEnabled) soundManager.playClick();
            setIsAddModalOpen(true);
          }}
          className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/30"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Break Habit</span>
        </button>
      </div>

      <div className="space-y-3.5">
        {badHabits.map((habit) => {
          const cleanDays = getCleanDays(habit.cleanSinceDate);
          const percent = Math.min(
            100,
            Math.round((cleanDays / (habit.targetAvoidanceDays || 30)) * 100)
          );
          const moneySaved = (cleanDays * habit.moneySavedPerDay).toFixed(0);

          return (
            <div
              key={habit.id}
              className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">{habit.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{habit.reasonToQuit}</p>
                </div>
                <button
                  onClick={() => onDeleteBadHabit(habit.id)}
                  className="text-slate-500 hover:text-rose-400 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Clean Streak Counter Card */}
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold block">
                    Clean Streak
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-bold font-mono text-white">{cleanDays}</span>
                    <span className="text-xs text-slate-400">Days Free</span>
                  </div>
                </div>

                {habit.moneySavedPerDay > 0 && (
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-mono text-amber-400 font-bold block">
                      Money Saved
                    </span>
                    <span className="text-lg font-bold font-mono text-emerald-400">
                      ${moneySaved}
                    </span>
                  </div>
                )}
              </div>

              {/* Progress towards milestone target */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400">
                    Goal: {habit.targetAvoidanceDays} Days ({percent}%)
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold">
                    {cleanDays >= habit.targetAvoidanceDays ? 'Goal Conquered! 🏆' : `${habit.targetAvoidanceDays - cleanDays}d remaining`}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-400 rounded-full transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              {/* Reset button with encouraging tone */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {habit.relapses.length} past relapses learned from
                </span>
                <button
                  onClick={() => setRelapseHabitId(habit.id)}
                  className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-rose-300 font-medium flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Log Relapse (No Shame)</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Relapse Dialog Modal */}
      {relapseHabitId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-[#0a0f1d] border border-slate-800 rounded-3xl p-5 shadow-2xl text-left">
            <h3 className="text-sm font-bold text-white mb-1">Restart With Zero Guilt</h3>
            <p className="text-xs text-slate-400 mb-3">
              Relapse is part of rewriting brain circuitry. Reflect on what triggered it so you can protect yourself next time:
            </p>

            <textarea
              rows={3}
              value={relapseReason}
              onChange={(e) => setRelapseReason(e.target.value)}
              placeholder="What triggered this? (e.g. fatigue, stressful meeting, idle phone boredom)"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none mb-3"
            />

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setRelapseHabitId(null)}
                className="py-2.5 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRelapse}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white shadow-md"
              >
                Reset & Begin Anew
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Bad Habit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-[#0a0f1d] border border-slate-800 rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white">Break a Habit</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-left text-xs">
              <div>
                <label className="text-slate-400 font-medium block mb-1">Habit to Eliminate *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Late Night Bedtime Scrolling, Junk Food"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-1">Why do you want to quit?</label>
                <input
                  type="text"
                  value={reasonToQuit}
                  onChange={(e) => setReasonToQuit(e.target.value)}
                  placeholder="e.g. Deep sleep quality and morning energy"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 font-medium block mb-1">Target Clean Days</label>
                  <input
                    type="number"
                    min={7}
                    value={targetAvoidanceDays}
                    onChange={(e) => setTargetAvoidanceDays(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-medium block mb-1">Daily $ Saved (Optional)</label>
                  <input
                    type="number"
                    min={0}
                    value={moneySavedPerDay}
                    onChange={(e) => setMoneySavedPerDay(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-md"
              >
                Track Habit Freedom
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
