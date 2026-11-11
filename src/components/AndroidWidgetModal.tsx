import React from 'react';
import { X, CheckCircle2, Circle, Flame, Sparkles, Clock, Check } from 'lucide-react';
import { Habit, Task } from '../types';
import { soundManager } from '../utils/soundEffects';

interface AndroidWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  habits: Habit[];
  tasks: Task[];
  onToggleHabit: (habitId: string) => void;
  onToggleTask: (taskId: string) => void;
  streak: number;
  todayProgress: number;
  soundEnabled: boolean;
}

export const AndroidWidgetModal: React.FC<AndroidWidgetModalProps> = ({
  isOpen,
  onClose,
  habits,
  tasks,
  onToggleHabit,
  onToggleTask,
  streak,
  todayProgress,
  soundEnabled,
}) => {
  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-[#0a0f1d] border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">Android Home Screen Widgets</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-400 mb-4">
          Interactive preview of LIFE OS Glanceable Widgets for your Android launcher. Tap items to check off directly from your home screen:
        </p>

        {/* Mock Android Wallpaper Background */}
        <div className="w-full rounded-2xl p-4 bg-gradient-to-b from-indigo-950/60 via-slate-900 to-slate-950 border border-slate-700/50 shadow-inner flex flex-col gap-4">
          {/* Widget 1: 4x2 Life Dashboard Widget */}
          <div className="w-full rounded-2xl bg-[#0f172a]/90 backdrop-blur-xl border border-white/10 p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center text-white text-[10px] font-bold">
                  OS
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">LIFE OS · Today</h4>
                  <span className="text-[10px] text-slate-400">Streak: {streak} Days 🔥</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-500/30">
                <span className="text-[10px] font-mono font-bold text-cyan-300">{todayProgress}%</span>
              </div>
            </div>

            {/* Quick Habit Completion List */}
            <div className="space-y-1.5 mb-2">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
                Today's Habits
              </span>
              {habits.slice(0, 4).map((habit) => {
                const isCompleted = (habit.completedDates[todayStr] ?? 0) >= habit.targetValue;
                return (
                  <button
                    key={habit.id}
                    onClick={() => {
                      if (soundEnabled) soundManager.playHabitDone();
                      onToggleHabit(habit.id);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-all ${
                      isCompleted
                        ? 'bg-purple-950/40 text-slate-300 border border-purple-500/20'
                        : 'bg-slate-800/60 hover:bg-slate-800 text-white border border-slate-700/40'
                    }`}
                  >
                    <span className={`truncate mr-2 ${isCompleted ? 'line-through text-slate-400' : ''}`}>
                      {habit.name}
                    </span>
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
              <span>Synced live with Room DB</span>
              <span className="text-cyan-400 font-mono">Applet Widget 4x2</span>
            </div>
          </div>

          {/* Widget 2: 2x2 Focus & Streak Quick Launch */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[#0f172a]/90 backdrop-blur-xl border border-white/10 p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <Flame className="w-4 h-4 text-amber-400" />
                <span className="text-[10px] font-mono text-slate-400">Streak</span>
              </div>
              <div className="my-2">
                <span className="text-2xl font-bold font-mono text-white">{streak}</span>
                <span className="text-[10px] text-slate-400 block">Consecutive Days</span>
              </div>
              <span className="text-[9px] text-emerald-400">Top 5% Consistency</span>
            </div>

            <div className="rounded-2xl bg-[#0f172a]/90 backdrop-blur-xl border border-white/10 p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span className="text-[10px] font-mono text-slate-400">Focus</span>
              </div>
              <div className="my-2">
                <span className="text-2xl font-bold font-mono text-white">2.2h</span>
                <span className="text-[10px] text-slate-400 block">Deep Work Today</span>
              </div>
              <span className="text-[9px] text-purple-400">Pomodoro Ready</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
        >
          Close Widget Preview
        </button>
      </div>
    </div>
  );
};
