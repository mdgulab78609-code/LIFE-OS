import React, { useState } from 'react';
import {
  Target,
  Plus,
  Calendar,
  CheckCircle2,
  Circle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  Trash2,
  Edit3,
  X,
  Check,
  Brain,
  ListOrdered,
} from 'lucide-react';
import { Goal, GoalCategory, Milestone } from '../types';
import { soundManager } from '../utils/soundEffects';

interface GoalsViewProps {
  goals: Goal[];
  onAddGoal: (goal: Goal) => void;
  onUpdateGoal: (goal: Goal) => void;
  onDeleteGoal: (goalId: string) => void;
  soundEnabled: boolean;
}

export const GoalsView: React.FC<GoalsViewProps> = ({
  goals,
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal,
  soundEnabled,
}) => {
  const [activeTab, setActiveTab] = useState<'cards' | 'roadmap'>('cards');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  // AI Breakdown state
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiBreakdownGoal, setAiBreakdownGoal] = useState<Goal | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GoalCategory>('Career');
  const [targetDate, setTargetDate] = useState('2027-12-31');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('high');
  const [notes, setNotes] = useState('');
  const [milestonesText, setMilestonesText] = useState('');

  const categories = [
    'All',
    'Career',
    'Business',
    'Skills',
    'Health',
    'Spiritual Growth',
    'Education',
    'Financial',
    'Personal Growth',
  ];

  const filteredGoals = goals.filter((g) => {
    if (selectedCategory === 'All') return true;
    return g.category === selectedCategory;
  });

  const openAddModal = () => {
    if (soundEnabled) soundManager.playClick();
    setEditingGoal(null);
    setTitle('');
    setDescription('');
    setCategory('Career');
    setTargetDate('2027-12-31');
    setPriority('high');
    setNotes('');
    setMilestonesText('1. Complete foundations\n2. Ship first version\n3. Scale to target outcome');
    setIsAddModalOpen(true);
  };

  const openEditModal = (g: Goal) => {
    if (soundEnabled) soundManager.playClick();
    setEditingGoal(g);
    setTitle(g.title);
    setDescription(g.description);
    setCategory(g.category);
    setTargetDate(g.targetDate);
    setPriority(g.priority);
    setNotes(g.notes);
    setMilestonesText(g.milestones.map((m, i) => `${i + 1}. ${m.title}`).join('\n'));
    setIsAddModalOpen(true);
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (soundEnabled) soundManager.playHabitDone();

    const parsedMilestones: Milestone[] = milestonesText
      .split('\n')
      .map((line) => line.replace(/^\d+[\.\)]\s*/, '').trim())
      .filter(Boolean)
      .map((mTitle, idx) => {
        // preserve existing completed state if editing
        const existing = editingGoal?.milestones[idx];
        return {
          id: existing?.id || `m_${Date.now()}_${idx}`,
          title: mTitle,
          completed: existing?.completed || false,
          dueDate: targetDate,
        };
      });

    const completedCount = parsedMilestones.filter((m) => m.completed).length;
    const progress =
      parsedMilestones.length > 0
        ? Math.round((completedCount / parsedMilestones.length) * 100)
        : 0;

    if (editingGoal) {
      onUpdateGoal({
        ...editingGoal,
        title,
        description,
        category,
        targetDate,
        priority,
        notes,
        milestones: parsedMilestones,
        progressPercentage: progress,
      });
    } else {
      const newGoal: Goal = {
        id: `g_${Date.now()}`,
        title,
        description,
        category,
        targetDate,
        priority,
        progressPercentage: progress,
        milestones: parsedMilestones,
        relatedHabits: [],
        relatedTasks: [],
        notes,
        status: 'active',
      };
      onAddGoal(newGoal);
    }
    setIsAddModalOpen(false);
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    if (soundEnabled) soundManager.playHabitDone();
    const targetGoal = goals.find((g) => g.id === goalId);
    if (!targetGoal) return;

    const updatedMilestones = targetGoal.milestones.map((m) =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );
    const completedCount = updatedMilestones.filter((m) => m.completed).length;
    const progress = Math.round((completedCount / updatedMilestones.length) * 100);

    onUpdateGoal({
      ...targetGoal,
      milestones: updatedMilestones,
      progressPercentage: progress,
    });
  };

  // AI Milestone Breakdown trigger
  const handleAiBreakdown = async (goal: Goal) => {
    if (soundEnabled) soundManager.playClick();
    setAiBreakdownGoal(goal);
    setIsAiLoading(true);

    try {
      const res = await fetch('/api/gemini/breakdown-goal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goalTitle: goal.title,
          category: goal.category,
          targetDate: goal.targetDate,
        }),
      });
      const data = await res.json();
      if (data.success && data.data?.milestones) {
        const newMilestones: Milestone[] = data.data.milestones.map((m: any, idx: number) => ({
          id: `ai_m_${Date.now()}_${idx}`,
          title: m.title,
          description: m.description,
          completed: false,
          dueDate: goal.targetDate,
          deliverable: m.keyDeliverable,
        }));
        onUpdateGoal({
          ...goal,
          milestones: newMilestones,
          progressPercentage: 0,
        });
      }
    } catch (e) {
      console.error('Error generating AI milestone roadmap:', e);
    } finally {
      setIsAiLoading(false);
      setAiBreakdownGoal(null);
    }
  };

  // Days remaining calculation
  const getDaysRemaining = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days} days left` : 'Due / Passed';
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-12 text-left">
      {/* Header & Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">My Goals</h2>
          <p className="text-xs text-slate-400">Transform lifelong ambitions into concrete milestones.</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-600/30 active:scale-95 transition-all"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add Goal</span>
        </button>
      </div>

      {/* View Switcher: Goal Cards vs Roadmap Timeline */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => {
              if (soundEnabled) soundManager.playClick();
              setActiveTab('cards');
            }}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              activeTab === 'cards' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Goal Cards
          </button>
          <button
            onClick={() => {
              if (soundEnabled) soundManager.playClick();
              setActiveTab('roadmap');
            }}
            className={`px-3 py-1 rounded-lg font-medium transition-colors flex items-center gap-1 ${
              activeTab === 'roadmap' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>Roadmap</span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          {categories.slice(0, 4).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-full text-[11px] whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Goal Cards View */}
      {activeTab === 'cards' && (
        <div className="space-y-3.5">
          {filteredGoals.map((goal) => {
            const completedCount = goal.milestones.filter((m) => m.completed).length;

            return (
              <div
                key={goal.id}
                className="rounded-3xl bg-slate-900/90 border border-slate-800 p-4 shadow-lg hover:border-slate-700 transition-all text-left"
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0 pr-2">
                    <span className="text-[10px] uppercase font-mono font-bold text-cyan-400 tracking-wider">
                      {goal.category}
                    </span>
                    <h3 className="text-base font-bold text-white leading-snug mt-0.5">
                      {goal.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {goal.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openEditModal(goal)}
                      className="w-7 h-7 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
                      title="Edit Goal"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteGoal(goal.id)}
                      className="w-7 h-7 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 flex items-center justify-center"
                      title="Delete Goal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar & Stats */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">
                      Progress: <strong className="font-mono text-cyan-400">{goal.progressPercentage}%</strong>
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {getDaysRemaining(goal.targetDate)}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-500"
                      style={{ width: `${goal.progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Milestones Checklist */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                      Milestones ({completedCount}/{goal.milestones.length})
                    </span>
                    <button
                      onClick={() => handleAiBreakdown(goal)}
                      disabled={isAiLoading && aiBreakdownGoal?.id === goal.id}
                      className="text-[10px] text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold"
                    >
                      <Brain className="w-3 h-3" />
                      <span>{isAiLoading && aiBreakdownGoal?.id === goal.id ? 'Generating...' : 'AI Breakdown'}</span>
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {goal.milestones.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => toggleMilestone(goal.id, m.id)}
                        className={`flex items-start gap-2 p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                          m.completed
                            ? 'bg-slate-950/60 border-slate-900 text-slate-400'
                            : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60 text-slate-200'
                        }`}
                      >
                        <div className="pt-0.5">
                          {m.completed ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          )}
                        </div>
                        <span className={`flex-1 ${m.completed ? 'line-through' : ''}`}>
                          {m.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Roadmap Timeline View */}
      {activeTab === 'roadmap' && (
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-purple-500 before:via-cyan-400 before:to-slate-800 text-left">
          {filteredGoals.map((goal, gIdx) => (
            <div key={goal.id} className="relative">
              {/* Dot on vertical line */}
              <div className="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-slate-950 shadow-md shadow-cyan-400/50" />
              
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-mono text-cyan-400">
                    Phase {gIdx + 1} · {goal.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Target: {goal.targetDate}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">{goal.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{goal.description}</p>

                <div className="mt-3 space-y-1.5">
                  {goal.milestones.map((m, idx) => (
                    <div
                      key={m.id}
                      onClick={() => toggleMilestone(goal.id, m.id)}
                      className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer hover:text-white"
                    >
                      <span className="text-[10px] font-mono text-purple-400">{idx + 1}.</span>
                      <span className={m.completed ? 'line-through text-slate-500' : ''}>
                        {m.title}
                      </span>
                      {m.completed && <Check className="w-3 h-3 text-emerald-400 ml-auto" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Goal Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#0a0f1d] border border-slate-800 rounded-3xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white">
                {editingGoal ? 'Edit Goal' : 'Create Life Goal'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveGoal} className="space-y-3.5 text-left text-xs">
              <div>
                <label className="text-slate-400 font-medium block mb-1">Goal Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Become Senior Software Engineer, Half Marathon"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-1">Description & Purpose</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Specific measurable outcome & why this is essential"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-medium block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as GoalCategory)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="Career">Career</option>
                    <option value="Business">Business</option>
                    <option value="Skills">Skills</option>
                    <option value="Health">Health</option>
                    <option value="Spiritual Growth">Spiritual Growth</option>
                    <option value="Education">Education</option>
                    <option value="Financial">Financial</option>
                    <option value="Personal Growth">Personal Growth</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 font-medium block mb-1">Target Date</label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-1">
                  Milestones (1 per line)
                </label>
                <textarea
                  rows={4}
                  value={milestonesText}
                  onChange={(e) => setMilestonesText(e.target.value)}
                  placeholder="1. Step one&#10;2. Step two&#10;3. Final outcome"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 font-mono text-[11px] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-semibold text-xs shadow-md shadow-cyan-600/30 hover:opacity-95 transition-all"
              >
                {editingGoal ? 'Save Goal Changes' : 'Create Goal'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
