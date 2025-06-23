import React, {useEffect} from "react";
import {Box, Button, List, Typography} from "@mui/material";
import {Player} from "@/types/game";
import {PlayerInLoby} from "@/components/PlayerInLoby";

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
          <PlayerInLoby
            key={p.id}
            name={`${p.name} ${p.isReady ? "✓" : "✗"}`}
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
