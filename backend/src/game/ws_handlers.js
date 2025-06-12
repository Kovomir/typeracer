import {broadcastToAllPlayers, calculateProgress, generateGameText, getPlayersList,} from "./logic.js";
import {gameStates, MAX_PLAYERS, MIN_PLAYERS} from "./const.js";
import {gameState, players} from "./state.js";
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
      if (!player || gameState.value !== gameStates.LOBBY) return;

      player.isReady = true;

      broadcastToAllPlayers(players, {
        type: "player_ready",
        playerId: player.id,
        players: getPlayersList(),
      });

      console.log(
        `${player.name} is ready! (${players.filter((p) => p.isReady).length}/${
          players.length
        })`
      );

      const allReady = players.every((p) => p.isReady);

      if (players.length >= MIN_PLAYERS && allReady) {
        gameState.value = gameStates.ACTIVE;
        const gameText = generateGameText();

        players.forEach((p) => {
          p.progress = 0;
          p.currentText = "";
          p.finished = false;
          p.rank = null;
        });

        broadcastToAllPlayers(players, {
          type: "game_started",
          gameText,
          players: getPlayersList(),
        });

        console.log("🟢 Game started with text:", gameText);
      }

      break;
    }

    case "typing_update": {
      if (!player || gameState.value !== gameStates.ACTIVE) return;

      player.currentText = data.text || "";
      calculateProgress(player);

      if (
        player.currentText.length >= currentGameText.length &&
        !player.finished
      ) {
        player.finished = true;
        console.log(`${player.name} finished!`);
      }

      broadcastToAllPlayers(players, {
        type: "player_progress",
        playerId: player.id,
        progress: player.progress,
        finished: player.finished,
      });

      const finished = players.some((p) => p.finished);

      if (finished) {
        gameState.value = gameStates.FINISHED;

        const sorted = [...players].sort((a, b) => {
          if (a.finished && !b.finished) return -1;
          if (!a.finished && b.finished) return 1;
          return b.progress - a.progress;
        });

        sorted.forEach((p, i) => (p.rank = i + 1));

        broadcastToAllPlayers(players, {
          type: "game_finished",
          rankings: getPlayersList().sort((a, b) => a.rank - b.rank),
        });

        console.log("🏁 Game finished");
      }

      break;
    }

    default:
      ws.send(
        JSON.stringify({ type: "error", message: "Unknown message type" })
      );
  }
};
