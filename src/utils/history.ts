import type {
  DailyChallengeHistoryEntry,
  StageResult,
} from "@/types/challenge";

const HISTORY_STORAGE_KEY = "dailyChallengeHistory";
const RESULT_KEY_PREFIX = "dailyChallengeResults:";

export function getChallengeHistory(): DailyChallengeHistoryEntry[] {
  const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);

  if (!storedHistory) {
    return [];
  }

  try {
    return JSON.parse(storedHistory) as DailyChallengeHistoryEntry[];
  } catch {
    return [];
  }
}

export function saveChallengeHistoryEntry(
  date: string,
  results: StageResult[],
) {
  const history = getChallengeHistory();

  const alreadyExists = history.some(
    (entry) => entry.date === date,
  );

  if (alreadyExists) {
    return history;
  }

  const totalScore =
    results.length === 0
      ? 0
      : Math.round(
          results.reduce(
            (sum, result) => sum + result.score,
            0,
          ) / results.length,
        );

  const newEntry: DailyChallengeHistoryEntry = {
    date,
    totalScore,
    results,
  };

  const updatedHistory = [...history, newEntry].sort(
    (a, b) => a.date.localeCompare(b.date),
  );

  localStorage.setItem(
    HISTORY_STORAGE_KEY,
    JSON.stringify(updatedHistory),
  );

  return updatedHistory;
}

export function backfillChallengeHistory() {
  let history = getChallengeHistory();

  const existingDates = new Set(
    history.map((entry) => entry.date),
  );

  const newEntries: DailyChallengeHistoryEntry[] = [];

  for (let index = 0; index < localStorage.length; index++) {
    const key = localStorage.key(index);

    if (!key || !key.startsWith(RESULT_KEY_PREFIX)) {
      continue;
    }

    const date = key.replace(RESULT_KEY_PREFIX, "");

    if (existingDates.has(date)) {
      continue;
    }

    const storedResults = localStorage.getItem(key);

    if (!storedResults) {
      continue;
    }

    try {
      const results = JSON.parse(storedResults) as StageResult[];

      if (!Array.isArray(results) || results.length === 0) {
        continue;
      }

      const totalScore = Math.round(
        results.reduce(
          (sum, result) => sum + result.score,
          0,
        ) / results.length,
      );

      newEntries.push({
        date,
        totalScore,
        results,
      });

      existingDates.add(date);
    } catch {
      continue;
    }
  }

  if (newEntries.length === 0) {
    return history;
  }

  history = [...history, ...newEntries].sort(
    (a, b) => a.date.localeCompare(b.date),
  );

  localStorage.setItem(
    HISTORY_STORAGE_KEY,
    JSON.stringify(history),
  );

  return history;
}