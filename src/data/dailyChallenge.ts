import type { ChallengeStage } from "@/types/challenge";

export const dailyChallenge: ChallengeStage[] = [
  {
    id: 1,
    type: "flight-path",
    title: "Flight Path",
    description: "Find your way from one place to another.",
  },
  {
    id: 2,
    type: "price-guess",
    title: "Price Guess",
    description: "How close can you get to the real price?",
  },
  {
    id: 3,
    type: "timeline",
    title: "Timeline",
    description: "Put the events in the correct order.",
  },
  {
    id: 4,
    type: "visual-reveal",
    title: "Visual Reveal",
    description: "Can you recognize it before the full reveal?",
  },
  {
    id: 5,
    type: "connection",
    title: "Connection",
    description: "Find what connects the clues.",
  },
];