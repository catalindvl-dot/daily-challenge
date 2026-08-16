import type { GameType } from "@/types/challenge";

type GameDefinition = {
  title: string;
  description: string;
};

export const gameRegistry: Record<GameType, GameDefinition> = {
  "flight-path": {
    title: "Flight Path",
    description: "Find your way from one place to another.",
  },

  "price-guess": {
    title: "Price Guess",
    description: "How close can you get to the real price?",
  },

  timeline: {
    title: "Timeline",
    description: "Put the events in the correct order.",
  },

  "visual-reveal": {
    title: "Visual Reveal",
    description: "Can you recognize it before the full reveal?",
  },

  connection: {
    title: "Connection",
    description: "Find what connects the clues.",
  },
};