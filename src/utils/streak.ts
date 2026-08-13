export type StreakData = {
  currentStreak: number;
  bestStreak: number;
  lastCompletedDate: string | null;
};

const STREAK_STORAGE_KEY = "dailyChallengeStreak";

const defaultStreak: StreakData = {
  currentStreak: 0,
  bestStreak: 0,
  lastCompletedDate: null,
};

export function getStreak(): StreakData {
  const storedStreak = localStorage.getItem(STREAK_STORAGE_KEY);

  if (!storedStreak) {
    return defaultStreak;
  }

  try {
    return JSON.parse(storedStreak) as StreakData;
  } catch {
    return defaultStreak;
  }
}

export function updateStreak(today: string): StreakData {
  const streak = getStreak();

  if (streak.lastCompletedDate === today) {
    return streak;
  }

  let currentStreak = 1;

  if (streak.lastCompletedDate) {
    const previousDate = new Date(`${streak.lastCompletedDate}T12:00:00`);
    const currentDate = new Date(`${today}T12:00:00`);

    const differenceInDays = Math.round(
      (currentDate.getTime() - previousDate.getTime()) /
        (1000 * 60 * 60 * 24),
    );

    if (differenceInDays === 1) {
      currentStreak = streak.currentStreak + 1;
    }
  }

  const updatedStreak: StreakData = {
    currentStreak,
    bestStreak: Math.max(streak.bestStreak, currentStreak),
    lastCompletedDate: today,
  };

  localStorage.setItem(
    STREAK_STORAGE_KEY,
    JSON.stringify(updatedStreak),
  );

  return updatedStreak;
}