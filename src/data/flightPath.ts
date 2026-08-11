import type { FlightPathChallenge } from "@/types/flightPath";

export const flightPathChallenges: Record<string, FlightPathChallenge> = {
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
};

export function getFlightPathChallenge(id: string) {
  return flightPathChallenges[id];
}