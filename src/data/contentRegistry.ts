import type { GameType } from "@/types/challenge";

import { flightPathChallenges } from "@/data/flightPath";
import { priceGuessChallenges } from "@/data/priceGuess";
import { timelineChallenges } from "@/data/timeline";
import { visualRevealChallenges } from "@/data/visualReveal";
import { connectionChallenges } from "@/data/connection";

const contentRegistry: Record<
  GameType,
  Record<string, unknown>
> = {
  "flight-path": flightPathChallenges,
  "price-guess": priceGuessChallenges,
  timeline: timelineChallenges,
  "visual-reveal": visualRevealChallenges,
  connection: connectionChallenges,
};

export function hasChallengeContent(
  gameType: GameType,
  contentId: string,
): boolean {
  return contentId in contentRegistry[gameType];
}