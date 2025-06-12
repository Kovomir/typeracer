import {players, currentGameText, gameState} from './state.js';
import {GAME_TEXTS, gameStates, MAX_PLAYERS, MIN_PLAYERS} from './const.js';

export const getPlayersList = () => {
  return players.map(player => ({
    id: player.id,
    name: player.name,
    isReady: player.isReady,
    progress: player.progress,
    rank: player.rank
  }));
};

export const broadcastToAllPlayers = (playerList, message) => {
  const str = JSON.stringify(message);
  playerList.forEach(p => {
    if (p.ws.readyState === 1) {
      p.ws.send(str);
    }
  });
};

export const generateGameText = () => {
  const text = GAME_TEXTS[Math.floor(Math.random() * GAME_TEXTS.length)];
  currentGameText = text;
  return text;
};

export const calculateProgress = (player) => {
  player.progress = Math.round((player.currentText.length / currentGameText.length) * 100);
};

/**
 * Remove a player from the players list and notify others.
 */
export const removePlayer = (player) => {
  const index = players.findIndex((p) => p.id === player.id);
  if (index !== -1) {
    players.splice(index, 1);
    console.log(`❌ Player ${player.name} (${player.id}) disconnected`);
    console.log(`Remaining players: ${players.length}`);

    // Inform remaining players
    broadcastToAllPlayers(players, {
      type: "player_left",
      playerId: player.id,
      players: getPlayersList(),
      gameState: gameState.value,
    });

    // Reset to WAITING if players drop below minimum during LOBBY or ACTIVE
    if (
      players.length < MIN_PLAYERS &&
      gameState.value !== gameStates.WAITING
    ) {
      gameState.value = gameStates.WAITING;

      broadcastToAllPlayers(players, {
        type: "game_aborted",
        message: `Not enough players to continue. ${players.length}/${MAX_PLAYERS}`,
        players: getPlayersList(),
        gameState: gameState.value,
      });
    }
  }
};
