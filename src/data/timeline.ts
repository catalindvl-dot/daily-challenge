import type { TimelineChallenge } from "@/types/timeline";

export const timelineChallenges: Record<string, TimelineChallenge> = {
  "tech-history": {
    events: [
      {
        id: 1,
        title: "Wikipedia launched",
        year: 2001,
      },
      {
        id: 2,
        title: "YouTube launched",
        year: 2005,
      },
      {
        id: 3,
        title: "First iPhone released",
        year: 2007,
      },
      {
        id: 4,
        title: "Instagram launched",
        year: 2010,
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

  "world-history": {
    events: [
      {
        id: 1,
        title: "French Revolution began",
        year: 1789,
      },
      {
        id: 2,
        title: "American Civil War began",
        year: 1861,
      },
      {
        id: 3,
        title: "World War I began",
        year: 1914,
      },
      {
        id: 4,
        title: "Berlin Wall fell",
        year: 1989,
      },
    ],
  },

  "science-milestones": {
    events: [
      {
        id: 1,
        title: "Einstein published special relativity",
        year: 1905,
      },
      {
        id: 2,
        title: "Penicillin discovered",
        year: 1928,
      },
      {
        id: 3,
        title: "DNA double helix structure described",
        year: 1953,
      },
      {
        id: 4,
        title: "Dolly the sheep was born",
        year: 1996,
      },
    ],
  },

  "entertainment-history": {
    events: [
      {
        id: 1,
        title: "Star Wars released",
        year: 1977,
      },
      {
        id: 2,
        title: "The Simpsons premiered",
        year: 1989,
      },
      {
        id: 3,
        title: "Titanic released",
        year: 1997,
      },
      {
        id: 4,
        title: "Netflix launched streaming",
        year: 2007,
      },
    ],
  },

  "transport-history": {
    events: [
      {
        id: 1,
        title: "First powered airplane flight",
        year: 1903,
      },
      {
        id: 2,
        title: "Ford Model T introduced",
        year: 1908,
      },
      {
        id: 3,
        title: "First commercial jet airliner service",
        year: 1952,
      },
      {
        id: 4,
        title: "First Shinkansen high-speed rail service",
        year: 1964,
      },
    ],
  },

  "internet-era": {
    events: [
      {
        id: 1,
        title: "Google founded",
        year: 1998,
      },
      {
        id: 2,
        title: "Facebook launched",
        year: 2004,
      },
      {
        id: 3,
        title: "Twitter launched",
        year: 2006,
      },
      {
        id: 4,
        title: "TikTok launched internationally",
        year: 2017,
      },
    ],
  },
};

export function getTimelineChallenge(id: string) {
  return timelineChallenges[id];
}