import React, { useState } from 'react';
import {
  Plus,
  Flame,
  Check,
  Pause,
  Play,
  Archive,
  Trash2,
  Calendar,
  Sparkles,
  ChevronRight,
  Filter,
  X,
  Edit2,
  CheckCircle2,
  Clock,
  Droplets,
  BookOpen,
  Dumbbell,
  Code2,
  AlarmClock,
} from 'lucide-react';
import { Habit, HabitCategory, HabitType, HabitFrequency } from '../types';
import { soundManager } from '../utils/soundEffects';

interface HabitsViewProps {
  habits: Habit[];
  onAddHabit: (habit: Habit) => void;
  onUpdateHabit: (habit: Habit) => void;
  onDeleteHabit: (habitId: string) => void;
  onToggleHabitDay: (habitId: string, dateStr: string) => void;
  onStepHabitValue: (habitId: string, delta: number) => void;
  soundEnabled: boolean;
}

export const HabitsView: React.FC<HabitsViewProps> = ({
  habits,
  onAddHabit,
  onUpdateHabit,
  onDeleteHabit,
  onToggleHabitDay,
  onStepHabitValue,
  soundEnabled,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [selectedHabitDetail, setSelectedHabitDetail] = useState<Habit | null>(null);

  // Form State for Add / Edit
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<HabitCategory>('Health');
  const [habitType, setHabitType] = useState<HabitType>('boolean');
  const [targetValue, setTargetValue] = useState(1);
  const [unit, setUnit] = useState('done');
  const [reminderTime, setReminderTime] = useState('08:00');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [color, setColor] = useState('#8b5cf6');

  const categories = ['All', 'Health', 'Skills', 'Mind', 'Career', 'Spiritual', 'Personal'];

  const todayStr = new Date().toISOString().split('T')[0];

  // Last 7 days helper for the weekly strip
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      dateStr: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
      isToday: i === 6,
    };
  });

  const filteredHabits = habits.filter((h) => {
    if (h.isArchived) return false;
    if (selectedCategory === 'All') return true;
    return h.category === selectedCategory;
  });

  const openAddModal = () => {
    if (soundEnabled) soundManager.playClick();
    setEditingHabit(null);
    setName('');
    setDescription('');
    setCategory('Health');
    setHabitType('boolean');
    setTargetValue(1);
    setUnit('done');
    setReminderTime('08:00');
    setFrequency('daily');
    setColor('#8b5cf6');
    setIsAddModalOpen(true);
  };

  const openEditModal = (h: Habit) => {
    if (soundEnabled) soundManager.playClick();
    setEditingHabit(h);
    setName(h.name);
    setDescription(h.description);
    setCategory(h.category);
    setHabitType(h.habitType);
    setTargetValue(h.targetValue);
    setUnit(h.unit);
    setReminderTime(h.reminderTime);
    setFrequency(h.frequency);
    setColor(h.color);
    setIsAddModalOpen(true);
    setSelectedHabitDetail(null);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (soundEnabled) soundManager.playHabitDone();

    if (editingHabit) {
      onUpdateHabit({
        ...editingHabit,
        name,
        description,
        category,
        habitType,
        targetValue: Number(targetValue) || 1,
        unit,
        reminderTime,
        frequency,
        color,
      });
    } else {
      const newHabit: Habit = {
        id: `h_${Date.now()}`,
        name,
        description,
        category,
        icon: 'Sparkles',
        color,
        startDate: todayStr,
        reminderTime,
        frequency,
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        targetValue: Number(targetValue) || 1,
        currentValue: 0,
        unit,
        habitType,
        currentStreak: 0,
        longestStreak: 0,
        completedDates: {},
        isArchived: false,
        isPaused: false,
      };
      onAddHabit(newHabit);
    }
    setIsAddModalOpen(false);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-12 text-left">
      {/* Top Section: Title & Contextual Add Habit Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">My Habits</h2>
          <p className="text-xs text-slate-400">Build consistency through daily atomic actions.</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/30 active:scale-95 transition-all"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add Habit</span>
        </button>
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              if (soundEnabled) soundManager.playClick();
              setSelectedCategory(cat);
            }}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Habit List */}
      <div className="space-y-3">
        {filteredHabits.map((habit) => {
          const valToday = habit.completedDates[todayStr] ?? 0;
          const isDoneToday = valToday >= habit.targetValue;

          return (
            <div
              key={habit.id}
              className={`rounded-2xl border p-3.5 transition-all ${
                habit.isPaused
                  ? 'bg-slate-950/60 border-slate-900 opacity-60'
                  : isDoneToday
                  ? 'bg-[#0f172a]/95 border-purple-500/30'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div
                  className="min-w-0 pr-2 cursor-pointer flex-1"
                  onClick={() => {
                    if (soundEnabled) soundManager.playClick();
                    setSelectedHabitDetail(habit);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: habit.color }}
                    />
                    <h3 className="text-sm font-bold text-white truncate">{habit.name}</h3>
                  </div>
                  {habit.description && (
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                      {habit.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400">
                    <span className="text-cyan-400 font-medium">{habit.category}</span>
                    <span>·</span>
                    <span className="flex items-center gap-0.5 text-amber-400 font-mono font-semibold">
                      <Flame className="w-3 h-3 fill-amber-400/20" />
                      {habit.currentStreak}d streak
                    </span>
                    <span>·</span>
                    <span>Target: {habit.targetValue} {habit.unit}</span>
                  </div>
                </div>

                {/* Primary Action Button (Boolean vs Stepper vs Duration) */}
                <div className="shrink-0">
                  {habit.habitType === 'boolean' && (
                    <button
                      onClick={() => {
                        if (soundEnabled) {
                          if (!isDoneToday) soundManager.playHabitDone();
                          else soundManager.playClick();
                        }
                        onToggleHabitDay(habit.id, todayStr);
                      }}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                        isDoneToday
                          ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20 scale-105'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700'
                      }`}
                      title={isDoneToday ? 'Completed today' : 'Tap to mark done'}
                    >
                      <Check className={`w-4 h-4 ${isDoneToday ? 'stroke-[3]' : ''}`} />
                    </button>
                  )}

                  {habit.habitType === 'numeric' && (
                    <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-xl border border-slate-800">
                      <button
                        onClick={() => {
                          if (soundEnabled) soundManager.playClick();
                          onStepHabitValue(habit.id, -1);
                        }}
                        className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-xs font-bold"
                      >
                        -
                      </button>
                      <span className="text-xs font-mono font-bold text-white min-w-[28px] text-center">
                        {valToday}/{habit.targetValue}
                      </span>
                      <button
                        onClick={() => {
                          if (soundEnabled) soundManager.playHabitDone();
                          onStepHabitValue(habit.id, 1);
                        }}
                        className="w-6 h-6 rounded-lg bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center text-xs font-bold"
                      >
                        +
                      </button>
                    </div>
                  )}

                  {habit.habitType === 'duration' && (
                    <button
                      onClick={() => {
                        if (soundEnabled) soundManager.playHabitDone();
                        onToggleHabitDay(habit.id, todayStr);
                      }}
                      className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-semibold transition-all ${
                        isDoneToday
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-purple-950/60 hover:bg-purple-900 text-purple-300 border border-purple-500/30'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>{isDoneToday ? `${habit.targetValue}m Done` : `Log ${habit.targetValue}m`}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Weekly Mini Day Strip */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-medium">Last 7 Days</span>
                <div className="flex items-center gap-1.5">
                  {last7Days.map((day) => {
                    const isDayDone = (habit.completedDates[day.dateStr] ?? 0) >= habit.targetValue;
                    return (
                      <button
                        key={day.dateStr}
                        onClick={() => {
                          if (soundEnabled) soundManager.playClick();
                          onToggleHabitDay(habit.id, day.dateStr);
                        }}
                        className={`w-6 h-6 rounded-lg flex flex-col items-center justify-center text-[9px] font-mono transition-all ${
                          isDayDone
                            ? 'bg-emerald-500 text-black font-bold'
                            : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700'
                        } ${day.isToday ? 'ring-1 ring-cyan-400' : ''}`}
                        title={`${day.dateStr}: ${isDayDone ? 'Completed' : 'Missed'}`}
                      >
                        {day.dayName}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Habit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#0a0f1d] border border-slate-800 rounded-3xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white">
                {editingHabit ? 'Edit Habit' : 'Create New Habit'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-3.5 text-left text-xs">
              <div>
                <label className="text-slate-400 font-medium block mb-1">Habit Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Read 15 Pages, Morning Run, Daily Coding"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-1">Description / Cue</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Why this matters & how you will start"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-medium block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as HabitCategory)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="Health">Health</option>
                    <option value="Skills">Skills</option>
                    <option value="Mind">Mind</option>
                    <option value="Career">Career</option>
                    <option value="Spiritual">Spiritual</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 font-medium block mb-1">Tracking Type</label>
                  <select
                    value={habitType}
                    onChange={(e) => {
                      const t = e.target.value as HabitType;
                      setHabitType(t);
                      if (t === 'boolean') {
                        setTargetValue(1);
                        setUnit('done');
                      } else if (t === 'numeric') {
                        setTargetValue(8);
                        setUnit('glasses');
                      } else if (t === 'duration') {
                        setTargetValue(45);
                        setUnit('mins');
                      }
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="boolean">Yes / No (One-Tap)</option>
                    <option value="numeric">Quantity / Counter</option>
                    <option value="duration">Duration (Minutes)</option>
                  </select>
                </div>
              </div>

              {habitType !== 'boolean' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 font-medium block mb-1">Target Daily Value</label>
                    <input
                      type="number"
                      min={1}
                      value={targetValue}
                      onChange={(e) => setTargetValue(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-medium block mb-1">Unit Label</label>
                    <input
                      type="text"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      placeholder="glasses, pages, mins"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-medium block mb-1">Reminder Time</label>
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-medium block mb-1">Color Theme</label>
                  <div className="flex items-center gap-2 pt-1">
                    {['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'].map((c) => (
                      <button
                        type="button"
                        key={c}
                        onClick={() => setColor(c)}
                        className={`w-6 h-6 rounded-full transition-transform ${
                          color === c ? 'scale-125 ring-2 ring-white' : ''
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold text-xs shadow-md shadow-purple-600/30 hover:opacity-95 transition-all"
              >
                {editingHabit ? 'Save Changes' : 'Create Habit'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Habit Details Modal (Monthly Heatmap & Management) */}
      {selectedHabitDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-[#0a0f1d] border border-slate-800 rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: selectedHabitDetail.color }}
                />
                <h3 className="text-sm font-bold text-white truncate">
                  {selectedHabitDetail.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedHabitDetail(null)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-3">{selectedHabitDetail.description}</p>

            <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">Current Streak</span>
                <span className="text-sm font-bold text-amber-400 font-mono">
                  {selectedHabitDetail.currentStreak} Days 🔥
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">Longest Record</span>
                <span className="text-sm font-bold text-cyan-400 font-mono">
                  {selectedHabitDetail.longestStreak} Days
                </span>
              </div>
            </div>

            {/* Quick 28-Day Heatmap Matrix */}
            <div className="mb-4">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1.5">
                Past 28 Days Consistency
              </span>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 28 }, (_, i) => {
                  const d = new Date();
                  d.setDate(d.getDate() - (27 - i));
                  const dStr = d.toISOString().split('T')[0];
                  const done = (selectedHabitDetail.completedDates[dStr] ?? 0) >= selectedHabitDetail.targetValue;
                  return (
                    <div
                      key={dStr}
                      className={`h-4 rounded-sm ${
                        done ? 'bg-emerald-500' : 'bg-slate-800'
                      }`}
                      title={`${dStr}: ${done ? 'Completed' : 'Missed'}`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Management Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => openEditModal(selectedHabitDetail)}
                className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white font-medium flex items-center justify-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => {
                  onUpdateHabit({
                    ...selectedHabitDetail,
                    isPaused: !selectedHabitDetail.isPaused,
                  });
                  setSelectedHabitDetail(null);
                }}
                className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-amber-300 font-medium flex items-center justify-center gap-1"
              >
                {selectedHabitDetail.isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                <span>{selectedHabitDetail.isPaused ? 'Resume' : 'Pause'}</span>
              </button>
              <button
                onClick={() => {
                  onDeleteHabit(selectedHabitDetail.id);
                  setSelectedHabitDetail(null);
                }}
                className="py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-xs text-rose-300 font-medium flex items-center justify-center gap-1 border border-rose-500/20"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
