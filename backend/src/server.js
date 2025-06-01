import { WebSocketServer } from 'ws';

const port = 3001;
const wss = new WebSocketServer({ port });

const players = [];
const MAX_PLAYERS = 4;

wss.on("connection", (ws) => {
  let player = null;

  ws.on("message", (msg) => {
    const data = JSON.parse(msg);

    if (data.type === "join") {
      if (players.length >= MAX_PLAYERS) {
        ws.send(JSON.stringify({ type: "error", message: "Game is full" }));
        ws.close();
        return;
      }

      player = {
        ws,      
        name: data.name,
        text: "",
      };
      players.push(player);

      console.log(`${player.name} joined. Total: ${players.length}`);
      return;
    }

    if (!player) {
      ws.send(JSON.stringify({ type: "error", message: "Please send join request first" }));
      return;
    }

    if (data.type === "typed") {
      player.text = data.text;
      const update = {
        type: "progress",
        players: players.map((p) => ({
          name: p.name,
          percent: Math.floor((p.text.length / 40) * 100),
        })),
      };

      players.forEach((p) => {
        if (p.ws.readyState === WebSocket.OPEN) {
          p.ws.send(JSON.stringify(update));
        }
      });
    }
  });

  ws.on("close", () => {
    if (player) {
      console.log(`${player.name} left.`);
      players.splice(players.indexOf(player), 1);
    }
  });
});

console.log(`🟢 WebSocket server running on ws://localhost:${port}`);
