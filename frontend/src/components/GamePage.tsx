import React from "react";
import { Box, Typography, List, Paper } from "@mui/material";
import { CurrentPlayerGame } from "./CurrentPlayerGame";
import { Player } from "../types/game";
import { OtherPlayerProgress } from "./OtherPlayerProgress";

interface GamePageProps {
  gameText: string;
  input: string;
  handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  players: Player[];
  playerId: string | null;
  inputRef: React.RefObject<HTMLInputElement>;
  rankings: Array<{ playerId: string; playerName: string; time: number }>;
  gameState: string;
}

const GamePage: React.FC<GamePageProps> = ({
  gameText,
  input,
  handleInput,
  players,
  playerId,
  inputRef,
  rankings,
  gameState,
}) => {
  // Calculate the typed and remaining text for display
  const typedText = gameText.slice(0, input.length);
  const currentChar = gameText[input.length] || "";
  const remainingText = gameText.slice(input.length + 1);
  // Calculate current player's progress
  const progress = Math.round((input.length / gameText.length) * 100);
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
      {/* Rankings (shown when game is finished) */}
      {gameState === "finished" && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Final Rankings
          </Typography>
          <List>
            {rankings.map((rank, index) => (
              <Typography key={rank.playerId} variant="body1">
                {index + 1}. {rank.playerName} - {(rank.time / 1000).toFixed(2)}
                s
              </Typography>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default GamePage;
