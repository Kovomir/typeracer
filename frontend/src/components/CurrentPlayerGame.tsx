import React from "react";
import { Box, Typography, TextField, Paper } from "@mui/material";

interface CurrentPlayerGameProps {
  gameText: string;
  input: string;
  handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  gameState: string;
}

export const CurrentPlayerGame: React.FC<CurrentPlayerGameProps> = ({
  gameText,
  input,
  handleInput,
  inputRef,
  gameState,
}) => {
  // Calculate progress
  const progress = Math.round((input.length / gameText.length) * 100);
  const typedText = gameText.slice(0, input.length);
  const currentChar = gameText[input.length] || "";
  const remainingText = gameText.slice(input.length + 1);

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: "#f5f5f5" }}>
      {/* Current player progress */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          Your Progress: {progress}%
        </Typography>
        <Typography>
          {input.length} / {gameText.length} characters
        </Typography>
      </Box>

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
        // Prevent Backspace, Delete, and other unwanted keys
        onKeyDown={(e) => {
          if (e.key === 'Backspace' || e.key === 'Delete') {
            e.preventDefault();
          }
          // Prevent shortcuts
          if ((e.ctrlKey || e.metaKey) && 
              (e.key === 'a' || e.key === 'c' || e.key === 'v' || e.key === 'x')) {
            e.preventDefault();
          }
        }}
        // Prevent paste
        onPaste={(e) => {
          e.preventDefault();
        }}
        // Prevent text selection
        onSelect={(e) => {
          if (e.currentTarget instanceof HTMLInputElement && e.currentTarget.value != null) {
            const inputEl = e.currentTarget;
            const len = inputEl.value.length;
            // Move cursor to end and clear selection
            setTimeout(() => {
              inputEl.setSelectionRange(len, len);
            }, 0);
          }
        }}
        // Prevent context menu
        onContextMenu={(e) => e.preventDefault()}
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#fff",
            // Prevent text selection highlighting
            "& input": {
              userSelect: "none",
              WebkitUserSelect: "none",
              cursor: "default"
            }
          }
        }}
      />
    </Paper>
  );
};
