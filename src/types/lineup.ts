export interface RecommendedPlayer {
  battingOrder: number;
  name: string;
  number: string;
  reasoning: string;
}

export interface RecommendedPitcher {
  name: string;
  number: string;
  reasoning: string;
}

export interface LineupRecommendResponse {
  lineup: RecommendedPlayer[];
  startingPitcher: RecommendedPitcher;
  overallReasoning: string;
  seasonUsed: number;
}
