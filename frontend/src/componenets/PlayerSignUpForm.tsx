import { Box, Button, Input } from "@mui/material";
import React, { useState } from "react";

export const PlayerSignUpForm = () => {
  const [playerName, setPlayerName] = useState("");

  return (
    <Box component="section">
      <Input
        type="text"
        placeholder="Enter your name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />
      <Button
        variant="contained"
        onClick={(e) => {
          e.preventDefault();
          // Handle player sign-up logic here
          console.log(`Player signed up: ${playerName}`);
        }}
      >
        Join Game
      </Button>
    </Box>
  );
};

export default PlayerSignUpForm;
