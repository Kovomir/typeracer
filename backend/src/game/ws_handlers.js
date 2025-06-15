import {broadcastToAllPlayers, calculateProgress, generateGameText, getPlayersList,} from "./logic.js";
import {gameStates, MAX_PLAYERS, MIN_PLAYERS} from "./const.js";
import {gameState, players, currentGameText} from "./state.js";
import {calculateRankings} from "./rankings.js";
import crypto from "crypto";

export const handleMessage = (ws, data, connectionMap) => {
  let player = connectionMap.get(ws);

  switch (data.type) {
    case "join_game": {
      if (players.length >= MAX_PLAYERS) {
        ws.send(JSON.stringify({ type: "error", message: "Game is full" }));
        ws.close();
        return;
      }

      if (gameState.value === gameStates.ACTIVE) {
        ws.send(
          JSON.stringify({ type: "error", message: "Game already in progress" })
        );
        ws.close();
        return;
      }

      player = {
        id: crypto.randomUUID(),
        ws,
        name: data.playerName,
        isReady: false,
        progress: 0,
        currentText: "",
        finished: false,
        rank: null,
      };

      players.push(player);
      connectionMap.set(ws, player);

      if (
        players.length >= MIN_PLAYERS &&
        gameState.value === gameStates.WAITING
      ) {
        gameState.value = gameStates.LOBBY;
      }

      ws.send(
        JSON.stringify({
          type: "game_joined",
          playerId: player.id,
          gameState: gameState.value,
          players: getPlayersList(),
        })
      );

      broadcastToAllPlayers(players, {
        type: "player_joined",
        player: {
          id: player.id,
          name: player.name,
          isReady: false,
        },
        gameState: gameState.value,
        players: getPlayersList(),
      });

      break;
    }

    case "player_ready": {
      if (!player) {
        console.error('Player not found!')
        return;
      }
      player.isReady = true;

      const allReady = players.length >= MIN_PLAYERS && players.every((p) => p.isReady);
      
      if (allReady) {
        gameState.value = gameStates.ACTIVE;
        const gameText = generateGameText();
        const startTime = Date.now();
        
        // Reset all players' state for new game
        players.forEach(p => {
          p.progress = 0;
          p.currentText = "";
          p.finished = false;
          p.finishTime = null;
          p.startTime = startTime;
        });

        broadcastToAllPlayers(players, {
          type: "game_started",
          gameText,
          players: getPlayersList(),
          gameState: gameState.value,
        });
        return;
      }

      broadcastToAllPlayers(players, {
        type: "player_ready",
        players: getPlayersList(),
      });
      break;
    }

    case "typing_update": {
      if (!player || gameState.value !== gameStates.ACTIVE) return;
      
      player.currentText = data.text;
      calculateProgress(player);
      
      if (player.currentText.length === currentGameText.length && !player.finished) {
        player.finished = true;
        player.finishTime = Date.now() - player.startTime;
        
        // Check if all players finished
        const allFinished = players.every(p => p.finished);
        if (allFinished) {
          gameState.value = gameStates.FINISHED;
          const rankings = calculateRankings();
          broadcastToAllPlayers(players, {
            type: "game_finished",
            rankings,
            gameState: gameState.value,
          });
          return;
        }
      }

      broadcastToAllPlayers(players, {
        type: "player_progress",
        playerId: player.id,
        progress: player.progress,
        finished: player.finished,
      });
      break;
    }

    default:
      ws.send(
        JSON.stringify({ type: "error", message: "Unknown message type" })
      );
  }
};
