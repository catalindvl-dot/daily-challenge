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
      "Solar System planets",
      "Planets in the Solar System",
    ],
  },

  "social-media": {
  clues: ["Instagram", "Facebook", "WhatsApp", "Messenger"],
  answer: "Meta",
  acceptedAnswers: [
    "Meta",
    "Meta Platforms",
    "Meta apps",
    "Meta applications",
    "Apps owned by Meta",
    "Applications owned by Meta",
    "Owned by Meta",
    "All owned by Meta",
    "Platforms owned by Meta",
    "Meta platforms",
    "Meta social media apps",
  ],
},

  "sportswear-brands": {
    clues: ["Nike", "Adidas", "Puma", "Reebok"],
    answer: "Sportswear brands",
    acceptedAnswers: [
      "Sportswear brands",
      "Sports brands",
      "Sport brands",
      "Athletic brands",
      "Athletic wear brands",
      "Sportswear",
      "Sports companies",
      "Shoe brands",
    ],
  },

  "streaming-services": {
    clues: ["Netflix", "Disney+", "Max", "Prime Video"],
    answer: "Streaming services",
    acceptedAnswers: [
      "Streaming services",
      "Streaming service",
      "Streaming platforms",
      "Streaming platform",
      "Streaming apps",
      "Video streaming services",
      "TV streaming services",
    ],
  },

  "programming-languages": {
    clues: ["Python", "Java", "C++", "JavaScript"],
    answer: "Programming languages",
    acceptedAnswers: [
      "Programming languages",
      "Programming language",
      "Coding languages",
      "Coding language",
      "Computer languages",
      "Computer programming languages",
    ],
  },

  "watch-brands": {
    clues: ["Rolex", "Omega", "Seiko", "Casio"],
    answer: "Watch brands",
    acceptedAnswers: [
      "Watch brands",
      "Watch brand",
      "Watches",
      "Watch companies",
      "Wristwatch brands",
      "Wristwatches",
    ],
  },

  rivers: {
    clues: ["Nile", "Amazon", "Danube", "Mississippi"],
    answer: "Rivers",
    acceptedAnswers: [
      "River",
      "Rivers",
      "Famous rivers",
      "Major rivers",
      "World rivers",
    ],
  },
};

export function getConnectionChallenge(id: string) {
  return connectionChallenges[id];
}