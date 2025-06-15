import {broadcastToAllPlayers, calculateProgress, generateGameText, getPlayersList,} from "./logic.js";
import {gameStates, MAX_PLAYERS, MIN_PLAYERS} from "./const.js";
import {gameState, players} from "./state.js";
import {calculateRankings} from "./rankings.js";
import crypto from "crypto";

export const handleMessage = (ws, data, connectionMap) => {
  try {
    let player = connectionMap.get(ws);

    // Log the incoming message with more context
    console.log('📨 Processing message:', {
      type: data.type,
      playerId: player?.id,
      playerName: player?.name,
      gameState: gameState.value
    });

    switch (data.type) {
      case "join_game": {
        if (players.length >= MAX_PLAYERS) {
          console.log(`❌ Player rejected: Game is full (${players.length}/${MAX_PLAYERS})`);
          ws.send(JSON.stringify({ type: "error", message: "Game is full" }));
          ws.close();
          return;
        }

        if (gameState.value === gameStates.ACTIVE) {
          console.log(`❌ Player rejected: Game in progress`);
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
        console.log(`✨ Player joined: ${player.name} (${player.id})`);
        console.log(`👥 Total players: ${players.length}`);

        if (
          players.length >= MIN_PLAYERS &&
          gameState.value === gameStates.WAITING
        ) {
          gameState.value = gameStates.LOBBY;
          console.log(`🎮 Game state changed to LOBBY (${players.length} players)`);
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
      }    case "player_ready": {
        if (!player) {
          console.error('❌ Player not found!')
          return;
        }

        // Toggle ready state
        const wasReady = player.isReady;
        player.isReady = !wasReady;
        console.log(`${player.isReady ? '✅' : '❌'} Player ${player.name} marked as ${player.isReady ? 'ready' : 'not ready'}`);
        console.log(`✅ Player ready: ${player.name} (${player.id})`);

        const readyPlayers = players.filter(p => p.isReady).length;
        console.log(`👥 Ready check: ${readyPlayers}/${players.length} players ready`);
        
        // First broadcast the player ready state
        broadcastToAllPlayers(players, {
          type: "player_ready",
          players: getPlayersList(),
          gameState: gameState.value
        });

        // Then check if all players are ready and we should start
        const allReady = players.length >= MIN_PLAYERS && players.every((p) => p.isReady);
        if (allReady) {
          gameState.value = gameStates.ACTIVE;
          const gameText = generateGameText();
          gameState.currentText = gameText;
          const startTime = Date.now();
          console.log(`🎯 Game starting with ${players.length} players`);
          console.log(`📝 Text length: ${gameText.length} characters`);
          
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
        }      broadcastToAllPlayers(players, {
          type: "player_ready",
          players: getPlayersList(),
          gameState: gameState.value
        });
        break;
      }

      case "typing_update": {
        if (!player || gameState.value !== gameStates.ACTIVE) return;
        
        player.currentText = data.text;
        calculateProgress(player);
        
        if (player.currentText.length === gameState.currentText.length && !player.finished) {
          player.finished = true;
          player.finishTime = Date.now() - player.startTime;
          console.log(`🏁 Player finished: ${player.name} (${player.id}) - Time: ${(player.finishTime / 1000).toFixed(2)}s`);
          
          // Check if all players finished
          const allFinished = players.every(p => p.finished);
          if (allFinished) {
            gameState.value = gameStates.FINISHED;
            const rankings = calculateRankings();
            console.log('🏆 Game finished! Final rankings:');
            rankings.forEach((rank, index) => {
              console.log(`   ${index + 1}. ${rank.playerName} - ${(rank.finishTime / 1000).toFixed(2)}s`);
            });
            
            broadcastToAllPlayers(players, {
              type: "game_finished",
              rankings,
              gameState: gameState.value,
            });
            return;
          }
        }

        // Only log progress every 10%
        if (player.progress % 10 === 0) {
          console.log(`📊 Progress update: ${player.name} - ${player.progress}%`);
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
        console.warn(`⚠️ Unknown message type received: ${data.type}`);
        ws.send(
          JSON.stringify({ type: "error", message: "Unknown message type" })
        );
    }
  } catch (err) {
    // Log detailed error information
    console.error('❌ Error in game handler:', {
      error: err.message,
      stack: err.stack,
      messageType: data?.type,
      gameState: gameState.value,
      playerId: connectionMap.get(ws)?.id,
      playerName: connectionMap.get(ws)?.name,
      totalPlayers: players.length,
      readyPlayers: players.filter(p => p.isReady).length,
      timestamp: new Date().toISOString()
    });

    // Send error details back to the client
    ws.send(JSON.stringify({
      type: 'error',
      message: `Game error: ${err.message}`,
      details: {
        type: data?.type,
        gameState: gameState.value,
        timestamp: new Date().toISOString()
      }
    }));
  }
};
