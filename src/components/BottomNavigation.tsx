import React from 'react';
import { Home, CheckSquare, Target, CalendarDays, User } from 'lucide-react';
import { TabType } from '../types';
import { soundManager } from '../utils/soundEffects';

interface BottomNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  soundEnabled: boolean;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
  soundEnabled,
}) => {
  const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'habits', label: 'Habits', icon: CheckSquare },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleSelect = (id: TabType) => {
    if (soundEnabled) soundManager.playClick();
    onTabChange(id);
  };

  return (
    <nav
      className="shrink-0 h-16 bg-[#0a0e1a]/95 dark:bg-[#0a0e1a]/95 backdrop-blur-lg border-t border-slate-800/80 px-2 flex items-center justify-around z-40 select-none"
      aria-label="Main Navigation"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => handleSelect(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center py-1 transition-all duration-150 min-h-[44px] ${
              isActive
                ? 'text-cyan-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200 font-normal'
            }`}
          >
            <div className="relative flex items-center justify-center">
              <Icon
                className={`w-5 h-5 transition-transform duration-150 ${
                  isActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.8]'
                }`}
              />
              {isActive && (
                <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-cyan-400" />
              )}
            </div>
            <span
              className={`text-[10px] tracking-tight mt-1 whitespace-nowrap ${
                isActive ? 'text-cyan-400 font-medium' : 'text-slate-400'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
