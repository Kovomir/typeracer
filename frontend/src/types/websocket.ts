import { GameState, Player, Ranking } from "./game";

// Base WebSocket message type
export type WebSocketMessage = {
  type: string;
  [key: string]: unknown;
};

// Type for message handler function
export type MessageHandler = (message: WebSocketGameMessage) => void;

// Specific message types
export type GameJoinedMessage = {
  type: "game_joined";
  playerId: string;
  players: Player[];
  gameState: GameState;
};

export type PlayerUpdateMessage = {
  type: "player_joined" | "player_ready";
  players: Player[];
  gameState: GameState;
};

export type GameStartedMessage = {
  type: "game_started";
  gameText: string;
  players: Player[];
};

export type PlayerProgressMessage = {
  type: "player_progress";
  playerId: string;
  progress: number;
  charsTyped: number;
  totalChars: number;
  finished: boolean;
};

export type GameFinishedMessage = {
  type: "game_finished";
  rankings: Ranking[];
};

export type ErrorMessage = {
  type: "error";
  text: string;
};

// Union type of all game-specific WebSocket messages
export type WebSocketGameMessage =
  | GameJoinedMessage
  | PlayerUpdateMessage
  | GameStartedMessage
  | PlayerProgressMessage
  | GameFinishedMessage
  | ErrorMessage;
