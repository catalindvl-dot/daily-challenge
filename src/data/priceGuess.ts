import type { PriceGuessChallenge } from "@/types/priceGuess";

export const priceGuessChallenges: Record<
  string,
  PriceGuessChallenge
> = {
  "premium-headphones": {
    name: "Premium Wireless Headphones",
    price: 550,
    currency: "$",
    startingGuess: 300,
  },

  "gaming-console": {
    name: "Gaming Console",
    price: 500,
    currency: "$",
    startingGuess: 300,
  },

  smartwatch: {
    name: "Smartwatch",
    price: 399,
    currency: "$",
    startingGuess: 250,
  },

  "robot-vacuum": {
    name: "Robot Vacuum",
    price: 699,
    currency: "$",
    startingGuess: 400,
  },

  "espresso-machine": {
    name: "Espresso Machine",
    price: 849,
    currency: "$",
    startingGuess: 500,
  },

  "55-inch-4k-tv": {
    name: "55-inch 4K TV",
    price: 799,
    currency: "$",
    startingGuess: 450,
  },

  "action-camera": {
    name: "Action Camera",
    price: 399,
    currency: "$",
    startingGuess: 250,
  },
};

export function getPriceGuessChallenge(id: string) {
  return priceGuessChallenges[id];
}