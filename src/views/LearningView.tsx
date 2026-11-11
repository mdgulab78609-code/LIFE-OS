import React, { useState } from 'react';
import {
  GraduationCap,
  Plus,
  Clock,
  CheckCircle2,
  Circle,
  ExternalLink,
  ChevronLeft,
  X,
  BookOpen,
  Trash2,
} from 'lucide-react';
import { SkillTrack, Lesson } from '../types';
import { soundManager } from '../utils/soundEffects';

interface LearningViewProps {
  skills: SkillTrack[];
  onAddSkill: (skill: SkillTrack) => void;
  onUpdateSkill: (skill: SkillTrack) => void;
  onDeleteSkill: (skillId: string) => void;
  onBack: () => void;
  soundEnabled: boolean;
}

export const LearningView: React.FC<LearningViewProps> = ({
  skills,
  onAddSkill,
  onUpdateSkill,
  onDeleteSkill,
  onBack,
  soundEnabled,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [skillName, setSkillName] = useState('');
  const [category, setCategory] = useState('Computer Science');
  const [targetHours, setTargetHours] = useState(50);
  const [notes, setNotes] = useState('');
  const [lessonsText, setLessonsText] = useState('Lesson 1: Foundations\nLesson 2: Core Patterns\nLesson 3: Advanced Projects');

  const handleSaveSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim()) return;

    if (soundEnabled) soundManager.playHabitDone();

    const parsedLessons: Lesson[] = lessonsText
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .map((title, i) => ({
        id: `les_${Date.now()}_${i}`,
        title,
        completed: false,
        durationMinutes: 60,
      }));

    const newSkill: SkillTrack = {
      id: `s_${Date.now()}`,
      name: skillName,
      category,
      targetHours: Number(targetHours) || 50,
      loggedMinutes: 0,
      lessons: parsedLessons,
      notes,
      resources: [],
      deadline: '2027-06-30',
    };

    onAddSkill(newSkill);
    setSkillName('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  const logHours = (skillId: string, minutes: number) => {
    if (soundEnabled) soundManager.playHabitDone();
    const target = skills.find((s) => s.id === skillId);
    if (!target) return;
    onUpdateSkill({
      ...target,
      loggedMinutes: target.loggedMinutes + minutes,
    });
  };

  const toggleLesson = (skillId: string, lessonId: string) => {
    if (soundEnabled) soundManager.playHabitDone();
    const target = skills.find((s) => s.id === skillId);
    if (!target) return;

    const updated = target.lessons.map((l) =>
      l.id === lessonId ? { ...l, completed: !l.completed } : l
    );
    onUpdateSkill({
      ...target,
      lessons: updated,
    });
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
            <h2 className="text-xl font-extrabold text-white tracking-tight">Skills & Learning</h2>
            <p className="text-xs text-slate-400">Master high-leverage technical craft.</p>
          </div>
        </div>
        <button
          onClick={() => {
            if (soundEnabled) soundManager.playClick();
            setIsAddModalOpen(true);
          }}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/30"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add Skill</span>
        </button>
      </div>

      <div className="space-y-4">
        {skills.map((skill) => {
          const loggedHours = (skill.loggedMinutes / 60).toFixed(1);
          const percent = Math.min(
            100,
            Math.round((skill.loggedMinutes / ((skill.targetHours || 1) * 60)) * 100)
          );
          const completedLessons = skill.lessons.filter((l) => l.completed).length;

          return (
            <div
              key={skill.id}
              className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">
                    {skill.category}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-0.5">{skill.name}</h3>
                </div>
                <button
                  onClick={() => onDeleteSkill(skill.id)}
                  className="text-slate-500 hover:text-rose-400 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Progress Bar & Quick Hour Log Buttons */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-mono">
                    {loggedHours}h / {skill.targetHours}h ({percent}%)
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => logHours(skill.id, 30)}
                      className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-semibold text-slate-200"
                    >
                      +30m
                    </button>
                    <button
                      onClick={() => logHours(skill.id, 60)}
                      className="px-2 py-0.5 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-[10px] font-semibold text-purple-200 border border-purple-500/30"
                    >
                      +1 hr
                    </button>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              {/* Lessons checklist */}
              <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                  Curriculum ({completedLessons}/{skill.lessons.length} Modules Completed)
                </span>
                {skill.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    onClick={() => toggleLesson(skill.id, lesson.id)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-800/60 text-xs text-slate-300 cursor-pointer"
                  >
                    {lesson.completed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    )}
                    <span className={lesson.completed ? 'line-through text-slate-500' : 'text-slate-200'}>
                      {lesson.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Skill Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-[#0a0f1d] border border-slate-800 rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white">Add New Skill</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSkill} className="space-y-3 text-left text-xs">
              <div>
                <label className="text-slate-400 font-medium block mb-1">Skill Name *</label>
                <input
                  type="text"
                  required
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  placeholder="e.g. C++, Java, System Design, DSA"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 font-medium block mb-1">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-medium block mb-1">Target Hours</label>
                  <input
                    type="number"
                    min={5}
                    value={targetHours}
                    onChange={(e) => setTargetHours(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-1">Modules / Lessons (1 per line)</label>
                <textarea
                  rows={3}
                  value={lessonsText}
                  onChange={(e) => setLessonsText(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-md"
              >
                Track Skill
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
