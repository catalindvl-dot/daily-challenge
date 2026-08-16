import type { VisualRevealChallenge } from "@/types/visualReveal";

export const visualRevealChallenges: Record<
  string,
  VisualRevealChallenge
> = {
  "eiffel-tower": {
    image: "/visual-reveal/eiffel-tower.jpg",
    answer: "Eiffel Tower",
    acceptedAnswers: [
      "Eiffel Tower",
      "The Eiffel Tower",
      "Tour Eiffel",
    ],
  },

  "statue-of-liberty": {
    image: "/visual-reveal/statue-of-liberty.jpg",
    answer: "Statue of Liberty",
    acceptedAnswers: [
      "Statue of Liberty",
      "The Statue of Liberty",
      "Liberty Statue",
    ],
  },

  "big-ben": {
    image: "/visual-reveal/big-ben.jpg",
    answer: "Big Ben",
    acceptedAnswers: [
      "Big Ben",
      "Elizabeth Tower",
      "The Elizabeth Tower",
    ],
  },

  "taj-mahal": {
    image: "/visual-reveal/taj-mahal.jpg",
    answer: "Taj Mahal",
    acceptedAnswers: [
      "Taj Mahal",
      "The Taj Mahal",
    ],
  },

  "golden-gate-bridge": {
    image: "/visual-reveal/golden-gate-bridge.jpg",
    answer: "Golden Gate Bridge",
    acceptedAnswers: [
      "Golden Gate Bridge",
      "The Golden Gate Bridge",
      "Golden Gate",
    ],
  },

  "sydney-opera-house": {
    image: "/visual-reveal/sydney-opera-house.jpg",
    answer: "Sydney Opera House",
    acceptedAnswers: [
      "Sydney Opera House",
      "The Sydney Opera House",
      "Opera House Sydney",
    ],
  },

  colosseum: {
    image: "/visual-reveal/colosseum.jpg",
    answer: "Colosseum",
    acceptedAnswers: [
      "Colosseum",
      "The Colosseum",
      "Roman Colosseum",
      "Coliseum",
    ],
  },
};

export function getVisualRevealChallenge(id: string) {
  return visualRevealChallenges[id];
}