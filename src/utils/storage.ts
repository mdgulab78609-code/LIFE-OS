import {
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
} from '../types';
import {
  INITIAL_USER,
  INITIAL_HABITS,
  INITIAL_GOALS,
  INITIAL_TASKS,
  INITIAL_ROUTINE,
  INITIAL_JOURNAL,
  INITIAL_SKILLS,
  INITIAL_BAD_HABITS,
  INITIAL_CHALLENGES,
  INITIAL_VISION,
} from '../data/initialData';

const STORAGE_KEYS = {
  USER: 'lifeos_user_v1',
  HABITS: 'lifeos_habits_v1',
  GOALS: 'lifeos_goals_v1',
  TASKS: 'lifeos_tasks_v1',
  ROUTINE: 'lifeos_routine_v1',
  JOURNAL: 'lifeos_journal_v1',
  SKILLS: 'lifeos_skills_v1',
  BAD_HABITS: 'lifeos_bad_habits_v1',
  CHALLENGES: 'lifeos_challenges_v1',
  VISION: 'lifeos_vision_v1',
  FOCUS_HISTORY: 'lifeos_focus_history_v1',
};

export function loadStoredData(): AppData {
  if (typeof window === 'undefined') {
    return {
      user: INITIAL_USER,
      habits: INITIAL_HABITS,
      goals: INITIAL_GOALS,
      tasks: INITIAL_TASKS,
      routine: INITIAL_ROUTINE,
      journal: INITIAL_JOURNAL,
      skills: INITIAL_SKILLS,
      badHabits: INITIAL_BAD_HABITS,
      challenges: INITIAL_CHALLENGES,
      vision: INITIAL_VISION,
      focusMinutesToday: 135,
    };
  }

  try {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    const habitsStr = localStorage.getItem(STORAGE_KEYS.HABITS);
    const goalsStr = localStorage.getItem(STORAGE_KEYS.GOALS);
    const tasksStr = localStorage.getItem(STORAGE_KEYS.TASKS);
    const routineStr = localStorage.getItem(STORAGE_KEYS.ROUTINE);
    const journalStr = localStorage.getItem(STORAGE_KEYS.JOURNAL);
    const skillsStr = localStorage.getItem(STORAGE_KEYS.SKILLS);
    const badHabitsStr = localStorage.getItem(STORAGE_KEYS.BAD_HABITS);
    const challengesStr = localStorage.getItem(STORAGE_KEYS.CHALLENGES);
    const visionStr = localStorage.getItem(STORAGE_KEYS.VISION);
    const focusStr = localStorage.getItem(STORAGE_KEYS.FOCUS_HISTORY);

    return {
      user: userStr ? JSON.parse(userStr) : INITIAL_USER,
      habits: habitsStr ? JSON.parse(habitsStr) : INITIAL_HABITS,
      goals: goalsStr ? JSON.parse(goalsStr) : INITIAL_GOALS,
      tasks: tasksStr ? JSON.parse(tasksStr) : INITIAL_TASKS,
      routine: routineStr ? JSON.parse(routineStr) : INITIAL_ROUTINE,
      journal: journalStr ? JSON.parse(journalStr) : INITIAL_JOURNAL,
      skills: skillsStr ? JSON.parse(skillsStr) : INITIAL_SKILLS,
      badHabits: badHabitsStr ? JSON.parse(badHabitsStr) : INITIAL_BAD_HABITS,
      challenges: challengesStr ? JSON.parse(challengesStr) : INITIAL_CHALLENGES,
      vision: visionStr ? JSON.parse(visionStr) : INITIAL_VISION,
      focusMinutesToday: focusStr ? JSON.parse(focusStr) : 135,
    };
  } catch (e) {
    console.error('Failed to load from storage, using initial data:', e);
    return {
      user: INITIAL_USER,
      habits: INITIAL_HABITS,
      goals: INITIAL_GOALS,
      tasks: INITIAL_TASKS,
      routine: INITIAL_ROUTINE,
      journal: INITIAL_JOURNAL,
      skills: INITIAL_SKILLS,
      badHabits: INITIAL_BAD_HABITS,
      challenges: INITIAL_CHALLENGES,
      vision: INITIAL_VISION,
      focusMinutesToday: 135,
    };
  }
}

export function saveAllData(data: {
  user: UserProfile;
  habits: Habit[];
  goals: Goal[];
  tasks: Task[];
  routine: RoutineActivity[];
  journal: JournalEntry[];
  skills: SkillTrack[];
  badHabits: BadHabit[];
  challenges: Challenge[];
  vision: VisionCard[];
  focusMinutesToday: number;
}) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(data.habits));
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(data.goals));
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(data.tasks));
    localStorage.setItem(STORAGE_KEYS.ROUTINE, JSON.stringify(data.routine));
    localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(data.journal));
    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(data.skills));
    localStorage.setItem(STORAGE_KEYS.BAD_HABITS, JSON.stringify(data.badHabits));
    localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(data.challenges));
    localStorage.setItem(STORAGE_KEYS.VISION, JSON.stringify(data.vision));
    localStorage.setItem(STORAGE_KEYS.FOCUS_HISTORY, JSON.stringify(data.focusMinutesToday));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export function exportBackupJSON(data: any) {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(data, null, 2)
  )}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute(
    'download',
    `LIFE_OS_Backup_${new Date().toISOString().split('T')[0]}.json`
  );
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function resetAllDataToDefault() {
  if (typeof window === 'undefined') return;
  Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  window.location.reload();
}
