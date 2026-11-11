import React, { useState } from 'react';
import {
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  AlertCircle,
  Trash2,
  Edit2,
  X,
  Check,
  ChevronLeft,
} from 'lucide-react';
import { Task } from '../types';
import { soundManager } from '../utils/soundEffects';

interface TasksViewProps {
  tasks: Task[];
  onAddTask: (task: Task) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleTask: (taskId: string) => void;
  onBack: () => void;
  soundEnabled: boolean;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onToggleTask,
  onBack,
  soundEnabled,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('Today');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueTime, setDueTime] = useState('12:00');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [category, setCategory] = useState('Career');

  const todayStr = new Date().toISOString().split('T')[0];

  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowStr = tomorrowDate.toISOString().split('T')[0];

  const filters = ['Today', 'Tomorrow', 'Upcoming', 'Pending', 'Completed', 'All Tasks'];

  const filteredTasks = tasks.filter((t) => {
    if (activeFilter === 'Today') return t.dueDate === todayStr;
    if (activeFilter === 'Tomorrow') return t.dueDate === tomorrowStr;
    if (activeFilter === 'Upcoming') return t.dueDate > todayStr;
    if (activeFilter === 'Pending') return !t.completed;
    if (activeFilter === 'Completed') return t.completed;
    return true;
  });

  const openAddModal = () => {
    if (soundEnabled) soundManager.playClick();
    setEditingTask(null);
    setTitle('');
    setDescription('');
    setDueDate(todayStr);
    setDueTime('14:00');
    setPriority('medium');
    setCategory('Career');
    setIsAddModalOpen(true);
  };

  const openEditModal = (t: Task) => {
    if (soundEnabled) soundManager.playClick();
    setEditingTask(t);
    setTitle(t.title);
    setDescription(t.description);
    setDueDate(t.dueDate);
    setDueTime(t.dueTime);
    setPriority(t.priority);
    setCategory(t.category);
    setIsAddModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (soundEnabled) soundManager.playHabitDone();

    if (editingTask) {
      onUpdateTask({
        ...editingTask,
        title,
        description,
        dueDate,
        dueTime,
        priority,
        category,
      });
    } else {
      const newTask: Task = {
        id: `t_${Date.now()}`,
        title,
        description,
        dueDate,
        dueTime,
        priority,
        category,
        completed: false,
        isRecurring: false,
        reminder: true,
      };
      onAddTask(newTask);
    }
    setIsAddModalOpen(false);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-12 text-left">
      {/* Top Header with Back Button & Contextual Add */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Daily Tasks</h2>
            <p className="text-xs text-slate-400">Capture and execute priority work.</p>
          </div>
        </div>
        <button
          onClick={openAddModal}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-600/30 active:scale-95 transition-all"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => {
              if (soundEnabled) soundManager.playClick();
              setActiveFilter(f);
            }}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              activeFilter === f
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
            <p className="text-xs font-semibold text-white">No tasks matching "{activeFilter}"</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Enjoy your clear focus or add a new action item.</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                task.completed
                  ? 'bg-slate-950/60 border-slate-900 text-slate-500'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 text-white'
              }`}
            >
              <div className="flex items-start justify-between">
                <div
                  onClick={() => {
                    if (soundEnabled) soundManager.playClick();
                    onToggleTask(task.id);
                  }}
                  className="flex items-start gap-3 min-w-0 pr-2 cursor-pointer flex-1"
                >
                  <div
                    className={`w-5 h-5 rounded-lg border mt-0.5 flex items-center justify-center shrink-0 transition-all ${
                      task.completed
                        ? 'bg-emerald-500 border-emerald-500 text-black'
                        : 'border-slate-600 hover:border-slate-400'
                    }`}
                  >
                    {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div className="min-w-0">
                    <h4 className={`text-xs font-bold leading-snug ${task.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                      {task.title}
                    </h4>
                    {task.description && (
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400">
                      <span className="text-cyan-400">{task.category}</span>
                      <span>·</span>
                      <span className="font-mono">{task.dueDate} at {task.dueTime}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <span
                    className={`text-[9px] uppercase font-bold font-mono px-2 py-0.5 rounded-full ${
                      task.priority === 'high'
                        ? 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
                        : task.priority === 'medium'
                        ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {task.priority}
                  </span>
                  <button
                    onClick={() => openEditModal(task)}
                    className="w-7 h-7 rounded-lg text-slate-400 hover:text-white flex items-center justify-center"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="w-7 h-7 rounded-lg text-slate-400 hover:text-rose-400 flex items-center justify-center"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-[#0a0f1d] border border-slate-800 rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white">
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-left text-xs">
              <div>
                <label className="text-slate-400 font-medium block mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Context or acceptance criteria"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 font-medium block mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-medium block mb-1">Due Time</label>
                  <input
                    type="time"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 font-medium block mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 font-medium block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="Career">Career</option>
                    <option value="Business">Business</option>
                    <option value="Skills">Skills</option>
                    <option value="Health">Health</option>
                    <option value="Financial">Financial</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-semibold text-xs shadow-md shadow-cyan-600/30"
              >
                {editingTask ? 'Save Task' : 'Create Task'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
