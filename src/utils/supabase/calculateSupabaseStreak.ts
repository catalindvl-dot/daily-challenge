import type { DailyChallengeHistoryEntry } from "@/types/challenge";
import type { StreakData } from "@/utils/streak";

export function calculateSupabaseStreak(
  history: DailyChallengeHistoryEntry[],
  today: string,
): StreakData {
  if (history.length === 0) {
    return {
      currentStreak: 0,
      bestStreak: 0,
      lastCompletedDate: null,
    };
  }

  const dates = [...new Set(history.map((entry) => entry.date))].sort();

  let bestStreak = 1;
  let runningStreak = 1;

  for (let i = 1; i < dates.length; i++) {
    const previous = new Date(`${dates[i - 1]}T00:00:00`);
    const current = new Date(`${dates[i]}T00:00:00`);

    const difference =
      (current.getTime() - previous.getTime()) /
      (1000 * 60 * 60 * 24);

    if (difference === 1) {
      runningStreak += 1;
      bestStreak = Math.max(bestStreak, runningStreak);
    } else {
      runningStreak = 1;
    }
  }

  const lastCompletedDate = dates[dates.length - 1];

  const todayDate = new Date(`${today}T00:00:00`);
  const lastDate = new Date(`${lastCompletedDate}T00:00:00`);

  const daysSinceLastCompletion =
    (todayDate.getTime() - lastDate.getTime()) /
    (1000 * 60 * 60 * 24);

  let currentStreak = 0;

  if (daysSinceLastCompletion === 0 || daysSinceLastCompletion === 1) {
    currentStreak = 1;

    for (let i = dates.length - 1; i > 0; i--) {
      const current = new Date(`${dates[i]}T00:00:00`);
      const previous = new Date(`${dates[i - 1]}T00:00:00`);

      const difference =
        (current.getTime() - previous.getTime()) /
        (1000 * 60 * 60 * 24);

      if (difference === 1) {
        currentStreak += 1;
      } else {
        break;
      }
    }
  }

  return {
    currentStreak,
    bestStreak,
    lastCompletedDate,
  };
}