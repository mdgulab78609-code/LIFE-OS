import {
  Habit,
  Goal,
  Task,
  SkillTrack,
  JournalEntry,
  BadHabit,
  LifeScore,
} from '../types';

export function calculateLifeScore(
  habits: Habit[],
  goals: Goal[],
  tasks: Task[],
  skills: SkillTrack[],
  journals: JournalEntry[],
  badHabits: BadHabit[]
): LifeScore {
  // 1. Study & Education (0-100)
  // Factors: Skill lessons completed ratio, hours logged vs target, Mind habits streak
  let studyPoints = 0;
  if (skills.length > 0) {
    const totalLessons = skills.reduce((acc, s) => acc + s.lessons.length, 0);
    const completedLessons = skills.reduce(
      (acc, s) => acc + s.lessons.filter((l) => l.completed).length,
      0
    );
    const lessonRatio = totalLessons > 0 ? (completedLessons / totalLessons) * 45 : 30;
    const hoursRatio =
      skills.reduce((acc, s) => {
        const targetMin = s.targetHours * 60;
        return acc + Math.min(1, s.loggedMinutes / (targetMin || 1));
      }, 0) / skills.length;
    studyPoints += lessonRatio + hoursRatio * 35;
  } else {
    studyPoints += 50;
  }
  const mindHabits = habits.filter((h) => h.category === 'Mind' || h.category === 'Skills');
  if (mindHabits.length > 0) {
    const avgStreak = mindHabits.reduce((acc, h) => acc + Math.min(30, h.currentStreak), 0) / (mindHabits.length * 30);
    studyPoints += avgStreak * 20;
  } else {
    studyPoints += 15;
  }
  const studyScore = Math.min(100, Math.max(20, Math.round(studyPoints)));

  // 2. Health & Fitness (0-100)
  // Factors: Health habits streak & completion, Health tasks done, Health bad habits clean
  let healthPoints = 0;
  const healthHabits = habits.filter((h) => h.category === 'Health');
  if (healthHabits.length > 0) {
    const avgStreak = healthHabits.reduce((acc, h) => acc + Math.min(30, h.currentStreak), 0) / (healthHabits.length * 30);
    healthPoints += avgStreak * 50;
  } else {
    healthPoints += 30;
  }
  const healthTasks = tasks.filter((t) => t.category === 'Health');
  if (healthTasks.length > 0) {
    const comp = healthTasks.filter((t) => t.completed).length / healthTasks.length;
    healthPoints += comp * 25;
  } else {
    healthPoints += 20;
  }
  const healthBadHabits = badHabits.filter((bh) => bh.name.toLowerCase().includes('sleep') || bh.name.toLowerCase().includes('drink') || bh.name.toLowerCase().includes('sugar'));
  if (healthBadHabits.length > 0) {
    const cleanRatio = healthBadHabits.reduce((acc, bh) => {
      const days = Math.floor((new Date().getTime() - new Date(bh.cleanSinceDate).getTime()) / (1000 * 60 * 60 * 24));
      return acc + Math.min(1, Math.max(0, days) / bh.targetAvoidanceDays);
    }, 0) / healthBadHabits.length;
    healthPoints += cleanRatio * 25;
  } else {
    healthPoints += 20;
  }
  const healthScore = Math.min(100, Math.max(25, Math.round(healthPoints)));

  // 3. Skills & Career (0-100)
  // Factors: Career/Business goals progress %, high priority task completion
  let careerPoints = 0;
  const careerGoals = goals.filter((g) => g.category === 'Career' || g.category === 'Business' || g.category === 'Financial');
  if (careerGoals.length > 0) {
    const avgProg = careerGoals.reduce((acc, g) => acc + g.progressPercentage, 0) / careerGoals.length;
    careerPoints += avgProg * 0.55;
  } else {
    careerPoints += 35;
  }
  const highTasks = tasks.filter((t) => t.priority === 'high');
  if (highTasks.length > 0) {
    const compHigh = highTasks.filter((t) => t.completed).length / highTasks.length;
    careerPoints += compHigh * 30;
  } else {
    careerPoints += 25;
  }
  careerPoints += 15; // baseline momentum
  const skillsScore = Math.min(100, Math.max(30, Math.round(careerPoints)));

  // 4. Spiritual Growth (0-100)
  // Factors: Spiritual habits streak, gratitude journal entries count
  let spiritualPoints = 0;
  const spiritualHabits = habits.filter((h) => h.category === 'Spiritual');
  if (spiritualHabits.length > 0) {
    const avgStreak = spiritualHabits.reduce((acc, h) => acc + Math.min(30, h.currentStreak), 0) / (spiritualHabits.length * 30);
    spiritualPoints += avgStreak * 50;
  } else {
    spiritualPoints += 35;
  }
  const recentJournals = journals.length;
  spiritualPoints += Math.min(35, recentJournals * 7);
  const calmMoods = journals.filter((j) => j.mood === 'Calm' || j.mood === 'Ecstatic').length;
  spiritualPoints += Math.min(15, calmMoods * 5);
  const spiritualScore = Math.min(100, Math.max(20, Math.round(spiritualPoints)));

  // 5. Personal Growth (0-100)
  // Factors: Overall habit completion rate, bad habits avoided days
  let personalPoints = 0;
  if (habits.length > 0) {
    const avgStreak = habits.reduce((acc, h) => acc + Math.min(30, h.currentStreak), 0) / (habits.length * 30);
    personalPoints += avgStreak * 45;
  } else {
    personalPoints += 30;
  }
  if (badHabits.length > 0) {
    const cleanAvg = badHabits.reduce((acc, bh) => {
      const days = Math.floor((new Date().getTime() - new Date(bh.cleanSinceDate).getTime()) / (1000 * 60 * 60 * 24));
      return acc + Math.min(1, Math.max(0, days) / (bh.targetAvoidanceDays || 30));
    }, 0) / badHabits.length;
    personalPoints += cleanAvg * 35;
  } else {
    personalPoints += 25;
  }
  personalPoints += Math.min(20, journals.length * 5);
  const personalScore = Math.min(100, Math.max(25, Math.round(personalPoints)));

  // Overall Score (Weighted average)
  const overallScore = Math.round(
    studyScore * 0.2 +
    healthScore * 0.25 +
    skillsScore * 0.25 +
    spiritualScore * 0.15 +
    personalScore * 0.15
  );

  const pillars = [
    { name: 'Study & Education', score: studyScore },
    { name: 'Health & Fitness', score: healthScore },
    { name: 'Skills & Career', score: skillsScore },
    { name: 'Spiritual Growth', score: spiritualScore },
    { name: 'Personal Growth', score: personalScore },
  ];

  pillars.sort((a, b) => b.score - a.score);
  const strongestArea = pillars[0].name;
  const weakestArea = pillars[pillars.length - 1].name;

  return {
    studyScore,
    healthScore,
    skillsScore,
    spiritualScore,
    personalScore,
    overallScore,
    strongestArea,
    weakestArea,
  };
}
