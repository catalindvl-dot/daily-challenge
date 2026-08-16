import type {
  ChallengeStage,
} from "@/types/challenge";
import { gameRegistry } from "@/data/gameRegistry";
import { hasChallengeContent } from "@/data/contentRegistry";
import type { DailyChallengeConfig } from "@/types/dailyChallenge";
import { challengeSchedule } from "@/data/challenges";

export type DailyChallenge = {
  id: string;
  date: string;
  stages: ChallengeStage[];
};

const dailyChallengeSchedule: DailyChallengeConfig[] =
  challengeSchedule;

function buildDailyChallenge(
  config: DailyChallengeConfig,
): DailyChallenge {
  const stages: ChallengeStage[] = config.stages.map(
    (stage, index) => {
      if (!hasChallengeContent(stage.type, stage.contentId)) {
        throw new Error(
          `Invalid contentId "${stage.contentId}" for game "${stage.type}" on ${config.date}.`,
        );
      }

      const game = gameRegistry[stage.type];

      return {
        id: index + 1,
        type: stage.type,
        title: game.title,
        description: game.description,
        contentId: stage.contentId,
      };
    },
  );

  return {
    id: config.date,
    date: config.date,
    stages,
  };
}

export const dailyChallenges: DailyChallenge[] =
  dailyChallengeSchedule.map(buildDailyChallenge);

export function getDailyChallenge(
  date: string,
): DailyChallenge | undefined {
  return dailyChallenges.find(
    (challenge) => challenge.date === date,
  );
}