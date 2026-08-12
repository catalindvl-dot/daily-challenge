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
};

export function getVisualRevealChallenge(id: string) {
  return visualRevealChallenges[id];
}