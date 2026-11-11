import React, { useState, useEffect } from 'react';
import {
  Brain,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Clock,
  Sparkles,
  ChevronLeft,
  Coffee,
  Waves,
  CloudRain,
  Radio,
} from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface FocusViewProps {
  onBack: () => void;
  onLogFocusSession: (minutes: number) => void;
  focusMinutesToday: number;
  soundEnabled: boolean;
}

export const FocusView: React.FC<FocusViewProps> = ({
  onBack,
  onLogFocusSession,
  focusMinutesToday,
  soundEnabled,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<number>(25); // minutes
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60); // seconds
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [ambientSound, setAmbientSound] = useState<'none' | 'binaural' | 'rain' | 'whitenoise'>('none');
  const [completedSessionsCount, setCompletedSessionsCount] = useState<number>(3);

  useEffect(() => {
    let timer: any = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      soundManager.stopAmbient();
      soundManager.playTimerComplete();
      onLogFocusSession(selectedDuration);
      setCompletedSessionsCount((c) => c + 1);
      setTimeLeft(selectedDuration * 60);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, selectedDuration, onLogFocusSession]);

  const toggleTimer = () => {
    if (soundEnabled) soundManager.playClick();
    if (!isRunning) {
      if (ambientSound !== 'none') {
        soundManager.startAmbient(ambientSound as any);
      }
      setIsRunning(true);
    } else {
      setIsRunning(false);
      soundManager.stopAmbient();
    }
  };

  const resetTimer = () => {
    if (soundEnabled) soundManager.playClick();
    setIsRunning(false);
    soundManager.stopAmbient();
    setTimeLeft(selectedDuration * 60);
  };

  const handleSelectMode = (mins: number) => {
    if (soundEnabled) soundManager.playClick();
    setIsRunning(false);
    soundManager.stopAmbient();
    setSelectedDuration(mins);
    setTimeLeft(mins * 60);
  };

  const handleAmbientChange = (mode: 'none' | 'binaural' | 'rain' | 'whitenoise') => {
    if (soundEnabled) soundManager.playClick();
    setAmbientSound(mode);
    if (isRunning) {
      if (mode === 'none') {
        soundManager.stopAmbient();
      } else {
        soundManager.startAmbient(mode as any);
      }
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const totalSeconds = selectedDuration * 60;
  const progressPercent = Math.round(((totalSeconds - timeLeft) / totalSeconds) * 100);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-12 text-left">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundManager.stopAmbient();
              onBack();
            }}
            className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Focus Mode</h2>
            <p className="text-xs text-slate-400">Deep work sessions with zero distractions.</p>
          </div>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex items-center justify-center gap-1.5 p-1 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs">
        <button
          onClick={() => handleSelectMode(25)}
          className={`flex-1 py-1.5 rounded-xl font-medium transition-colors ${
            selectedDuration === 25 ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          25m Pomodoro
        </button>
        <button
          onClick={() => handleSelectMode(50)}
          className={`flex-1 py-1.5 rounded-xl font-medium transition-colors ${
            selectedDuration === 50 ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          50m Deep Work
        </button>
        <button
          onClick={() => handleSelectMode(5)}
          className={`flex-1 py-1.5 rounded-xl font-medium transition-colors ${
            selectedDuration === 5 ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          5m Break
        </button>
      </div>

      {/* Hero Circular Animated Timer */}
      <div className="py-6 flex flex-col items-center justify-center relative">
        <div className="relative w-56 h-56 flex items-center justify-center">
          {/* Subtle Outer Glow */}
          {isRunning && (
            <div className="absolute inset-0 rounded-full bg-purple-600/10 blur-xl animate-pulse" />
          )}

          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="52"
              className="stroke-slate-800/80"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="60"
              cy="60"
              r="52"
              className="stroke-cyan-400 transition-all duration-500 ease-linear"
              strokeWidth="6"
              strokeDasharray={2 * Math.PI * 52}
              strokeDashoffset={2 * Math.PI * 52 * (1 - progressPercent / 100)}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
            <span className="text-4xl font-extrabold font-mono text-white tracking-wider">
              {timeFormatted}
            </span>
            <span className="text-xs text-purple-400 font-medium mt-1">
              {isRunning ? 'Flow State Active' : 'Ready to Immerse'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={resetTimer}
            className="w-11 h-11 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center active:scale-95 transition-all"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={toggleTimer}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-purple-600/30 hover:opacity-95 active:scale-95 transition-all"
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-white" />
                <span>Pause Session</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-white ml-0.5" />
                <span>Start Deep Work</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Ambient Audio Synthesizer */}
      <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
        <span className="text-xs font-bold text-white uppercase tracking-wider block">
          Synthesized Ambient Sound
        </span>
        <div className="grid grid-cols-4 gap-2 text-xs">
          {[
            { id: 'none', label: 'Mute', icon: VolumeX },
            { id: 'binaural', label: '40Hz Gamma', icon: Radio },
            { id: 'rain', label: 'Rainfall', icon: CloudRain },
            { id: 'whitenoise', label: 'White Noise', icon: Waves },
          ].map((item) => {
            const Icon = item.icon;
            const active = ambientSound === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleAmbientChange(item.id as any)}
                className={`py-2 rounded-xl flex flex-col items-center gap-1 border transition-all ${
                  active
                    ? 'bg-purple-950/60 border-purple-500/50 text-cyan-300 font-semibold'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[10px]">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Focus Stats Overview */}
      <div className="grid grid-cols-2 gap-2 text-left">
        <div className="p-3 rounded-2xl bg-[#0f172a] border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 block uppercase">Focus Today</span>
          <span className="text-xl font-bold font-mono text-cyan-400">
            {(focusMinutesToday / 60).toFixed(1)} hrs
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {completedSessionsCount} sessions completed
          </span>
        </div>
        <div className="p-3 rounded-2xl bg-[#0f172a] border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 block uppercase">Weekly Goal</span>
          <span className="text-xl font-bold font-mono text-purple-400">18.5 hrs</span>
          <span className="text-[10px] text-emerald-400 block mt-0.5">74% of 25h Target</span>
        </div>
      </div>
    </div>
  );
};
