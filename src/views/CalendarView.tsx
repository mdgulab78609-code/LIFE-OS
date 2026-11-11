import React, { useState } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Flame,
  Clock,
  BookOpen,
  ListTodo,
} from 'lucide-react';
import { Habit, Task, JournalEntry, FocusSession } from '../types';
import { soundManager } from '../utils/soundEffects';

interface CalendarViewProps {
  habits: Habit[];
  tasks: Task[];
  journal: JournalEntry[];
  focusMinutesToday: number;
  soundEnabled: boolean;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  habits,
  tasks,
  journal,
  focusMinutesToday,
  soundEnabled,
}) => {
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const monthName = currentMonthDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const prevMonth = () => {
    if (soundEnabled) soundManager.playClick();
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    if (soundEnabled) soundManager.playClick();
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  // Calendar days generation
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Helper to calculate completion rate for a given date YYYY-MM-DD
  const getActivityForDate = (dateStr: string) => {
    const activeHabits = habits.filter((h) => !h.isArchived);
    if (activeHabits.length === 0) return { percent: 0, status: 'empty' };

    let completed = 0;
    activeHabits.forEach((h) => {
      const val = h.completedDates[dateStr] ?? 0;
      if (val >= h.targetValue) completed++;
    });

    const percent = Math.round((completed / activeHabits.length) * 100);

    let status = 'grey'; // No activity
    if (percent >= 80) status = 'green';
    else if (percent >= 30) status = 'yellow';
    else if (percent > 0) status = 'red';

    return { percent, status, completed, total: activeHabits.length };
  };

  // Drill-down data for selected date
  const habitsForDate = habits.filter((h) => !h.isArchived);
  const tasksForDate = tasks.filter((t) => t.dueDate === selectedDate);
  const journalForDate = journal.find((j) => j.date === selectedDate);

  const selectedDateActivity = getActivityForDate(selectedDate);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-12 text-left">
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight">Activity & Calendar</h2>
        <p className="text-xs text-slate-400">
          Visual heatmaps and daily performance audit logs.
        </p>
      </div>

      {/* 90-Day Activity Heatmap Strip (GitHub-style) */}
      <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            90-Day Execution Density
          </span>
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm bg-slate-800" /> None
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm bg-rose-500" /> &lt;30%
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm bg-amber-400" /> Partial
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm bg-emerald-500" /> &gt;80%
            </span>
          </div>
        </div>

        {/* 90 Days Heatmap Grid */}
        <div className="grid grid-rows-7 grid-flow-col gap-1 overflow-x-auto py-1">
          {Array.from({ length: 91 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (90 - i));
            const dStr = d.toISOString().split('T')[0];
            const act = getActivityForDate(dStr);

            let bg = 'bg-slate-800';
            if (act.status === 'green') bg = 'bg-emerald-500';
            else if (act.status === 'yellow') bg = 'bg-amber-400';
            else if (act.status === 'red') bg = 'bg-rose-500';

            const isSelected = selectedDate === dStr;

            return (
              <button
                key={dStr}
                onClick={() => {
                  if (soundEnabled) soundManager.playClick();
                  setSelectedDate(dStr);
                }}
                className={`w-3.5 h-3.5 rounded-sm transition-all ${bg} ${
                  isSelected ? 'ring-2 ring-white scale-125 z-10' : 'hover:opacity-80'
                }`}
                title={`${dStr}: ${act.percent}% completed`}
              />
            );
          })}
        </div>
      </div>

      {/* Month Calendar Grid Card */}
      <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-bold text-white font-mono">{monthName}</span>
          <button
            onClick={nextMonth}
            className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-500 uppercase mb-2">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Days cells */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="h-9" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const d = new Date(year, month, dayNum);
            const dateStr = d.toISOString().split('T')[0];
            const act = getActivityForDate(dateStr);
            const isSelected = selectedDate === dateStr;
            const isToday = new Date().toISOString().split('T')[0] === dateStr;

            return (
              <button
                key={dateStr}
                onClick={() => {
                  if (soundEnabled) soundManager.playClick();
                  setSelectedDate(dateStr);
                }}
                className={`h-9 rounded-xl flex flex-col items-center justify-center text-xs font-mono relative transition-all ${
                  isSelected
                    ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/40 ring-1 ring-cyan-300'
                    : isToday
                    ? 'bg-slate-800 text-cyan-400 font-bold border border-cyan-500/40'
                    : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>{dayNum}</span>
                {act.status !== 'grey' && (
                  <span
                    className={`w-1 h-1 rounded-full mt-0.5 ${
                      act.status === 'green'
                        ? 'bg-emerald-400'
                        : act.status === 'yellow'
                        ? 'bg-amber-400'
                        : 'bg-rose-400'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Drill-Down History Details */}
      <div className="p-4 rounded-3xl bg-[#0e1424] border border-slate-800 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <span className="text-[10px] uppercase font-mono text-cyan-400">Day Audit History</span>
            <h3 className="text-sm font-bold text-white">
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </h3>
          </div>
          <div className="text-right">
            <span className="text-base font-bold font-mono text-cyan-400">
              {selectedDateActivity.percent}%
            </span>
            <span className="text-[10px] text-slate-400 block">
              {selectedDateActivity.completed}/{selectedDateActivity.total} Habits Done
            </span>
          </div>
        </div>

        {/* Habits status on that day */}
        <div>
          <span className="text-[11px] uppercase font-semibold text-slate-400 block mb-2">
            Habits Status on this Date
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {habitsForDate.map((habit) => {
              const val = habit.completedDates[selectedDate] ?? 0;
              const isDone = val >= habit.targetValue;
              return (
                <div
                  key={habit.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                    isDone
                      ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="truncate mr-2">{habit.name}</span>
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tasks on that day */}
        {tasksForDate.length > 0 && (
          <div className="pt-2 border-t border-slate-800/60">
            <span className="text-[11px] uppercase font-semibold text-slate-400 block mb-1.5">
              Tasks Scheduled
            </span>
            <div className="space-y-1.5">
              {tasksForDate.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs"
                >
                  <span className={t.completed ? 'line-through text-slate-500' : 'text-white'}>
                    {t.title}
                  </span>
                  <span className="text-[10px] font-mono text-purple-400">{t.dueTime}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Journal snippet if exists */}
        {journalForDate && (
          <div className="pt-2 border-t border-slate-800/60">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] uppercase font-semibold text-slate-400">
                Journal Reflection
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/30">
                Mood: {journalForDate.mood}
              </span>
            </div>
            <p className="text-xs text-slate-300 italic bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              "{journalForDate.learnToday}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
