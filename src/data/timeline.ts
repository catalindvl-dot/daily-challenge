import type { TimelineChallenge } from "@/types/timeline";

export const timelineChallenges: Record<string, TimelineChallenge> = {
  "tech-history": {
    events: [
      {
        id: 1,
        title: "First iPhone released",
        year: 2007,
      },
      {
        id: 2,
        title: "YouTube launched",
        year: 2005,
      },
      {
        id: 3,
        title: "Berlin Wall fell",
        year: 1989,
      },
      {
        id: 4,
        title: "Wikipedia launched",
        year: 2001,
      },
    ],
  },

  "space-history": {
    events: [
      {
        id: 1,
        title: "Sputnik 1 launched",
        year: 1957,
      },
      {
        id: 2,
        title: "First human in space",
        year: 1961,
      },
      {
        id: 3,
        title: "Apollo 11 Moon landing",
        year: 1969,
      },
      {
        id: 4,
        title: "International Space Station construction began",
        year: 1998,
      },
    ],
  },
};

export function getTimelineChallenge(id: string) {
  return timelineChallenges[id];
}