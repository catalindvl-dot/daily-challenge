export type GameType =
  | "flight-path"
  | "price-guess"
  | "timeline"
  | "visual-reveal"
  | "connection";

export type ChallengeStage = {
  id: number;
  type: GameType;
  title: string;
  description: string;
};
export type StageResult = {
  stageId: number;
  gameType: GameType;
  score: number;
};