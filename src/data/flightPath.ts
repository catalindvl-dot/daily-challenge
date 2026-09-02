import type { FlightPathChallenge } from "@/types/flightPath";

export const flightPathChallenges: Record<
  string,
  FlightPathChallenge
> = {
  "bucharest-tokyo": {
    from: "Bucharest",
    to: "Tokyo",
    distanceKm: 8920,
  },

  "paris-new-york": {
    from: "Paris",
    to: "New York",
    distanceKm: 5837,
  },

  "london-paris": {
    from: "London",
    to: "Paris",
    distanceKm: 342,
  },

  "new-york-los-angeles": {
    from: "New York",
    to: "Los Angeles",
    distanceKm: 3950,
  },

  "madrid-cairo": {
    from: "Madrid",
    to: "Cairo",
    distanceKm: 3356,
  },

  "tokyo-singapore": {
    from: "Tokyo",
    to: "Singapore",
    distanceKm: 5300,
  },

  "rome-dubai": {
    from: "Rome",
    to: "Dubai",
    distanceKm: 4335,
  },

  "sydney-cape-town": {
    from: "Sydney",
    to: "Cape Town",
    distanceKm: 11034,
  },

  "buenos-aires-mexico-city": {
    from: "Buenos Aires",
    to: "Mexico City",
    distanceKm: 7373,
  },

  "berlin-lisbon": {
    from: "Berlin",
    to: "Lisbon",
    distanceKm: 2305,
  },

  "toronto-miami": {
    from: "Toronto",
    to: "Miami",
    distanceKm: 1980,
  },

  "istanbul-delhi": {
    from: "Istanbul",
    to: "Delhi",
    distanceKm: 4570,
  },

  "seoul-bangkok": {
    from: "Seoul",
    to: "Bangkok",
    distanceKm: 3665,
  },

  "amsterdam-athens": {
    from: "Amsterdam",
    to: "Athens",
    distanceKm: 2184,
  },

  "chicago-san-francisco": {
    from: "Chicago",
    to: "San Francisco",
    distanceKm: 2970,
  },

  "johannesburg-nairobi": {
    from: "Johannesburg",
    to: "Nairobi",
    distanceKm: 2912,
  },

  "vienna-stockholm": {
    from: "Vienna",
    to: "Stockholm",
    distanceKm: 1288,
  },
};

export function getFlightPathChallenge(id: string) {
  return flightPathChallenges[id];
}