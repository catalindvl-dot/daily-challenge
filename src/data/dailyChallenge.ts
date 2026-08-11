import type { ChallengeStage } from "@/types/challenge";

export type DailyChallenge = {
  id: string;
  date: string;
  stages: ChallengeStage[];
};

const august12Stages: ChallengeStage[] = [
  {
    id: 1,
    type: "flight-path",
    title: "Flight Path",
    description: "Find your way from one place to another.",
    contentId: "bucharest-tokyo",
  },
  {
    id: 2,
    type: "price-guess",
    title: "Price Guess",
    description: "How close can you get to the real price?",
    contentId: "premium-headphones",
  },
  {
    id: 3,
    type: "timeline",
    title: "Timeline",
    description: "Put the events in the correct order.",
    contentId: "tech-history",
  },
  {
    id: 4,
    type: "visual-reveal",
    title: "Visual Reveal",
    description: "Can you recognize it before the full reveal?",
    contentId: "eiffel-tower",
  },
  {
    id: 5,
    type: "connection",
    title: "Connection",
    description: "Find what connects the clues.",
    contentId: "planets",
  },
];

const august13Stages: ChallengeStage[] = [
  {
    id: 1,
    type: "timeline",
    title: "Timeline",
    description: "Put the events in the correct order.",
    contentId: "tech-history",
  },
  {
    id: 2,
    type: "flight-path",
    title: "Flight Path",
    description: "Find your way from one place to another.",
    contentId: "paris-new-york",
  },
  {
    id: 3,
    type: "connection",
    title: "Connection",
    description: "Find what connects the clues.",
    contentId: "planets",
  },
  {
    id: 4,
    type: "price-guess",
    title: "Price Guess",
    description: "How close can you get to the real price?",
    contentId: "gaming-console",
  },
  {
    id: 5,
    type: "visual-reveal",
    title: "Visual Reveal",
    description: "Can you recognize it before the full reveal?",
    contentId: "eiffel-tower",
  },
];

export const dailyChallenges: DailyChallenge[] = [
  {
    id: "2026-08-12",
    date: "2026-08-12",
    stages: august12Stages,
  },
  {
    id: "2026-08-13",
    date: "2026-08-13",
    stages: august13Stages,
  },
];

export function getDailyChallenge(date: string) {
  const challenge = dailyChallenges.find(
    (challenge) => challenge.date === date,
  );

  return challenge ?? dailyChallenges[0];
}