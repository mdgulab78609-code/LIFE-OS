import React from 'react';
import {
  Flame,
  CheckCircle2,
  Clock,
  Target,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Brain,
  ListTodo,
  Calendar,
  ShieldAlert,
  GraduationCap,
  Award,
  Compass,
  FileSpreadsheet,
  Check,
  ChevronRight,
  Plus,
} from 'lucide-react';
import {
  Habit,
  Goal,
  Task,
  UserProfile,
  LifeScore,
  SubViewType,
  TabType,
} from '../types';
import { soundManager } from '../utils/soundEffects';

interface HomeDashboardProps {
  user: UserProfile;
  habits: Habit[];
  goals: Goal[];
  tasks: Task[];
  focusMinutesToday: number;
  lifeScore: LifeScore;
  onNavigateTab: (tab: TabType) => void;
  onNavigateSubView: (subView: SubViewType) => void;
  onToggleHabit: (habitId: string) => void;
  onToggleTask: (taskId: string) => void;
  soundEnabled: boolean;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  user,
  habits,
  goals,
  tasks,
  focusMinutesToday,
  lifeScore,
  onNavigateTab,
  onNavigateSubView,
  onToggleHabit,
  onToggleTask,
  soundEnabled,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // Calculate greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  // Date formatting
  const dateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  // Habit metrics
  const activeHabits = habits.filter((h) => !h.isArchived && !h.isPaused);
  const completedHabitsCount = activeHabits.filter(
    (h) => (h.completedDates[todayStr] ?? 0) >= h.targetValue
  ).length;
  const pendingHabits = activeHabits.filter(
    (h) => (h.completedDates[todayStr] ?? 0) < h.targetValue
  );

  // Task metrics
  const todayTasks = tasks.filter((t) => t.dueDate === todayStr);
  const completedTasksCount = todayTasks.filter((t) => t.completed).length;

  // Streak calculation (max of current streaks)
  const maxStreak = Math.max(...habits.map((h) => h.currentStreak), 0);

  // Overall today's progress percentage
  const totalItems = activeHabits.length + todayTasks.length;
  const completedItems = completedHabitsCount + completedTasksCount;
  const todayProgress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  // Focus time in hours & mins
  const focusHours = (focusMinutesToday / 60).toFixed(1);

  // SVG Progress Ring calculations
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (todayProgress / 100) * circumference;

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-12 text-left">
      {/* 1. Header Greeting & User Avatar */}
      <div className="flex items-center justify-between">
        <div className="min-w-0 pr-2">
          <p className="text-xs font-medium text-slate-400">{greeting},</p>
          <h2 className="text-xl font-extrabold text-white tracking-tight truncate">
            {user.name}
          </h2>
          <span className="text-[11px] text-cyan-400/90 font-medium">
            {dateFormatted}
          </span>
        </div>
        <div
          onClick={() => onNavigateTab('profile')}
          className="relative cursor-pointer group shrink-0"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-500 p-0.5 shadow-md shadow-purple-600/20 group-hover:scale-105 transition-transform">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full rounded-[14px] object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#080c16]" />
        </div>
      </div>


      {/* 2. Today's Hero Progress Card */}
      <div className="rounded-3xl bg-gradient-to-br from-[#12192e] to-[#0c1220] border border-slate-800/80 p-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block">
              Today's Performance
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold font-mono text-white">
                {todayProgress}%
              </span>
              <span className="text-xs text-emerald-400 font-medium">
                {todayProgress >= 80 ? 'Mastery Pace' : 'Building Momentum'}
              </span>
            </div>

