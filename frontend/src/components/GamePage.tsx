import React from "react";
import { Box, Typography, TextField, List, Paper } from "@mui/material";
import { PlayerProgress } from "./PlayerProgress";
import { Player } from "../types/game";

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

  return (
    <Box p={4} maxWidth={800} mx="auto">
      <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: "#f5f5f5" }}>
        {/* Text display area */}
        <Box 
          sx={{ 
            fontFamily: "monospace", 
            fontSize: "1.2rem", 
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
            mb: 2 
          }}
        >
          <Box component="span" sx={{ backgroundColor: "#90ee90", color: "#000" }}>
            {typedText}
          </Box>
          <Box 
            component="span" 
            sx={{ 
              backgroundColor: currentChar ? "#ffeb3b" : "transparent",
              color: "#000",
              textDecoration: "underline"
            }}
          >
            {currentChar}
          </Box>
          <Box component="span" sx={{ color: "#666" }}>
            {remainingText}
          </Box>
        </Box>

        {/* Input field */}
        <TextField
          fullWidth
          variant="outlined"
          value={input}
          onChange={handleInput}
          inputRef={inputRef}
          disabled={gameState === "finished"}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#fff"
            }
          }}
        />
      </Paper>

      {/* Player progress list */}
      <Typography variant="h6" gutterBottom>
        Players Progress
      </Typography>
      <List>
        {players
          .sort((a, b) => (b.currentText?.length || 0) - (a.currentText?.length || 0))
          .map(player => (
            <PlayerProgress
              key={player.id}
              name={player.name}
              charsTyped={player.currentText?.length || 0}
              totalChars={gameText.length}
              text={gameText}
              isCurrent={player.id === playerId}
            />
          ))}
      </List>

      {/* Rankings (shown when game is finished) */}
      {gameState === "finished" && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Final Rankings
          </Typography>
          <List>
            {rankings.map((rank, index) => (
              <Typography key={rank.playerId} variant="body1">
                {index + 1}. {rank.playerName} - {(rank.time / 1000).toFixed(2)}s
              </Typography>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default GamePage;