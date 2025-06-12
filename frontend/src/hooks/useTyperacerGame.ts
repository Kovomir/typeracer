import { useEffect, useRef, useState } from "react";

const WS_URL = "ws://localhost:3001";

type Player {
}

export function useTyperacerGame() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [gameText, setGameText] = useState("");
  const [input, setInput] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [gameState, setGameState] = useState("waiting");
  const [rankings, setRankings] = useState<any[]>([]);
  const [name, setName] = useState<string>("");
  const [hasJoined, setHasJoined] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!hasJoined || !name) return;
    const socket = new WebSocket(WS_URL);
    setWs(socket);
    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "join_game", playerName: name }));
    };
    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "game_joined") {
        setPlayerId(msg.playerId);
        setPlayers(msg.players);
        setGameState(msg.gameState);
      } else if (msg.type === "player_joined" || msg.type === "player_ready") {
        setPlayers(msg.players);
        setGameState(msg.gameState);
      } else if (msg.type === "game_started") {
        setGameText(msg.gameText);
        setPlayers(msg.players);
        setInput("");
        setGameState("active");
        setRankings([]);
        setIsReady(false);
        setTimeout(() => inputRef.current?.focus(), 100);
      } else if (msg.type === "player_progress") {
        setPlayers((prev) => prev.map(p => p.id === msg.playerId ? { ...p, progress: msg.progress, finished: msg.finished } : p));
      } else if (msg.type === "game_finished") {
        setGameState("finished");
        setRankings(msg.rankings);
      } else if (msg.type === "game_aborted") {
        setGameState("waiting");
        setPlayers(msg.players);
        setGameText("");
        setInput("");
        setRankings([]);
        setIsReady(false);
        setHasJoined(false);
      }
    };
    socket.onclose = () => setWs(null);
    return () => socket.close();
  }, [hasJoined, name]);

  function joinWithName(userName: string) {
    setName(userName);
    setHasJoined(true);
  }

  function sendReady() {
    if (ws) {
      ws.send(JSON.stringify({ type: "player_ready" }));
      setIsReady(true);
    }
  }

  useEffect(() => {
    if (ws && gameState === "lobby" && isReady) {
      // Already sent ready, do nothing
      return;
    }
  }, [ws, gameState, isReady]);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    if (!gameText) return;
    if (val.length > input.length) {
      const nextChar = gameText[input.length];
      if (val[val.length - 1] === nextChar) {
        const newInput = input + nextChar;
        setInput(newInput);
        ws?.send(JSON.stringify({ type: "typing_update", text: newInput }));
      }
    } else if (val.length < input.length) {
      setInput(val);
      ws?.send(JSON.stringify({ type: "typing_update", text: val }));
    }
  }

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
