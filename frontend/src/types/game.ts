export type Player = {
  id: string;
  name: string;
  currentText: string;
  finished: boolean;
  isReady?: boolean;
  startTime?: number;
  finishTime?: number;
  progress?: number;
  charsTyped?: number;
  totalChars?: number;
};

export type GameState = "waiting" | "lobby" | "active" | "finished";

export type Ranking = {
  playerId: string;
  playerName: string;
  finishTime: number;
  rank: number;
  charsTyped: number;
  totalChars: number;
};
