import type { ConnectionChallenge } from "@/types/connection";

export const connectionChallenges: Record<
  string,
  ConnectionChallenge
> = {
  planets: {
    clues: ["Mercury", "Venus", "Earth", "Mars"],
    answer: "Planets",
    acceptedAnswers: [
      "Planet",
      "Planets",
      "Planets in the Solar System",
    ],
  },

  "social-media": {
    clues: ["Instagram", "Facebook", "WhatsApp", "Messenger"],
    answer: "Meta",
    acceptedAnswers: [
      "Meta",
      "Meta Platforms",
      "Facebook",
    ],
  },
};

export function getConnectionChallenge(id: string) {
  return connectionChallenges[id];
}