import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Plus,
  RefreshCw,
  ChevronLeft,
  Calendar,
  Zap,
} from 'lucide-react';
import { Habit, Goal, Task } from '../types';
import { soundManager } from '../utils/soundEffects';

interface AiPlannerViewProps {
  goals: Goal[];
  habits: Habit[];
  tasks: Task[];
  onAddHabit: (habit: Habit) => void;
  onBack: () => void;
  soundEnabled: boolean;
}

export const AiPlannerView: React.FC<AiPlannerViewProps> = ({
  goals,
  habits,
  tasks,
  onAddHabit,
  onBack,
  soundEnabled,
}) => {
  const [availableHours, setAvailableHours] = useState(8);
  const [energyLevel, setEnergyLevel] = useState('High');
  const [priorities, setPriorities] = useState('High-leverage coding, endurance fitness, and deep sleep');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiPlan, setAiPlan] = useState<any>(null);

  const handleGeneratePlan = async () => {
    if (soundEnabled) soundManager.playClick();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/gemini/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goals: goals.map((g) => ({ title: g.title, category: g.category })),
          tasks: tasks.slice(0, 5).map((t) => ({ title: t.title, priority: t.priority })),
          habits: habits.slice(0, 5).map((h) => ({ name: h.name, streak: h.currentStreak })),
          availableHours,
          energyLevel,
          priorities,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        if (soundEnabled) soundManager.playHabitDone();
        setAiPlan(json.data);
      } else {
        setError(json.error || 'Failed to generate plan.');
      }
    } catch (e: any) {
      setError(e.message || 'Network error connecting to Gemini API.');
    } finally {
      setIsLoading(false);
    }
  };

  const addRecommendedHabit = (h: any) => {
    if (soundEnabled) soundManager.playHabitDone();
    const newHabit: Habit = {
      id: `ai_h_${Date.now()}`,
      name: h.name,
      description: h.reason,
      category: (h.category as any) || 'Personal',
      icon: 'Sparkles',
      color: '#06b6d4',
      startDate: new Date().toISOString().split('T')[0],
      reminderTime: h.suggestedTime || '08:00',
      frequency: 'daily',
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      targetValue: 1,
      unit: 'done',
      habitType: 'boolean',
      currentStreak: 0,
      longestStreak: 0,
      completedDates: {},
      isArchived: false,
      isPaused: false,
    };
    onAddHabit(newHabit);
  };

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
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-1.5">
              <span>AI Daily Planner</span>
              <span className="text-[9px] font-mono uppercase bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
                Gemini 3.8
              </span>
            </h2>
            <p className="text-xs text-slate-400">Personalized daily strategy and schedule architecture.</p>
          </div>
        </div>
      </div>

      {/* Input Configuration Box */}
      <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="text-slate-400 font-medium block mb-1">Available Hours</label>
            <input
              type="number"
              min={1}
              max={16}
              value={availableHours}
              onChange={(e) => setAvailableHours(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
            />
          </div>
          <div>
            <label className="text-slate-400 font-medium block mb-1">Energy Level</label>
            <select
              value={energyLevel}
              onChange={(e) => setEnergyLevel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
            >
              <option value="High">Peak / High</option>
              <option value="Medium">Medium / Steady</option>
              <option value="Low">Low / Recovery</option>
            </select>
          </div>
        </div>

        <div className="text-xs">
          <label className="text-slate-400 font-medium block mb-1">Today's Core Focus & Priorities</label>
          <input
            type="text"
            value={priorities}
            onChange={(e) => setPriorities(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
          />
        </div>

        <button
          onClick={handleGeneratePlan}
          disabled={isLoading}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Synthesizing Optimal Schedule with Gemini...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate AI Daily Optimization Plan</span>
            </>
          )}
        </button>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}
      </div>

      {/* Generated AI Results */}
      {aiPlan && (
        <div className="space-y-4 animate-fade-in">
          {/* Summary */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-purple-950/50 to-slate-900 border border-purple-500/30">
            <div className="flex items-center gap-2 text-purple-300 text-xs font-bold mb-1">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Strategic Diagnosis</span>
            </div>
            <p className="text-xs text-white leading-relaxed">{aiPlan.dailyPlanSummary}</p>
            <div className="mt-2.5 pt-2 border-t border-purple-500/20 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Workload:</span>
              <span className="font-bold text-cyan-300">{aiPlan.workloadAssessment}</span>
            </div>
          </div>

          {/* Timeline Blocks */}
          <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-2.5">
            <span className="text-xs font-bold text-white uppercase tracking-wider block">
              Recommended Timetable Architecture
            </span>
            <div className="space-y-2">
              {aiPlan.timeline?.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start justify-between text-xs"
                >
                  <div>
                    <span className="text-[10px] font-mono font-bold text-cyan-400">
                      {item.startTime} – {item.endTime}
                    </span>
                    <h4 className="font-bold text-white mt-0.5">{item.activity}</h4>
                    {item.tips && <p className="text-[11px] text-slate-400 mt-0.5">{item.tips}</p>}
                  </div>
                  <span className="text-[9px] font-mono uppercase bg-purple-950 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30 shrink-0">
                    {item.energyRequired}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Smart Habit Suggestions with 1-click Add */}
          {aiPlan.recommendedHabits?.length > 0 && (
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-2.5">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Tailored Habit Recommendations
              </span>
              <div className="space-y-2">
                {aiPlan.recommendedHabits.map((rec: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                  >
                    <div className="pr-2">
                      <h4 className="text-xs font-bold text-white">{rec.name}</h4>
                      <p className="text-[11px] text-slate-400">{rec.reason}</p>
                    </div>
                    <button
                      onClick={() => addRecommendedHabit(rec)}
                      className="px-2.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-1 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Habit</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recovery Advice */}
          {aiPlan.recoveryPlan && (
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
                Streak Recovery & Cognitive Balance
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">{aiPlan.recoveryPlan}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
