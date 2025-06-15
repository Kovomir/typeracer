export type Player = {
  id: string;
  name: string;
  currentText: string;
  finished: boolean;
  isReady?: boolean;
  startTime?: number;
  finishTime?: number;
};

export type GameState = "waiting" | "lobby" | "active" | "finished";

export type Ranking = {
  playerId: string;
  playerName: string;
  time: number;
  rank: number;
  charsTyped: number;
  totalChars: number;
};

export type GameStatus = {
  gameText: string;
  players: Player[];
  playerId: string | null;
  gameState: GameState;
  rankings: Ranking[];
};