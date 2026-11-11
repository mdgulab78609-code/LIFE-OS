import React from 'react';
import {
  Award,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  GraduationCap,
  Heart,
  Briefcase,
  Compass,
  User,
  ChevronLeft,
} from 'lucide-react';
import { LifeScore } from '../types';

interface LifeScoreViewProps {
  lifeScore: LifeScore;
  onBack: () => void;
}

export const LifeScoreView: React.FC<LifeScoreViewProps> = ({ lifeScore, onBack }) => {
  const pillars = [
    { name: 'Study & Education', score: lifeScore.studyScore, icon: GraduationCap, color: '#3b82f6' },
    { name: 'Health & Fitness', score: lifeScore.healthScore, icon: Heart, color: '#10b981' },
    { name: 'Skills & Career', score: lifeScore.skillsScore, icon: Briefcase, color: '#8b5cf6' },
    { name: 'Spiritual Growth', score: lifeScore.spiritualScore, icon: Compass, color: '#06b6d4' },
    { name: 'Personal Growth', score: lifeScore.personalScore, icon: User, color: '#f59e0b' },
  ];

  // Radar Polygon Math for 5 dimensions
  const center = 100;
  const radius = 75;
  const numSides = 5;

  const getCoordinates = (value: number, index: number) => {
    const angle = (Math.PI * 2 / numSides) * index - Math.PI / 2;
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const polygonPoints = pillars
    .map((p, i) => {
      const { x, y } = getCoordinates(p.score, i);
      return `${x},${y}`;
    })
    .join(' ');

  const gridCircles = [25, 50, 75, 100];

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-12 text-left">
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">LIFE SCORE</h2>
          <p className="text-xs text-slate-400">Algorithmic holistic balance across 5 human dimensions.</p>
        </div>
      </div>

      {/* Hero Score Box */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-[#12192e] to-[#0c1220] border border-slate-800 shadow-xl relative overflow-hidden flex items-center justify-between">
        <div>
          <span className="text-[11px] uppercase font-mono font-bold text-cyan-400 tracking-wider">
            Holistic Life Score
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-4xl font-extrabold font-mono text-white">
              {lifeScore.overallScore}
            </span>
            <span className="text-sm font-mono text-slate-400">/ 100</span>
          </div>
          <span className="text-xs text-emerald-400 font-medium block mt-1">
            {lifeScore.overallScore >= 80 ? 'Tier 1 Mastery' : 'High Performance Momentum'}
          </span>
        </div>

        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-500 p-0.5 shadow-lg shadow-purple-600/30 flex items-center justify-center">
          <div className="w-full h-full bg-[#080c16] rounded-[14px] flex items-center justify-center text-cyan-300">
            <Award className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* 5-Axis Spider / Radar Chart */}
      <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col items-center">
        <span className="text-xs font-bold text-white uppercase tracking-wider mb-2">
          5-Dimensional Equilibrium Radar
        </span>

        <div className="relative w-56 h-56 flex items-center justify-center my-2">
          <svg className="w-full h-full" viewBox="0 0 200 200">
            {/* Background Grid Rings */}
            {gridCircles.map((level) => {
              const points = Array.from({ length: numSides }, (_, i) => {
                const { x, y } = getCoordinates(level, i);
                return `${x},${y}`;
              }).join(' ');
              return (
                <polygon
                  key={level}
                  points={points}
                  className="stroke-slate-800 fill-transparent"
                  strokeWidth="1"
                />
              );
            })}

            {/* Radar Spoke Lines */}
            {Array.from({ length: numSides }).map((_, i) => {
              const { x, y } = getCoordinates(100, i);
              return (
                <line
                  key={i}
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  className="stroke-slate-800/80"
                  strokeWidth="1"
                />
              );
            })}

            {/* User Data Polygon */}
            <polygon
              points={polygonPoints}
              className="fill-purple-600/30 stroke-cyan-400"
              strokeWidth="2.5"
            />

            {/* Points */}
            {pillars.map((p, i) => {
              const { x, y } = getCoordinates(p.score, i);
              return (
                <circle
                  key={p.name}
                  cx={x}
                  cy={y}
                  r="3.5"
                  className="fill-cyan-300 stroke-slate-950"
                  strokeWidth="1.5"
                />
              );
            })}
          </svg>
        </div>

        <div className="grid grid-cols-2 gap-2 w-full mt-2">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <span className="text-[10px] text-slate-400 block font-mono">Strongest Pillar</span>
            <span className="text-xs font-bold text-emerald-400">{lifeScore.strongestArea}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <span className="text-[10px] text-slate-400 block font-mono">Growth Opportunity</span>
            <span className="text-xs font-bold text-amber-400">{lifeScore.weakestArea}</span>
          </div>
        </div>
      </div>

      {/* Breakdown List */}
      <div className="space-y-2.5">
        <span className="text-xs font-bold text-white uppercase tracking-wider block">
          Pillar Breakdown
        </span>

        {pillars.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.name}
              className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span className="font-semibold text-white">{p.name}</span>
                </div>
                <span className="font-mono font-bold text-white">{p.score} / 100</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${p.score}%`, backgroundColor: p.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
