import type {
  DailyChallengeHistoryEntry,
  GameType,
} from "@/types/challenge";

export type GamePerformance = {
  gameType: GameType;
  averageScore: number;
  gamesPlayed: number;
};

export type ChallengeStats = {
  challengesPlayed: number;
  averageScore: number;
  bestScore: number;
  gamePerformance: GamePerformance[];
};

export function calculateChallengeStats(
  history: DailyChallengeHistoryEntry[],
): ChallengeStats {
  if (history.length === 0) {
    return {
      challengesPlayed: 0,
      averageScore: 0,
      bestScore: 0,
      gamePerformance: [],
    };
  }

  const challengesPlayed = history.length;

  const averageScore = Math.round(
    history.reduce(
      (sum, entry) => sum + entry.totalScore,
      0,
    ) / challengesPlayed,
  );

  const bestScore = Math.max(
    ...history.map((entry) => entry.totalScore),
  );

  const gameTypes: GameType[] = [
    "flight-path",
    "price-guess",
    "timeline",
    "visual-reveal",
    "connection",
  ];

  const gamePerformance = gameTypes
    .map((gameType) => {
      const scores = history.flatMap((entry) =>
        entry.results
          .filter((result) => result.gameType === gameType)
          .map((result) => result.score),
      );

      if (scores.length === 0) {
        return {
          gameType,
          averageScore: 0,
          gamesPlayed: 0,
        };
      }

      return {
        gameType,
        averageScore: Math.round(
          scores.reduce((sum, score) => sum + score, 0) /
            scores.length,
        ),
        gamesPlayed: scores.length,
      };
    });

  return {
    challengesPlayed,
    averageScore,
    bestScore,
    gamePerformance,
  };
}