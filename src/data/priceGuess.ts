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

  "gaming-laptop": {
    name: "Gaming Laptop",
    price: 1499,
    currency: "$",
    startingGuess: 900,
  },

  "electric-scooter": {
    name: "Electric Scooter",
    price: 649,
    currency: "$",
    startingGuess: 400,
  },

  "mirrorless-camera": {
    name: "Mirrorless Camera",
    price: 999,
    currency: "$",
    startingGuess: 600,
  },

  "wireless-speaker": {
    name: "Premium Wireless Speaker",
    price: 349,
    currency: "$",
    startingGuess: 200,
  },

  "air-fryer": {
    name: "Air Fryer",
    price: 199,
    currency: "$",
    startingGuess: 120,
  },

  "mechanical-keyboard": {
    name: "Mechanical Gaming Keyboard",
    price: 179,
    currency: "$",
    startingGuess: 100,
  },

  drone: {
    name: "Camera Drone",
    price: 759,
    currency: "$",
    startingGuess: 450,
  },

  "portable-projector": {
    name: "Portable Projector",
    price: 499,
    currency: "$",
    startingGuess: 300,
  },

  "standing-desk": {
    name: "Electric Standing Desk",
    price: 599,
    currency: "$",
    startingGuess: 350,
  },

  "cordless-vacuum": {
    name: "Premium Cordless Vacuum",
    price: 649,
    currency: "$",
    startingGuess: 400,
  },
};

export function getPriceGuessChallenge(id: string) {
  return priceGuessChallenges[id];
}