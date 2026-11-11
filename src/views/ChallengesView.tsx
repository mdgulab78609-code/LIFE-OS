import React from 'react';
import {
  Award,
  Flame,
  Zap,
  ShieldCheck,
  Trophy,
  Crown,
  ChevronLeft,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Challenge, Habit } from '../types';
import { soundManager } from '../utils/soundEffects';

interface ChallengesViewProps {
  challenges: Challenge[];
  habits: Habit[];
  onCheckInChallenge: (challengeId: string) => void;
  onBack: () => void;
  soundEnabled: boolean;
}

export const ChallengesView: React.FC<ChallengesViewProps> = ({
  challenges,
  habits,
  onCheckInChallenge,
  onBack,
  soundEnabled,
}) => {
  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'],
    });
  };

  const handleCheckIn = (cId: string) => {
    if (soundEnabled) soundManager.playStreakFanfare();
    triggerConfetti();
    onCheckInChallenge(cId);
  };

  const maxStreak = Math.max(...habits.map((h) => h.currentStreak), 0);
  const longestOverall = Math.max(...habits.map((h) => h.longestStreak), 0);

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
            <h2 className="text-xl font-extrabold text-white tracking-tight">Streaks & Challenges</h2>
            <p className="text-xs text-slate-400">Lock in permanent discipline through trial sprints.</p>
          </div>
        </div>
      </div>

      {/* Streak Hero Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-purple-950/60 border border-amber-500/30 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-mono font-bold text-amber-400">
            Discipline Multiplier
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold font-mono text-white">{maxStreak}</span>
            <span className="text-xs text-slate-300">Days Active Streak 🔥</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            Personal Longest Record: <strong>{longestOverall} Days</strong>
          </span>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/20">
          <Flame className="w-8 h-8 fill-amber-400" />
        </div>
      </div>

      {/* The 4 Iconic Challenges */}
      <div className="space-y-3">
        {challenges.map((c) => {
          const percent = Math.min(100, Math.round((c.currentDay / c.totalDays) * 100));

          return (
            <div
              key={c.id}
              className={`p-4 rounded-3xl border transition-all ${
                c.completed
                  ? 'bg-purple-950/40 border-purple-500/40'
                  : 'bg-slate-900/90 border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono uppercase bg-slate-800 px-2 py-0.5 rounded text-cyan-300 font-bold">
                      {c.totalDays}-Day Sprint
                    </span>
                    {c.completed && (
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Conquered
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1">{c.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{c.description}</p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-slate-800 flex items-center justify-center text-amber-400 shrink-0">
                  {c.totalDays === 7 && <Zap className="w-5 h-5" />}
                  {c.totalDays === 21 && <ShieldCheck className="w-5 h-5" />}
                  {c.totalDays === 30 && <Trophy className="w-5 h-5" />}
                  {c.totalDays === 100 && <Crown className="w-5 h-5" />}
                </div>
              </div>

              {/* Progress */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-300 font-mono">
                    Day {c.currentDay} of {c.totalDays} ({percent}%)
                  </span>
                  <span className="text-[10px] text-cyan-400">
                    Badge: <strong>{c.badgeName}</strong>
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              {!c.completed && (
                <button
                  onClick={() => handleCheckIn(c.id)}
                  className="w-full mt-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Check In for Today (Day {c.currentDay + 1})</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
