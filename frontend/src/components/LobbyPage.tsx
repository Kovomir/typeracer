import React, { useEffect } from "react";
import { Box, Typography, Button, List } from "@mui/material";
import { PlayerProgress } from "./PlayerProgress";
import { Player } from "../types/game";

interface LobbyPageProps {
  name: string;
  players: Player[];
  playerId: string | null;
  isReady: boolean;
  sendReady: () => void;
}

const LobbyPage: React.FC<LobbyPageProps> = ({
  name,
  players,
  playerId,
  isReady,
  sendReady,
}) => {
  const currentPlayer = players.find((p) => p.id === playerId);
  const isCurrentPlayerReady = currentPlayer?.isReady || false;

  // Set up enter key listener
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !isCurrentPlayerReady) {
        sendReady();
      }
    };

    window.addEventListener("keyup", handleKeyPress);
    return () => {
      window.removeEventListener("keyup", handleKeyPress);
    };
  }, [sendReady, isCurrentPlayerReady]);

  return (
    <Box p={4} maxWidth={500} mx="auto">
      <Typography variant="h4" gutterBottom>
        Lobby
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Welcome, {name}!
      </Typography>
      <Button
        variant="contained"
        color={isCurrentPlayerReady ? "success" : "primary"}
        onClick={sendReady}
        sx={{ mb: 2 }}
      >
        Ready {isCurrentPlayerReady ? "✓" : "✗"}
      </Button>
      <Typography variant="h6" mt={2}>
        Players
      </Typography>
      <List>
        {players.map((p) => (
          <PlayerProgress
            key={p.id}
            name={`${p.name} ${p.isReady ? "✓" : "✗"}`}
            charsTyped={0}
            totalChars={0}
            text=""
            isCurrent={p.id === playerId}
          />
        ))}
      </List>
      <Typography variant="body2" color="text.secondary">
        {players.every((p) => p.isReady)
          ? "All players ready! Game starting..."
          : "Waiting for all players to be ready..."}
      </Typography>
    </Box>
  );
};

export default LobbyPage;
