import { players, gameState } from './state.js';

export const calculateRankings = () => {
  // Sort players by their status and progress
  const rankings = players.map(player => ({
    playerId: player.id,
    playerName: player.name,
    charsTyped: player.currentText.length,
    totalChars: gameState.currentText.length,
    finishTime: player.finishTime,
    isFinished: player.finished,
  }));

  // Sort first by finished status, then by chars typed
  rankings.sort((a, b) => {
    return b.charsTyped - a.charsTyped;
  });

  // Add rank
  return rankings.map((player, index) => ({
    ...player,
    rank: index + 1
  }));
};
