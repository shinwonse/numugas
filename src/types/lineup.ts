export interface PlayerPosition {
  position: string;
  name: string;
  number: string;
  battingOrder: number;
}

export interface ImageTransform {
  scale: number;
  positionX: number;
  positionY: number;
}

export interface SavedLineup {
  id: string;
  name: string;
  savedAt: string;
  date: string;
  location: string;
  league: string;
  startingPitcher: string;
  startingPitcherNumber: string;
  manager: string;
  lineup: PlayerPosition[];
  playerImage: string | null;
  playerImageName: string;
  imageTransform: ImageTransform;
}

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
