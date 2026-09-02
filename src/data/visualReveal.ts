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

  "pyramids-of-giza": {
    image: "/visual-reveal/pyramids-of-giza.jpg",
    answer: "Pyramids of Giza",
    acceptedAnswers: [
      "Pyramids of Giza",
      "The Pyramids of Giza",
      "Giza Pyramids",
      "Egyptian Pyramids",
      "Pyramids",
    ],
  },

  "christ-the-redeemer": {
    image: "/visual-reveal/christ-the-redeemer.jpg",
    answer: "Christ the Redeemer",
    acceptedAnswers: [
      "Christ the Redeemer",
      "Christ Redeemer",
      "Cristo Redentor",
    ],
  },

  "leaning-tower-of-pisa": {
    image: "/visual-reveal/leaning-tower-of-pisa.jpg",
    answer: "Leaning Tower of Pisa",
    acceptedAnswers: [
      "Leaning Tower of Pisa",
      "The Leaning Tower of Pisa",
      "Pisa Tower",
      "Tower of Pisa",
    ],
  },

  "machu-picchu": {
    image: "/visual-reveal/machu-picchu.jpg",
    answer: "Machu Picchu",
    acceptedAnswers: [
      "Machu Picchu",
      "Machu Pichu",
    ],
  },

  "burj-khalifa": {
    image: "/visual-reveal/burj-khalifa.jpg",
    answer: "Burj Khalifa",
    acceptedAnswers: [
      "Burj Khalifa",
      "The Burj Khalifa",
    ],
  },

  stonehenge: {
    image: "/visual-reveal/stonehenge.jpg",
    answer: "Stonehenge",
    acceptedAnswers: [
      "Stonehenge",
      "Stone Henge",
    ],
  },

  "niagara-falls": {
    image: "/visual-reveal/niagara-falls.jpg",
    answer: "Niagara Falls",
    acceptedAnswers: [
      "Niagara Falls",
      "Niagara",
      "The Niagara Falls",
    ],
  },

  "sagrada-familia": {
    image: "/visual-reveal/sagrada-familia.jpg",
    answer: "Sagrada Família",
    acceptedAnswers: [
      "Sagrada Familia",
      "Sagrada Família",
      "La Sagrada Familia",
      "La Sagrada Família",
    ],
  },

  "mount-rushmore": {
    image: "/visual-reveal/mount-rushmore.jpg",
    answer: "Mount Rushmore",
    acceptedAnswers: [
      "Mount Rushmore",
      "Mt Rushmore",
      "Mt. Rushmore",
      "Mount Rushmore National Memorial",
    ],
  },

  "hollywood-sign": {
    image: "/visual-reveal/hollywood-sign.jpg",
    answer: "Hollywood Sign",
    acceptedAnswers: [
      "Hollywood Sign",
      "The Hollywood Sign",
      "Hollywood",
    ],
  },
};

export function getVisualRevealChallenge(id: string) {
  return visualRevealChallenges[id];
}