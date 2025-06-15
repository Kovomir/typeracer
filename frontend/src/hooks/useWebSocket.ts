import { useEffect, useState } from "react";
import { Player } from "../types/game";

const WS_URL = "ws://localhost:3001";

type WebSocketMessage = {
  type: string;
  [key: string]: any;
};

type MessageHandler = (message: WebSocketMessage) => void;

export function useWebSocket(playerName: string, enabled: boolean) {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!enabled || !playerName) return;

    const socket = new WebSocket(WS_URL);
    setWs(socket);

    socket.onopen = () => {
      setIsConnected(true);
      socket.send(JSON.stringify({ type: "join_game", playerName }));
    };

    socket.onclose = () => {
      setWs(null);
      setIsConnected(false);
    };

    return () => {
      socket.close();
      setIsConnected(false);
    };
  }, [enabled, playerName]);

  const sendMessage = (message: WebSocketMessage) => {
    if (ws && isConnected) {
      ws.send(JSON.stringify(message));
    }
  };

  const subscribeToMessages = (handler: MessageHandler) => {
    if (!ws) return;

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      handler(message);
    };
  };

  return {
    isConnected,
    sendMessage,
    subscribeToMessages,
  };
}