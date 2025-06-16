import React from "react";
import {Box, Typography} from "@mui/material";
import {CurrentPlayerGame} from "./CurrentPlayerGame";
import {Player} from "@/types/game";
import {OtherPlayerProgress} from "./OtherPlayerProgress";

interface GamePageProps {
  gameText: string;
  input: string;
  handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  players: Player[];
  playerId: string | null;
  inputRef: React.RefObject<HTMLInputElement>;
  gameState: string;
}

const GamePage: React.FC<GamePageProps> = ({
  gameText,
  input,
  handleInput,
  players,
  playerId,
  inputRef,
  gameState,
}) => {
  const currentPlayer = players.find((p) => p.id === playerId);
  return (
    <Box p={4} maxWidth={800} mx="auto">
      <CurrentPlayerGame
        gameText={gameText}
        input={input}
        handleInput={handleInput}
        inputRef={inputRef}
        gameState={gameState}
      />
      {/* Other players progress */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Other Players Progress
        </Typography>
        {players
          .filter((player) => player.id !== currentPlayer?.id)
          .map((player) => (
            <Box key={player.id} sx={{ mb: 2 }}>
              <OtherPlayerProgress
                name={player.name}
                charsTyped={player.currentText?.length || 0}
                totalChars={gameText.length}
                text={gameText}
              />
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default GamePage;
