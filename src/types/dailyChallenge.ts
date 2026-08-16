import type { GameType } from "@/types/challenge";

export type DailyStageConfig = {
  type: GameType;
  contentId: string;
};

export type DailyChallengeConfig = {
  date: string;
  stages: DailyStageConfig[];
};