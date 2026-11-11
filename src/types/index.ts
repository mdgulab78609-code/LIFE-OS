export type TabType = 'home' | 'habits' | 'goals' | 'calendar' | 'profile';

export type SubViewType = 
  | 'none'
  | 'tasks'
  | 'routine'
  | 'focus'
  | 'journal'
  | 'learning'
  | 'bad_habits'
  | 'life_score'
  | 'ai_planner'
  | 'challenges'
  | 'vision_board'
  | 'reports';

export type HabitCategory = 'Health' | 'Mind' | 'Career' | 'Spiritual' | 'Skills' | 'Personal';

export type HabitType = 'boolean' | 'numeric' | 'duration';

export type HabitFrequency = 'daily' | 'weekly' | 'custom';

export interface Habit {
  id: string;
  name: string;
  description: string;
  category: HabitCategory;
  icon: string;
  color: string; // Tailwind hex or color name
  startDate: string;
  reminderTime: string;
  frequency: HabitFrequency;
  daysOfWeek: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  targetValue: number; // e.g. 1 for boolean, 8 for glasses, 30 for minutes
  currentValue?: number; // logged today
  unit: string; // "times", "glasses", "mins", "pages"
  habitType: HabitType;
  currentStreak: number;
  longestStreak: number;
  completedDates: Record<string, number>; // date 'YYYY-MM-DD' -> value achieved
  isArchived: boolean;
  isPaused: boolean;
}

export type GoalCategory = 
  | 'Career'
  | 'Education'
  | 'Financial'
  | 'Health'
  | 'Personal Growth'
  | 'Skills'
  | 'Spiritual Growth'
  | 'Business';

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate: string;
  deliverable?: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  targetDate: string;
  priority: 'high' | 'medium' | 'low';
  progressPercentage: number;
  milestones: Milestone[];
  relatedHabits: string[];
  relatedTasks: string[];
  notes: string;
  status: 'active' | 'achieved' | 'paused';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  dueTime: string; // HH:mm
  priority: 'high' | 'medium' | 'low';
  category: string;
  completed: boolean;
  isRecurring: boolean;
  reminder: boolean;
}

export interface RoutineActivity {
  id: string;
  title: string;
  startTime: string; // "05:00 AM" or "05:00"
  endTime: string;   // "05:30 AM" or "05:30"
  category: 'Morning' | 'Work' | 'Learning' | 'Fitness' | 'Evening' | 'Sleep';
  icon: string;
  color: string;
  recurringDays: number[];
  completedToday: boolean;
}

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: string;
  mood: 'Ecstatic' | 'Productive' | 'Calm' | 'Rough' | 'Exhausted';
  learnToday: string;
  achieveToday: string;
  mistakes: string;
  improveTomorrow: string;
  generalDay: string;
  tags: string[];
  isLocked: boolean;
}

export interface FocusSession {
  id: string;
  date: string;
  durationMinutes: number;
  mode: 'pomodoro' | 'deep_work' | 'short_break' | 'custom';
  completedAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  completed: boolean;
  durationMinutes?: number;
}

export interface SkillTrack {
  id: string;
  name: string;
  category: string;
  targetHours: number;
  loggedMinutes: number;
  lessons: Lesson[];
  notes: string;
  resources: string[];
  deadline: string;
}

export interface RelapseRecord {
  date: string;
  reason: string;
}

export interface BadHabit {
  id: string;
  name: string;
  reasonToQuit: string;
  targetAvoidanceDays: number;
  cleanSinceDate: string; // YYYY-MM-DD
  relapses: RelapseRecord[];
  moneySavedPerDay: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  totalDays: 7 | 21 | 30 | 100;
  currentDay: number;
  startDate: string;
  completed: boolean;
  badgeName: string;
  badgeIcon: string;
}

export interface VisionCard {
  id: string;
  title: string;
  affirmation: string;
  targetYear: string;
  category: string;
  gradient: string;
  icon: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  tagline: string;
  pinCode: string; // 4 digits
  isPinEnabled: boolean;
  theme: 'dark' | 'amoled' | 'light';
  soundEnabled: boolean;
  notificationsEnabled: boolean;
}

export interface LifeScore {
  studyScore: number;
  healthScore: number;
  skillsScore: number;
  spiritualScore: number;
  personalScore: number;
  overallScore: number;
  strongestArea: string;
  weakestArea: string;
}

export interface AppData {
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
}

