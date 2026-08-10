export type TimelineEvent = {
  id: number;
  title: string;
  year: number;
};

export type TimelineChallenge = {
  events: TimelineEvent[];
};