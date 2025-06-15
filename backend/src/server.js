import { handleMessage } from './game/ws_handlers.js';
import { connectionMap } from './game/state.js';
import { removePlayer } from './game/logic.js';
import {WebSocketServer} from "ws";

const wss = new WebSocketServer({ port: 3001 });

wss.on('connection', (ws) => {
  console.log('🔌 New connection established');
  console.log(`👥 Total connections: ${wss.clients.size}`);

  ws.on('message', (msg) => {
    try {
      const data = JSON.parse(msg);
      console.log(`📨 Received message: ${data.type}`);
      handleMessage(ws, data, connectionMap);
    } catch (err) {
      console.error('⚠️ Invalid message:', err.message);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Invalid message format'
      }));
    }
  }); 

  ws.on('close', () => {
    const player = connectionMap.get(ws);
    if (player) {
      removePlayer(player);
      connectionMap.delete(ws);
    }
    console.log('❎ Connection closed');
    console.log(`👥 Remaining connections: ${wss.clients.size}`);
  });

  ws.on('error', (err) => {
    console.error('❗ WebSocket error:', err);
  });
});

console.log('🟢 WebSocket server running on ws://localhost:3001');
