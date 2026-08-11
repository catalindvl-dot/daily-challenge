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
};

export function getPriceGuessChallenge(id: string) {
  return priceGuessChallenges[id];
}