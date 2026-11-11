import React, { useState } from 'react';
import {
  TrendingUp,
  Plus,
  Sparkles,
  Compass,
  ChevronLeft,
  X,
  Trash2,
} from 'lucide-react';
import { VisionCard } from '../types';
import { soundManager } from '../utils/soundEffects';

interface VisionBoardViewProps {
  vision: VisionCard[];
  onAddVision: (card: VisionCard) => void;
  onDeleteVision: (cardId: string) => void;
  onBack: () => void;
  soundEnabled: boolean;
}

export const VisionBoardView: React.FC<VisionBoardViewProps> = ({
  vision,
  onAddVision,
  onDeleteVision,
  onBack,
  soundEnabled,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [affirmation, setAffirmation] = useState('');
  const [targetYear, setTargetYear] = useState('2028');
  const [category, setCategory] = useState('Career');

  const gradients = [
    'from-purple-900/60 to-indigo-950/80',
    'from-emerald-950/80 to-teal-900/60',
    'from-cyan-950/80 to-blue-900/60',
    'from-amber-950/80 to-rose-950/60',
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (soundEnabled) soundManager.playHabitDone();

    const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
    const newCard: VisionCard = {
      id: `v_${Date.now()}`,
      title,
      affirmation,
      targetYear,
      category,
      gradient: randomGradient,
      icon: 'Sparkles',
    };

    onAddVision(newCard);
    setTitle('');
    setAffirmation('');
    setIsAddModalOpen(false);
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
            <h2 className="text-xl font-extrabold text-white tracking-tight">Future Self Vision</h2>
            <p className="text-xs text-slate-400">Anchor your subconscious in high-definition aspirations.</p>
          </div>
        </div>
        <button
          onClick={() => {
            if (soundEnabled) soundManager.playClick();
            setIsAddModalOpen(true);
          }}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-teal-600/30"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add Vision</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {vision.map((card) => (
          <div
            key={card.id}
            className={`p-5 rounded-3xl bg-gradient-to-br ${card.gradient} border border-white/10 shadow-xl flex flex-col justify-between min-h-[170px] relative overflow-hidden group`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase bg-white/10 px-2 py-0.5 rounded-full text-cyan-200">
                  {card.category} · Target {card.targetYear}
                </span>
                <h3 className="text-base font-bold text-white mt-2 leading-snug">{card.title}</h3>
              </div>
              <button
                onClick={() => onDeleteVision(card.id)}
                className="text-white/40 hover:text-rose-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-slate-200 italic mt-3 bg-black/20 p-2.5 rounded-xl border border-white/5 backdrop-blur-sm">
              "{card.affirmation}"
            </p>
          </div>
        ))}
      </div>

      {/* Add Vision Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-[#0a0f1d] border border-slate-800 rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white">Add Vision Card</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-left text-xs">
              <div>
                <label className="text-slate-400 font-medium block mb-1">Dream / Future State *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Financially Sovereign SaaS Founder"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-1">Affirmation (Present Tense)</label>
                <textarea
                  rows={2}
                  value={affirmation}
                  onChange={(e) => setAffirmation(e.target.value)}
                  placeholder="e.g. I create resilient systems that empower millions..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 font-medium block mb-1">Target Year</label>
                  <input
                    type="text"
                    value={targetYear}
                    onChange={(e) => setTargetYear(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-medium block mb-1">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold text-xs shadow-md"
              >
                Anchor Vision
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
