import React, { useState } from 'react';
import {
  Clock,
  Plus,
  CheckCircle2,
  Circle,
  Sun,
  Laptop,
  Dumbbell,
  Moon,
  Trash2,
  ChevronLeft,
  X,
  Check,
} from 'lucide-react';
import { RoutineActivity } from '../types';
import { soundManager } from '../utils/soundEffects';

interface RoutineViewProps {
  routine: RoutineActivity[];
  onAddActivity: (activity: RoutineActivity) => void;
  onToggleActivity: (activityId: string) => void;
  onDeleteActivity: (activityId: string) => void;
  onBack: () => void;
  soundEnabled: boolean;
}

export const RoutineView: React.FC<RoutineViewProps> = ({
  routine,
  onAddActivity,
  onToggleActivity,
  onDeleteActivity,
  onBack,
  soundEnabled,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('06:00 AM');
  const [endTime, setEndTime] = useState('07:00 AM');
  const [category, setCategory] = useState<RoutineActivity['category']>('Morning');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (soundEnabled) soundManager.playHabitDone();

    const newActivity: RoutineActivity = {
      id: `r_${Date.now()}`,
      title,
      startTime,
      endTime,
      category,
      icon: 'Clock',
      color: category === 'Morning' ? '#06b6d4' : category === 'Work' ? '#3b82f6' : category === 'Fitness' ? '#f97316' : '#8b5cf6',
      recurringDays: [0, 1, 2, 3, 4, 5, 6],
      completedToday: false,
    };

    onAddActivity(newActivity);
    setTitle('');
    setIsAddModalOpen(false);
  };

  const completedCount = routine.filter((r) => r.completedToday).length;
  const progressPercent = routine.length > 0 ? Math.round((completedCount / routine.length) * 100) : 0;

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-12 text-left">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Daily Timetable</h2>
            <p className="text-xs text-slate-400">Structured daily timeline from dawn to dusk.</p>
          </div>
        </div>
        <button
          onClick={() => {
            if (soundEnabled) soundManager.playClick();
            setIsAddModalOpen(true);
          }}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/30"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add Block</span>
        </button>
      </div>

      {/* Routine Progress Summary */}
      <div className="p-3.5 rounded-2xl bg-[#0f172a] border border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-mono text-cyan-400 font-bold">
            Today's Adherence
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-xl font-bold font-mono text-white">{progressPercent}%</span>
            <span className="text-xs text-slate-400">
              {completedCount}/{routine.length} Blocks Completed
            </span>
          </div>
        </div>
        <div className="w-20 h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 24-Hour Vertical Visual Timeline */}
      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-cyan-400 before:via-purple-500 before:to-slate-800">
        {routine.map((item) => (
          <div key={item.id} className="relative">
            {/* Timeline node dot */}
            <div
              className={`absolute -left-6 top-2 w-3.5 h-3.5 rounded-full border-2 border-[#080c16] transition-all ${
                item.completedToday
                  ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50'
                  : 'bg-slate-700'
              }`}
            />

            <div
              className={`p-3.5 rounded-2xl border transition-all ${
                item.completedToday
                  ? 'bg-slate-950/70 border-slate-900 text-slate-400'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 text-white'
              }`}
            >
              <div className="flex items-start justify-between">
                <div
                  onClick={() => {
                    if (soundEnabled) soundManager.playHabitDone();
                    onToggleActivity(item.id);
                  }}
                  className="flex-1 cursor-pointer pr-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-cyan-400">
                      {item.startTime} – {item.endTime}
                    </span>
                    <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                      {item.category}
                    </span>
                  </div>
                  <h4 className={`text-xs font-bold mt-1 ${item.completedToday ? 'line-through text-slate-500' : 'text-white'}`}>
                    {item.title}
                  </h4>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      if (soundEnabled) soundManager.playHabitDone();
                      onToggleActivity(item.id);
                    }}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                      item.completedToday
                        ? 'bg-emerald-500 text-black'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  </button>
                  <button
                    onClick={() => onDeleteActivity(item.id)}
                    className="w-7 h-7 rounded-lg text-slate-500 hover:text-rose-400 flex items-center justify-center"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Activity Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-[#0a0f1d] border border-slate-800 rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white">Add Routine Block</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-left text-xs">
              <div>
                <label className="text-slate-400 font-medium block mb-1">Activity Name *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Morning Routine, Deep Work, Workout"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 font-medium block mb-1">Start Time</label>
                  <input
                    type="text"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    placeholder="05:00 AM"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-medium block mb-1">End Time</label>
                  <input
                    type="text"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    placeholder="06:30 AM"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                >
                  <option value="Morning">Morning</option>
                  <option value="Work">Work</option>
                  <option value="Learning">Learning</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Evening">Evening</option>
                  <option value="Sleep">Sleep</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-md shadow-purple-600/30"
              >
                Add Activity to Timetable
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
