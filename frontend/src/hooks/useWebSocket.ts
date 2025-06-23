import {useEffect, useState} from "react";
import {WebSocketMessage, MessageHandler, WebSocketGameMessage} from "@/types/websocket";

// Get WebSocket URL from environment variables or use fallback
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001";

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
      handler(message as WebSocketGameMessage);
    };
  };

  return {
    isConnected,
    sendMessage,
    subscribeToMessages,
  };
}