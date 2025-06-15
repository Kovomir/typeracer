import { useEffect, useRef, useState, useCallback } from "react";
import { useWebSocket } from "./useWebSocket";
import { GameState, Player, Ranking } from "../types/game";

export function useTyperacerGame() {
  const [gameText, setGameText] = useState("");
  const [input, setInput] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState>("waiting");
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [name, setName] = useState<string>("");
  const [hasJoined, setHasJoined] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>;

  const { isConnected, sendMessage, subscribeToMessages } = useWebSocket(name, hasJoined);

  const sendReady = useCallback(() => {
    sendMessage({
      type: "player_ready"
    });
  }, [sendMessage]);

  const joinWithName = useCallback((userName: string) => {
    setName(userName);
    setHasJoined(true);
  }, []);  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!gameText) return;
    
    // Prevent character deletion
    if (val.length > input.length) {
      const nextChar = gameText[input.length];
      const typedChar = val[val.length - 1];
      
      // Only update state and send message if the correct character was typed
      if (typedChar === nextChar) {
        const newInput = input + nextChar;
        setInput(newInput);
        sendMessage({ type: "typing_update", text: newInput });
      }
    }

    e.target.value = input;
  }, [gameText, input, sendMessage]);

  useEffect(() => {
    if (!isConnected) return;

    subscribeToMessages((msg) => {
      switch (msg.type) {
        case "game_joined":
          setPlayerId(msg.playerId);
          setPlayers(msg.players);
          setGameState(msg.gameState);
          break;
        case "player_joined":
        case "player_ready":
          setPlayers(msg.players);
          setGameState(msg.gameState);
          // Find current player in updated players list to sync ready state
          const currentPlayer = msg.players.find((p: Player) => p.id === playerId);
          if (currentPlayer) {
            setIsReady(currentPlayer.isReady || false);
          }
          break;
        case "game_started":
          setGameText(msg.gameText);
          setPlayers(msg.players);
          setInput("");
          setGameState("active");
          setRankings([]);
          setIsReady(false);
          setTimeout(() => inputRef.current?.focus(), 100);
          break;
        case "player_progress":
          setPlayers((prev) => 
            prev.map(p => p.id === msg.playerId 
              ? { ...p, progress: msg.progress, finished: msg.finished } 
              : p
            )
          );
          break;
        case "game_finished":
          setGameState("finished");
          setRankings(msg.rankings);
          break;
      }
    });
  }, [isConnected, playerId, subscribeToMessages]);

  return {
    gameText,
    input,
    setInput,
    handleInput,
    players,
    playerId,
    gameState,
    rankings,
    inputRef,
    name,
    setName,
    hasJoined,
    joinWithName,
    isReady,
    sendReady,
  };
}
