/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  loadStoredData,
  saveAllData,
} from './utils/storage';
import { calculateLifeScore } from './utils/lifeScore';
import { soundManager } from './utils/soundEffects';
import { AndroidFrame } from './components/AndroidFrame';
import { HeaderBar } from './components/HeaderBar';
import { BottomNavigation } from './components/BottomNavigation';
import { VoiceInputModal } from './components/VoiceInputModal';
import { AndroidWidgetModal } from './components/AndroidWidgetModal';
import { AndroidExportModal } from './components/AndroidExportModal';
import { PinLockModal } from './components/PinLockModal';
import { BuildAndInstallModal } from './components/BuildAndInstallModal';
import { OneUiNotificationBanner } from './components/OneUiNotificationBanner';

// Views
import { HomeDashboard } from './views/HomeDashboard';
import { HabitsView } from './views/HabitsView';
import { GoalsView } from './views/GoalsView';
import { CalendarView } from './views/CalendarView';
import { ProfileView } from './views/ProfileView';

// Companion SubViews
import { TasksView } from './views/TasksView';
import { RoutineView } from './views/RoutineView';
import { FocusView } from './views/FocusView';
import { JournalView } from './views/JournalView';
import { LearningView } from './views/LearningView';
import { BadHabitsView } from './views/BadHabitsView';
import { LifeScoreView } from './views/LifeScoreView';
import { AiPlannerView } from './views/AiPlannerView';
import { ChallengesView } from './views/ChallengesView';
import { VisionBoardView } from './views/VisionBoardView';
import { ReportsView } from './views/ReportsView';

import {
  TabType,
  SubViewType,
  Habit,
  Goal,
  Task,
  RoutineActivity,
  JournalEntry,
  SkillTrack,
  BadHabit,
  Challenge,
  VisionCard,
  UserProfile,
  AppData,
} from './types';

