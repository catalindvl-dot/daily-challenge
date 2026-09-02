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

  "car-brands": {
    clues: ["Toyota", "BMW", "Ford", "Ferrari"],
    answer: "Car brands",
    acceptedAnswers: [
      "Car brands",
      "Car brand",
      "Automotive brands",
      "Automobile brands",
      "Car manufacturers",
      "Automakers",
      "Auto brands",
    ],
  },

  "coffee-chains": {
    clues: ["Starbucks", "Costa Coffee", "Tim Hortons", "Dunkin"],
    answer: "Coffee chains",
    acceptedAnswers: [
      "Coffee chains",
      "Coffee chain",
      "Coffee shops",
      "Coffee shop chains",
      "Cafe chains",
      "Café chains",
    ],
  },

  "search-engines": {
    clues: ["Google", "Bing", "Yahoo", "DuckDuckGo"],
    answer: "Search engines",
    acceptedAnswers: [
      "Search engines",
      "Search engine",
      "Web search engines",
      "Internet search engines",
    ],
  },

  "luxury-fashion-brands": {
    clues: ["Gucci", "Prada", "Louis Vuitton", "Chanel"],
    answer: "Luxury fashion brands",
    acceptedAnswers: [
      "Luxury fashion brands",
      "Luxury brands",
      "Designer brands",
      "Fashion brands",
      "Luxury clothing brands",
      "High-end fashion brands",
    ],
  },

  "airlines": {
    clues: ["Emirates", "Lufthansa", "Qatar Airways", "KLM"],
    answer: "Airlines",
    acceptedAnswers: [
      "Airlines",
      "Airline",
      "Airline companies",
      "Air carriers",
      "Aviation companies",
    ],
  },

  "capital-cities": {
    clues: ["Paris", "Tokyo", "Ottawa", "Canberra"],
    answer: "Capital cities",
    acceptedAnswers: [
      "Capital cities",
      "Capital city",
      "Capitals",
      "World capitals",
      "National capitals",
      "Country capitals",
    ],
  },

  "smartphone-brands": {
    clues: ["Samsung", "Apple", "Xiaomi", "OnePlus"],
    answer: "Smartphone brands",
    acceptedAnswers: [
      "Smartphone brands",
      "Smartphone brand",
      "Phone brands",
      "Mobile phone brands",
      "Mobile brands",
      "Phone manufacturers",
    ],
  },

  "football-clubs": {
    clues: ["Real Madrid", "Barcelona", "Liverpool", "Bayern Munich"],
    answer: "Football clubs",
    acceptedAnswers: [
      "Football clubs",
      "Football club",
      "Soccer clubs",
      "Soccer teams",
      "Football teams",
      "European football clubs",
    ],
  },

  "mountain-ranges": {
    clues: ["Alps", "Himalayas", "Andes", "Rockies"],
    answer: "Mountain ranges",
    acceptedAnswers: [
      "Mountain ranges",
      "Mountain range",
      "Mountains",
      "Major mountain ranges",
      "Famous mountain ranges",
    ],
  },

  "operating-systems": {
    clues: ["Windows", "macOS", "Linux", "Android"],
    answer: "Operating systems",
    acceptedAnswers: [
      "Operating systems",
      "Operating system",
      "OS",
      "Computer operating systems",
      "Software operating systems",
    ],
  },
};

export function getConnectionChallenge(id: string) {
  return connectionChallenges[id];
}