import React from 'react';
import {
  FileSpreadsheet,
  Download,
  Printer,
  ChevronLeft,
  CheckCircle2,
  Clock,
  Target,
  Flame,
  Award,
  TrendingUp,
} from 'lucide-react';
import { Habit, Goal, Task, SkillTrack } from '../types';
import { soundManager } from '../utils/soundEffects';

interface ReportsViewProps {
  habits: Habit[];
  goals: Goal[];
  tasks: Task[];
  skills: SkillTrack[];
  focusMinutesToday: number;
  onBack: () => void;
  soundEnabled: boolean;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  habits,
  goals,
  tasks,
  skills,
  focusMinutesToday,
  onBack,
  soundEnabled,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const totalHabitsCompleted = habits.reduce(
    (acc, h) => acc + Object.values(h.completedDates).filter((v) => v >= h.targetValue).length,
    0
  );

  const completedTasks = tasks.filter((t) => t.completed).length;
  const avgGoalProgress =
    goals.length > 0
      ? Math.round(goals.reduce((acc, g) => acc + g.progressPercentage, 0) / goals.length)
      : 0;

  const totalLearningHours = (
    skills.reduce((acc, s) => acc + s.loggedMinutes, 0) / 60
  ).toFixed(1);

  // CSV Generator
  const downloadCSV = () => {
    if (soundEnabled) soundManager.playClick();
    const rows = [
      ['Metric', 'Value', 'Category', 'Date Generated'],
      ['Total Habits Completed (Historical)', totalHabitsCompleted.toString(), 'Habits', todayStr],
      ['Tasks Completed', `${completedTasks}/${tasks.length}`, 'Tasks', todayStr],
      ['Average Goal Progress', `${avgGoalProgress}%`, 'Goals', todayStr],
      ['Total Skill Learning Logged', `${totalLearningHours} hours`, 'Skills', todayStr],
      ['Today Focus Deep Work', `${(focusMinutesToday / 60).toFixed(1)} hours`, 'Focus', todayStr],
      ['Active Habits Count', habits.length.toString(), 'Habits', todayStr],
      ['Active Goals Count', goals.length.toString(), 'Goals', todayStr],
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LIFE_OS_Performance_Report_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handlePrint = () => {
    if (soundEnabled) soundManager.playClick();
    window.print();
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
            <h2 className="text-xl font-extrabold text-white tracking-tight">Executive Reports</h2>
            <p className="text-xs text-slate-400">Weekly & monthly velocity analytics and export.</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={downloadCSV}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 flex items-center gap-1 border border-cyan-500/30"
            title="Download CSV Spreadsheet"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-2.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white flex items-center gap-1 shadow-sm"
            title="Print or Save PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] uppercase font-mono text-cyan-400 block">Habit Completions</span>
          <span className="text-2xl font-bold font-mono text-white mt-1 block">
            {totalHabitsCompleted}
          </span>
          <span className="text-[10px] text-emerald-400 block mt-0.5">+14% vs Previous Period</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] uppercase font-mono text-purple-400 block">Task Velocity</span>
          <span className="text-2xl font-bold font-mono text-white mt-1 block">
            {completedTasks}/{tasks.length}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">High Execution Rate</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] uppercase font-mono text-amber-400 block">Learning Hours</span>
          <span className="text-2xl font-bold font-mono text-white mt-1 block">
            {totalLearningHours}h
          </span>
          <span className="text-[10px] text-amber-300 block mt-0.5">Continuous Mastery</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] uppercase font-mono text-emerald-400 block">Avg Goal Progress</span>
          <span className="text-2xl font-bold font-mono text-white mt-1 block">
            {avgGoalProgress}%
          </span>
          <span className="text-[10px] text-emerald-400 block mt-0.5">Target: 70% Q4</span>
        </div>
      </div>

      {/* Narrative Synthesis */}
      <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
        <span className="text-xs font-bold text-white uppercase tracking-wider block">
          Performance Assessment
        </span>

        <div className="space-y-2 text-xs text-slate-300">
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <strong className="text-cyan-400 block mb-0.5">Best Performing Habit</strong>
            <p>
              "Daily High-Leverage Coding" maintained a stellar 18-day active streak with zero skipped weekdays.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <strong className="text-amber-400 block mb-0.5">Key Friction Point</strong>
            <p>
              Hydration target (8 glasses) dips on high-pressure sprint days. Recommended fix: place 1L pitcher on desk before first focus block.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