            <div className="flex items-center gap-3 mt-3 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>
                  Habits: <strong>{completedHabitsCount}/{activeHabits.length}</strong>
                </span>
              </div>
              <span className="text-slate-600">·</span>
              <div className="flex items-center gap-1.5">
                <ListTodo className="w-3.5 h-3.5 text-purple-400" />
                <span>
                  Tasks: <strong>{completedTasksCount}/{todayTasks.length}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Circular Animated SVG Progress Ring */}
          <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 96 96">
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="7"
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="stroke-cyan-400 transition-all duration-700 ease-out"
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Four Core Metric Glance Boxes */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Streak */}
        <div
          onClick={() => onNavigateSubView('challenges')}
          className="p-3.5 rounded-2xl bg-[#0f172a]/90 border border-slate-800 hover:border-amber-500/40 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Streak</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-white">{maxStreak}</span>
            <span className="text-[11px] text-slate-400">Days</span>
          </div>
          <span className="text-[10px] text-amber-300 font-medium block mt-1">
            All-Time High: 28d 🔥
          </span>
        </div>

        {/* Focus Time */}
        <div
          onClick={() => onNavigateSubView('focus')}
          className="p-3.5 rounded-2xl bg-[#0f172a]/90 border border-slate-800 hover:border-purple-500/40 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Focus Time</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-white">{focusHours}</span>
            <span className="text-[11px] text-slate-400">Hours</span>
          </div>
          <span className="text-[10px] text-purple-300 font-medium block mt-1">
            Pomodoro Deep Work
          </span>
        </div>

        {/* Life Score */}
        <div
          onClick={() => onNavigateSubView('life_score')}
          className="p-3.5 rounded-2xl bg-[#0f172a]/90 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Life Score</span>
            <Award className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-cyan-400">
              {lifeScore.overallScore}
            </span>
            <span className="text-[11px] text-slate-400">/ 100</span>
          </div>
          <span className="text-[10px] text-cyan-300 font-medium block mt-1 truncate">
            Top: {lifeScore.strongestArea}
          </span>
        </div>

        {/* Active Goals */}
        <div
          onClick={() => onNavigateTab('goals')}
          className="p-3.5 rounded-2xl bg-[#0f172a]/90 border border-slate-800 hover:border-emerald-500/40 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active Goals</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-white">{goals.length}</span>
            <span className="text-[11px] text-slate-400">Targets</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-medium block mt-1">
            Avg: 56% Completed
          </span>
        </div>
      </div>

      {/* 4. AI Daily Planner Smart Card */}
      <div
        onClick={() => onNavigateSubView('ai_planner')}
        className="rounded-2xl p-3.5 bg-gradient-to-r from-purple-950/40 via-slate-900 to-cyan-950/40 border border-purple-500/30 hover:border-purple-400/60 cursor-pointer transition-all flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 group-hover:scale-105 transition-transform">
            <Brain className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>AI Daily Planner & Life Strategist</span>
              <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 bg-purple-500/20 text-purple-300 rounded">
                Gemini 3.8
              </span>
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Generate optimized schedule, habit suggestions & recovery plan.
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
      </div>

      {/* 5. Pending Habits Quick Check-off */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Pending Habits ({pendingHabits.length})
          </h3>
          <button
            onClick={() => onNavigateTab('habits')}
            className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>All Habits</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {pendingHabits.length === 0 ? (
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <Check className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <p className="text-xs font-semibold text-white">All Habits Crushed Today!</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Your streak continues to surge forward.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {pendingHabits.slice(0, 3).map((habit) => (
              <div
                key={habit.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div className="min-w-0 pr-2">
                  <h4 className="text-xs font-semibold text-white truncate">
                    {habit.name}
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    {habit.category} · Streak {habit.currentStreak}d 🔥
                  </span>
                </div>
                <button
                  onClick={() => {
                    if (soundEnabled) soundManager.playHabitDone();
                    onToggleHabit(habit.id);
                  }}
                  className="w-8 h-8 rounded-xl bg-purple-950/60 hover:bg-purple-900 border border-purple-500/40 text-purple-300 hover:text-white flex items-center justify-center active:scale-95 transition-all shrink-0"
                  title="Check off habit"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. Today's Tasks Snapshot */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Today's Tasks ({completedTasksCount}/{todayTasks.length})
          </h3>
          <button
            onClick={() => onNavigateSubView('tasks')}
            className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>Open Tasks</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-2">
          {todayTasks.slice(0, 3).map((task) => (
            <div
              key={task.id}
              onClick={() => {
                if (soundEnabled) soundManager.playClick();
                onToggleTask(task.id);
              }}
              className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                task.completed
                  ? 'bg-slate-950/60 border-slate-900 text-slate-500'
                  : 'bg-slate-900/80 border-slate-800 text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <div
                  className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                    task.completed
                      ? 'bg-emerald-500 border-emerald-500 text-black'
                      : 'border-slate-600'
                  }`}
                >
                  {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span
                  className={`text-xs truncate ${
                    task.completed ? 'line-through text-slate-500' : 'text-white'
                  }`}
                >
                  {task.title}
                </span>
              </div>
              <span
                className={`text-[10px] font-mono shrink-0 px-1.5 py-0.5 rounded ${
                  task.priority === 'high'
                    ? 'text-rose-400 bg-rose-950/40'
                    : 'text-slate-400 bg-slate-800'
                }`}
              >
                {task.dueTime}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Quick Access Companion Modules Grid */}
      <div className="space-y-2 pt-2">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Life OS Companion Modules
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {/* Daily Tasks */}
          <button
            onClick={() => onNavigateSubView('tasks')}
            className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 text-left transition-all active:scale-95"
          >
            <ListTodo className="w-5 h-5 text-cyan-400 mb-1" />
            <span className="text-xs font-bold text-white block">Daily Tasks</span>
            <span className="text-[10px] text-slate-400">Filters & Priority</span>
          </button>

          {/* Routine Planner */}
          <button
            onClick={() => onNavigateSubView('routine')}
            className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 text-left transition-all active:scale-95"
          >
            <Clock className="w-5 h-5 text-purple-400 mb-1" />
            <span className="text-xs font-bold text-white block">Timetable</span>
            <span className="text-[10px] text-slate-400">24h Routine</span>
          </button>

          {/* Focus Mode */}
          <button
            onClick={() => onNavigateSubView('focus')}
            className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 text-left transition-all active:scale-95"
          >
            <Brain className="w-5 h-5 text-amber-400 mb-1" />
            <span className="text-xs font-bold text-white block">Focus Mode</span>
            <span className="text-[10px] text-slate-400">Pomodoro Timer</span>
          </button>

          {/* My Journal */}
          <button
            onClick={() => onNavigateSubView('journal')}
            className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-pink-500/40 text-left transition-all active:scale-95"
          >
            <Compass className="w-5 h-5 text-pink-400 mb-1" />
            <span className="text-xs font-bold text-white block">My Journal</span>
            <span className="text-[10px] text-slate-400">Private Diary</span>
          </button>

          {/* Skills Learning */}
          <button
            onClick={() => onNavigateSubView('learning')}
            className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 text-left transition-all active:scale-95"
          >
            <GraduationCap className="w-5 h-5 text-indigo-400 mb-1" />
            <span className="text-xs font-bold text-white block">Learning</span>
            <span className="text-[10px] text-slate-400">Track Skills</span>
          </button>

          {/* Bad Habits */}
          <button
            onClick={() => onNavigateSubView('bad_habits')}
            className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-rose-500/40 text-left transition-all active:scale-95"
          >
            <ShieldAlert className="w-5 h-5 text-rose-400 mb-1" />
            <span className="text-xs font-bold text-white block">Break Habits</span>
            <span className="text-[10px] text-slate-400">Clean Streaks</span>
          </button>

          {/* Challenges */}
          <button
            onClick={() => onNavigateSubView('challenges')}
            className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 text-left transition-all active:scale-95"
          >
            <Award className="w-5 h-5 text-emerald-400 mb-1" />
            <span className="text-xs font-bold text-white block">Challenges</span>
            <span className="text-[10px] text-slate-400">7-100 Day Trials</span>
          </button>

          {/* Vision Board */}
          <button
            onClick={() => onNavigateSubView('vision_board')}
            className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/40 text-left transition-all active:scale-95"
          >
            <TrendingUp className="w-5 h-5 text-teal-400 mb-1" />
            <span className="text-xs font-bold text-white block">Vision Board</span>
            <span className="text-[10px] text-slate-400">Future Dreams</span>
          </button>

          {/* Reports & PDF */}
          <button
            onClick={() => onNavigateSubView('reports')}
            className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/40 text-left transition-all active:scale-95"
          >
            <FileSpreadsheet className="w-5 h-5 text-blue-400 mb-1" />
            <span className="text-xs font-bold text-white block">Analytics</span>
            <span className="text-[10px] text-slate-400">PDF & CSV Export</span>
          </button>
        </div>
      </div>
    </div>
  );
};
