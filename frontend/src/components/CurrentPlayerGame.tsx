import React from "react";
import { Box, Typography, TextField, Paper, LinearProgress } from "@mui/material";

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
          Your Progress
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ width: 100, height: 10, borderRadius: 1 }} 
          />
          <Typography variant="body2" color="text.secondary">
            {input.length}/{gameText.length} ({progress}%)
          </Typography>
        </Box>
      </Box>

      {/* Text display area */}
      <Box 
        sx={{ 
          fontFamily: "monospace", 
          fontSize: "1.2rem", 
          lineHeight: 1.4,
          whiteSpace: "pre-wrap",
          mb: 2,
          backgroundColor: "#f5f5f5",
          p: 1.5,
          borderRadius: 1,
          minHeight: "5em",
          maxHeight: "7em",
          overflow: "auto"
        }}
      >
        <Box component="span" sx={{ backgroundColor: "#4caf50", color: "white" }}>
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
