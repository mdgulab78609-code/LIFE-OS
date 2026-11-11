import React, { useEffect, useState } from 'react';
import {
  LifeOSNotification,
  notificationService,
} from '../utils/notificationService';
import { Bell, CheckCircle2, Flame, Target, X } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

export const OneUiNotificationBanner: React.FC = () => {
  const [activeNotification, setActiveNotification] = useState<LifeOSNotification | null>(null);

  useEffect(() => {
    const unsubscribe = notificationService.subscribe((notif) => {
      setActiveNotification(notif);
      soundManager.playHabitDone();
      // Auto dismiss after 4 seconds
      const timer = setTimeout(() => {
        setActiveNotification((curr) => (curr?.id === notif.id ? null : curr));
      }, 4000);
      return () => clearTimeout(timer);
    });

    return unsubscribe;
  }, []);

  if (!activeNotification) return null;

  const getCategoryIcon = () => {
    switch (activeNotification.category) {
      case 'streak':
        return <Flame className="w-4 h-4 text-amber-400" />;
      case 'focus':
        return <Target className="w-4 h-4 text-purple-400" />;
      case 'goal':
        return <CheckCircle2 className="w-4 h-4 text-cyan-400" />;
      default:
        return <Bell className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="absolute top-2 inset-x-3 z-50 animate-oneui-banner pointer-events-auto">
      <div className="bg-slate-900/95 border border-slate-700/80 shadow-[0_12px_32px_rgba(0,0,0,0.6)] backdrop-blur-xl rounded-2xl p-3 flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
          {getCategoryIcon()}
        </div>

        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
              Samsung Galaxy A16 5G · Alert
            </span>
            <button
              onClick={() => setActiveNotification(null)}
              className="text-slate-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <h5 className="text-xs font-bold text-white tracking-tight mt-0.5 truncate">
            {activeNotification.title}
          </h5>
          <p className="text-[11px] text-slate-300 mt-0.5 leading-snug line-clamp-2">
            {activeNotification.body}
          </p>
        </div>
      </div>
    </div>
  );
};
