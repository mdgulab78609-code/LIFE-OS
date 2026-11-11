import React from 'react';
import { Mic, Sun, Moon, LayoutGrid, Download, Bell, Smartphone } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';
import { notificationService } from '../utils/notificationService';

interface HeaderBarProps {
  title: string;
  subtitle?: string;
  onVoiceClick: () => void;
  onWidgetClick: () => void;
  onExportClick: () => void;
  theme: 'dark' | 'amoled' | 'light';
  onToggleTheme: () => void;
  soundEnabled: boolean;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  subtitle,
  onVoiceClick,
  onWidgetClick,
  onExportClick,
  theme,
  onToggleTheme,
  soundEnabled,
}) => {
  const triggerNotification = async () => {
    if (soundEnabled) soundManager.playClick();
    
    // Request permission if not yet decided
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      await notificationService.requestPermission();
    }

    // Dispatch Samsung One UI alert with haptic vibration
    notificationService.send(
      '⚡ Samsung Galaxy A16 5G · Daily Sync',
      'All 7 habits & 3 milestones synced offline. 90Hz Super AMOLED battery optimized.',
      'habit'
    );
  };

  return (
    <header className="shrink-0 h-14 px-4 bg-[#0a0e1a]/95 dark:bg-[#0a0e1a]/95 border-b border-slate-800/80 flex items-center justify-between z-30 select-none">
      <div className="flex flex-col min-w-0 pr-2">
        <h1 className="text-base font-bold text-white tracking-tight truncate flex items-center gap-1.5">
          <span>{title}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
        </h1>
        {subtitle && (
          <p className="text-[11px] text-slate-400 truncate">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {/* Voice Input Button */}
        <button
          onClick={() => {
            if (soundEnabled) soundManager.playClick();
            onVoiceClick();
          }}
          className="w-8 h-8 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 hover:text-purple-100 flex items-center justify-center transition-colors active:scale-95"
          title="Voice Command (Add habit or task)"
          aria-label="Voice Input"
        >
          <Mic className="w-4 h-4" />
        </button>

        {/* Android Widget Simulator */}
        <button
          onClick={() => {
            if (soundEnabled) soundManager.playClick();
            onWidgetClick();
          }}
          className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700/60 text-slate-300 hover:text-white flex items-center justify-center transition-colors active:scale-95"
          title="Android Home Screen Widgets"
          aria-label="Android Widgets"
        >
          <LayoutGrid className="w-4 h-4" />
        </button>

        {/* Android APK & Studio Source Export */}
        <button
          onClick={() => {
            if (soundEnabled) soundManager.playClick();
            onExportClick();
          }}
          className="w-8 h-8 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 hover:text-cyan-100 flex items-center justify-center transition-colors active:scale-95"
          title="Download Android APK & Studio Source Code"
          aria-label="Download Android Source"
        >
          <Download className="w-4 h-4" />
        </button>

        {/* Notification Test */}
        <button
          onClick={triggerNotification}
          className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700/60 text-slate-400 hover:text-amber-300 flex items-center justify-center transition-colors active:scale-95"
          title="Test Notification"
          aria-label="Test Notification"
        >
          <Bell className="w-4 h-4" />
        </button>

        {/* Theme Toggle (Dark -> AMOLED Pure Black -> Light) */}
        <button
          onClick={() => {
            if (soundEnabled) soundManager.playClick();
            onToggleTheme();
          }}
          className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors active:scale-95 ${
            theme === 'amoled'
              ? 'bg-black border-emerald-500/50 text-emerald-400'
              : theme === 'light'
              ? 'bg-slate-200 border-slate-300 text-slate-800'
              : 'bg-slate-900 border-slate-700/60 text-slate-300 hover:text-white'
          }`}
          title={`Theme: ${theme.toUpperCase()} (Click to change: Dark -> AMOLED -> Light)`}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Moon className="w-4 h-4 text-cyan-300" />
          ) : theme === 'amoled' ? (
            <span className="text-[9px] font-mono font-extrabold text-emerald-400">OLED</span>
          ) : (
            <Sun className="w-4 h-4 text-amber-500" />
          )}
        </button>
      </div>
    </header>
  );
};