export default function App() {
  const [data, setData] = useState<AppData>(() => loadStoredData());

  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [subView, setSubView] = useState<SubViewType>('none');

  // Modals state
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isBuildInstallModalOpen, setIsBuildInstallModalOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isPinLocked, setIsPinLocked] = useState(data.user.isPinEnabled);

  // Auto-save on data change
  useEffect(() => {
    saveAllData(data);
  }, [data]);

  // Sync theme with HTML class (Dark, Super AMOLED Pure Black, One UI Light)
  useEffect(() => {
    document.documentElement.classList.remove('dark', 'amoled', 'light');
    if (data.user.theme === 'amoled') {
      document.documentElement.classList.add('dark', 'amoled');
    } else if (data.user.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.add('light');
    }
  }, [data.user.theme]);

  // Android System Navigation (Hardware Back / Gesture Handling)
  const canGoBack =
    isBuildInstallModalOpen ||
    isVoiceModalOpen ||
    isWidgetModalOpen ||
    isExportModalOpen ||
    isPinModalOpen ||
    subView !== 'none' ||
    activeTab !== 'home';

  const handleSystemBack = () => {
    if (isBuildInstallModalOpen) {
      setIsBuildInstallModalOpen(false);
      return;
    }
    if (isVoiceModalOpen) {
      setIsVoiceModalOpen(false);
      return;
    }
    if (isWidgetModalOpen) {
      setIsWidgetModalOpen(false);
      return;
    }
    if (isExportModalOpen) {
      setIsExportModalOpen(false);
      return;
    }
    if (isPinModalOpen) {
      setIsPinModalOpen(false);
      return;
    }
    if (subView !== 'none') {
      setSubView('none');
      return;
    }
    if (activeTab !== 'home') {
      setActiveTab('home');
      return;
    }
  };

  const handleSystemHome = () => {
    setIsBuildInstallModalOpen(false);
    setIsVoiceModalOpen(false);
    setIsWidgetModalOpen(false);
    setIsExportModalOpen(false);
    setIsPinModalOpen(false);
    setSubView('none');
    setActiveTab('home');
  };

  // Listen to browser popstate (physical Android back button / swipe back gesture)
  useEffect(() => {
    const handlePopState = () => {
      if (canGoBack) {
        handleSystemBack();
        window.history.pushState(null, '', window.location.pathname);
      }
    };

    window.history.pushState(null, '', window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [canGoBack]);

  // Calculate dynamic Life Score
  const lifeScore = calculateLifeScore(
    data.habits,
    data.goals,
    data.tasks,
    data.skills,
    data.journal,
    data.badHabits
  );

  // Tab & SubView navigation handlers
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSubView('none');
  };

  const handleToggleTheme = () => {
    const nextTheme: 'dark' | 'amoled' | 'light' =
      data.user.theme === 'dark'
        ? 'amoled'
        : data.user.theme === 'amoled'
        ? 'light'
        : 'dark';
    setData((prev) => ({
      ...prev,
      user: { ...prev.user, theme: nextTheme },
    }));
  };

  const handleToggleSound = () => {
    setData((prev) => ({
      ...prev,
      user: { ...prev.user, soundEnabled: !prev.user.soundEnabled },
    }));
  };

  // Direct APK download link trigger
  const handleDirectApkDownload = () => {
    if (data.user.soundEnabled) soundManager.playHabitDone();
    const link = document.createElement('a');
    link.href = '/download/lifeos-release.apk';
    link.download = 'LIFE_OS_v1.0.0.apk';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Habit mutations
  const handleAddHabit = (newHabit: Habit) => {
    setData((prev) => ({ ...prev, habits: [newHabit, ...prev.habits] }));
  };

  const handleUpdateHabit = (updated: Habit) => {
    setData((prev) => ({
      ...prev,
      habits: prev.habits.map((h) => (h.id === updated.id ? updated : h)),
    }));
  };

  const handleDeleteHabit = (habitId: string) => {
    setData((prev) => ({
      ...prev,
      habits: prev.habits.filter((h) => h.id !== habitId),
    }));
  };

  const handleToggleHabitDay = (habitId: string, dateStr: string) => {
    setData((prev) => {
      const updated = prev.habits.map((h) => {
        if (h.id !== habitId) return h;
        const currentVal = h.completedDates[dateStr] ?? 0;
        const isDone = currentVal >= h.targetValue;
        const nextVal = isDone ? 0 : h.targetValue;
        const newCompleted = { ...h.completedDates, [dateStr]: nextVal };

        // recalculate streak
        let streak = h.currentStreak;
        if (!isDone) streak += 1;
        else streak = Math.max(0, streak - 1);

        return {
          ...h,
          completedDates: newCompleted,
          currentStreak: streak,
          longestStreak: Math.max(h.longestStreak, streak),
        };
      });
      return { ...prev, habits: updated };
    });
  };

  const handleStepHabitValue = (habitId: string, delta: number) => {
    const todayStr = new Date().toISOString().split('T')[0];
    setData((prev) => {
      const updated = prev.habits.map((h) => {
        if (h.id !== habitId) return h;
        const currentVal = h.completedDates[todayStr] ?? 0;
        const nextVal = Math.max(0, currentVal + delta);
        const isDone = nextVal >= h.targetValue;
        let streak = h.currentStreak;
        if (isDone && currentVal < h.targetValue) streak += 1;
        else if (!isDone && currentVal >= h.targetValue) streak = Math.max(0, streak - 1);

        return {
          ...h,
          completedDates: { ...h.completedDates, [todayStr]: nextVal },
          currentStreak: streak,
          longestStreak: Math.max(h.longestStreak, streak),
        };
      });
      return { ...prev, habits: updated };
    });
  };

  // Goal mutations
  const handleAddGoal = (newGoal: Goal) => {
    setData((prev) => ({ ...prev, goals: [newGoal, ...prev.goals] }));
  };

  const handleUpdateGoal = (updated: Goal) => {
    setData((prev) => ({
      ...prev,
      goals: prev.goals.map((g) => (g.id === updated.id ? updated : g)),
    }));
  };

  const handleDeleteGoal = (goalId: string) => {
    setData((prev) => ({
      ...prev,
      goals: prev.goals.filter((g) => g.id !== goalId),
    }));
  };

  // Task mutations
  const handleAddTask = (newTask: Task) => {
    setData((prev) => ({ ...prev, tasks: [newTask, ...prev.tasks] }));
  };

  const handleUpdateTask = (updated: Task) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === updated.id ? updated : t)),
    }));
  };

  const handleDeleteTask = (taskId: string) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId),
    }));
  };

  const handleToggleTask = (taskId: string) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      ),
    }));
  };

  // Routine mutations
  const handleAddRoutineActivity = (act: RoutineActivity) => {
    setData((prev) => ({ ...prev, routine: [...prev.routine, act] }));
  };

  const handleToggleRoutineActivity = (actId: string) => {
    setData((prev) => ({
      ...prev,
      routine: prev.routine.map((r) =>
        r.id === actId ? { ...r, completedToday: !r.completedToday } : r
      ),
    }));
  };

  const handleDeleteRoutineActivity = (actId: string) => {
    setData((prev) => ({
      ...prev,
      routine: prev.routine.filter((r) => r.id !== actId),
    }));
  };

  // Focus session log
  const handleLogFocusSession = (minutes: number) => {
    setData((prev) => ({
      ...prev,
      focusMinutesToday: prev.focusMinutesToday + minutes,
    }));
  };

  // Journal mutations
  const handleAddJournalEntry = (entry: JournalEntry) => {
    setData((prev) => ({ ...prev, journal: [entry, ...prev.journal] }));
  };

  const handleDeleteJournalEntry = (entryId: string) => {
    setData((prev) => ({
      ...prev,
      journal: prev.journal.filter((j) => j.id !== entryId),
    }));
  };

  // Skills mutations
  const handleAddSkill = (skill: SkillTrack) => {
    setData((prev) => ({ ...prev, skills: [skill, ...prev.skills] }));
  };

  const handleUpdateSkill = (updated: SkillTrack) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => (s.id === updated.id ? updated : s)),
    }));
  };

  const handleDeleteSkill = (skillId: string) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== skillId),
    }));
  };

  // Bad Habits mutations
  const handleAddBadHabit = (bh: BadHabit) => {
    setData((prev) => ({ ...prev, badHabits: [bh, ...prev.badHabits] }));
  };

  const handleRecordRelapse = (habitId: string, reason: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    setData((prev) => ({
      ...prev,
      badHabits: prev.badHabits.map((bh) =>
        bh.id === habitId
          ? {
              ...bh,
              cleanSinceDate: todayStr,
              relapses: [{ date: todayStr, reason }, ...bh.relapses],
            }
          : bh
      ),
    }));
  };

  const handleDeleteBadHabit = (habitId: string) => {
    setData((prev) => ({
      ...prev,
      badHabits: prev.badHabits.filter((bh) => bh.id !== habitId),
    }));
  };

  // Challenges check-in
  const handleCheckInChallenge = (challengeId: string) => {
    setData((prev) => ({
      ...prev,
      challenges: prev.challenges.map((c) => {
        if (c.id !== challengeId) return c;
        const nextDay = Math.min(c.totalDays, c.currentDay + 1);
        return {
          ...c,
          currentDay: nextDay,
          completed: nextDay >= c.totalDays,
        };
      }),
    }));
  };

  // Vision Card mutations
  const handleAddVision = (card: VisionCard) => {
    setData((prev) => ({ ...prev, vision: [card, ...prev.vision] }));
  };

  const handleDeleteVision = (cardId: string) => {
    setData((prev) => ({
      ...prev,
      vision: prev.vision.filter((v) => v.id !== cardId),
    }));
  };

  // User profile
  const handleUpdateUser = (updatedUser: UserProfile) => {
    setData((prev) => ({ ...prev, user: updatedUser }));
  };

  // Calculate today's overall progress %
  const todayStr = new Date().toISOString().split('T')[0];
  const activeHabits = data.habits.filter((h) => !h.isArchived && !h.isPaused);
  const doneHabits = activeHabits.filter(
    (h) => (h.completedDates[todayStr] ?? 0) >= h.targetValue
  ).length;
  const todayTasks = data.tasks.filter((t) => t.dueDate === todayStr);
  const doneTasks = todayTasks.filter((t) => t.completed).length;
  const totalGlance = activeHabits.length + todayTasks.length;
  const progressPercent = totalGlance > 0 ? Math.round(((doneHabits + doneTasks) / totalGlance) * 100) : 0;
  const maxStreak = Math.max(...data.habits.map((h) => h.currentStreak), 0);

  return (
    <AndroidFrame
      theme={data.user.theme}
      onBackPress={handleSystemBack}
      onHomePress={handleSystemHome}
      canGoBack={canGoBack}
    >
      <OneUiNotificationBanner />
      {/* Top Header Bar */}
      <HeaderBar
        title={
          subView !== 'none'
            ? subView.replace('_', ' ').toUpperCase()
            : activeTab === 'home'
            ? 'LIFE OS'
            : activeTab.toUpperCase()
        }
        subtitle="Plan Your Life. Build Habits. Achieve Dreams."
        onVoiceClick={() => setIsVoiceModalOpen(true)}
        onWidgetClick={() => setIsWidgetModalOpen(true)}
        onExportClick={() => setIsBuildInstallModalOpen(true)}
        theme={data.user.theme}
        onToggleTheme={handleToggleTheme}
        soundEnabled={data.user.soundEnabled}
      />



      {/* Main View Area */}
      <div className="flex-1 overflow-hidden flex flex-col relative bg-[#080c16]">
        {subView === 'tasks' && (
          <TasksView
            tasks={data.tasks}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onToggleTask={handleToggleTask}
            onBack={() => setSubView('none')}
            soundEnabled={data.user.soundEnabled}
          />
        )}

        {subView === 'routine' && (
          <RoutineView
            routine={data.routine}
            onAddActivity={handleAddRoutineActivity}
            onToggleActivity={handleToggleRoutineActivity}
            onDeleteActivity={handleDeleteRoutineActivity}
            onBack={() => setSubView('none')}
            soundEnabled={data.user.soundEnabled}
          />
        )}

        {subView === 'focus' && (
          <FocusView
            onBack={() => setSubView('none')}
            onLogFocusSession={handleLogFocusSession}
            focusMinutesToday={data.focusMinutesToday}
            soundEnabled={data.user.soundEnabled}
          />
        )}

        {subView === 'journal' && (
          <JournalView
            journal={data.journal}
            onAddEntry={handleAddJournalEntry}
            onDeleteEntry={handleDeleteJournalEntry}
            onBack={() => setSubView('none')}
            isPinLocked={isPinLocked}
            onOpenPinModal={() => setIsPinModalOpen(true)}
            soundEnabled={data.user.soundEnabled}
          />
        )}

        {subView === 'learning' && (
          <LearningView
            skills={data.skills}
            onAddSkill={handleAddSkill}
            onUpdateSkill={handleUpdateSkill}
            onDeleteSkill={handleDeleteSkill}
            onBack={() => setSubView('none')}
            soundEnabled={data.user.soundEnabled}
          />
        )}

        {subView === 'bad_habits' && (
          <BadHabitsView
            badHabits={data.badHabits}
            onAddBadHabit={handleAddBadHabit}
            onRecordRelapse={handleRecordRelapse}
            onDeleteBadHabit={handleDeleteBadHabit}
            onBack={() => setSubView('none')}
            soundEnabled={data.user.soundEnabled}
          />
        )}

        {subView === 'life_score' && (
          <LifeScoreView
            lifeScore={lifeScore}
            onBack={() => setSubView('none')}
          />
        )}

        {subView === 'ai_planner' && (
          <AiPlannerView
            goals={data.goals}
            habits={data.habits}
            tasks={data.tasks}
            onAddHabit={handleAddHabit}
            onBack={() => setSubView('none')}
            soundEnabled={data.user.soundEnabled}
          />
        )}

        {subView === 'challenges' && (
          <ChallengesView
            challenges={data.challenges}
            habits={data.habits}
            onCheckInChallenge={handleCheckInChallenge}
            onBack={() => setSubView('none')}
            soundEnabled={data.user.soundEnabled}
          />
        )}

        {subView === 'vision_board' && (
          <VisionBoardView
            vision={data.vision}
            onAddVision={handleAddVision}
            onDeleteVision={handleDeleteVision}
            onBack={() => setSubView('none')}
            soundEnabled={data.user.soundEnabled}
          />
        )}

        {subView === 'reports' && (
          <ReportsView
            habits={data.habits}
            goals={data.goals}
            tasks={data.tasks}
            skills={data.skills}
            focusMinutesToday={data.focusMinutesToday}
            onBack={() => setSubView('none')}
            soundEnabled={data.user.soundEnabled}
          />
        )}

        {/* Primary 5 Tabs */}
        {subView === 'none' && activeTab === 'home' && (
          <HomeDashboard
            user={data.user}
            habits={data.habits}
            goals={data.goals}
            tasks={data.tasks}
            focusMinutesToday={data.focusMinutesToday}
            lifeScore={lifeScore}
            onNavigateTab={handleTabChange}
            onNavigateSubView={(sv) => setSubView(sv)}
            onToggleHabit={(id) => handleToggleHabitDay(id, todayStr)}
            onToggleTask={handleToggleTask}
            soundEnabled={data.user.soundEnabled}
          />
        )}

        {subView === 'none' && activeTab === 'habits' && (
          <HabitsView
            habits={data.habits}
            onAddHabit={handleAddHabit}
            onUpdateHabit={handleUpdateHabit}
            onDeleteHabit={handleDeleteHabit}
            onToggleHabitDay={handleToggleHabitDay}
            onStepHabitValue={handleStepHabitValue}
            soundEnabled={data.user.soundEnabled}
          />
        )}

        {subView === 'none' && activeTab === 'goals' && (
          <GoalsView
            goals={data.goals}
            onAddGoal={handleAddGoal}
            onUpdateGoal={handleUpdateGoal}
            onDeleteGoal={handleDeleteGoal}
            soundEnabled={data.user.soundEnabled}
          />
        )}

        {subView === 'none' && activeTab === 'calendar' && (
          <CalendarView
            habits={data.habits}
            tasks={data.tasks}
            journal={data.journal}
            focusMinutesToday={data.focusMinutesToday}
            soundEnabled={data.user.soundEnabled}
          />
        )}

        {subView === 'none' && activeTab === 'profile' && (
          <ProfileView
            user={data.user}
            onUpdateUser={handleUpdateUser}
            allAppData={data}
            onOpenExportModal={() => setIsBuildInstallModalOpen(true)}
            onOpenPinModal={() => setIsPinModalOpen(true)}
            soundEnabled={data.user.soundEnabled}
            onToggleSound={handleToggleSound}
            theme={data.user.theme}
            onToggleTheme={handleToggleTheme}
          />
        )}
      </div>

      {/* STRICT BOTTOM NAVIGATION: EXACTLY 5 ITEMS */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        soundEnabled={data.user.soundEnabled}
      />

      {/* Interactive Modals */}
      <VoiceInputModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSaveHabit={handleAddHabit}
        onSaveTask={handleAddTask}
        soundEnabled={data.user.soundEnabled}
      />

      <AndroidWidgetModal
        isOpen={isWidgetModalOpen}
        onClose={() => setIsWidgetModalOpen(false)}
        habits={data.habits}
        tasks={data.tasks}
        onToggleHabit={(id) => handleToggleHabitDay(id, todayStr)}
        onToggleTask={handleToggleTask}
        streak={maxStreak}
        todayProgress={progressPercent}
        soundEnabled={data.user.soundEnabled}
      />

      <AndroidExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        soundEnabled={data.user.soundEnabled}
      />

      <BuildAndInstallModal
        isOpen={isBuildInstallModalOpen}
        onClose={() => setIsBuildInstallModalOpen(false)}
        soundEnabled={data.user.soundEnabled}
      />

      <PinLockModal
        isOpen={isPinModalOpen}
        correctPin={data.user.pinCode}
        onSuccess={() => {
          setIsPinLocked(false);
          setIsPinModalOpen(false);
        }}
        onClose={() => setIsPinModalOpen(false)}
        soundEnabled={data.user.soundEnabled}
      />
    </AndroidFrame>
  );
}
