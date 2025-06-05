import React from "react";
import { ListItem, ListItemText, Box, LinearProgress } from "@mui/material";

interface PlayerProgressProps {
  name: string;
  progress: number;
  finished: boolean;
  isCurrent: boolean;
}

export function PlayerProgress({ name, progress, finished, isCurrent }: PlayerProgressProps) {
  return (
    <ListItem style={isCurrent ? { background: '#e3f2fd' } : {}}>
      <ListItemText
        primary={name + (finished ? " (Finished)" : "")}
        secondary={`Progress: ${progress || 0}%`}
      />
      <Box width={120} mr={2}>
        <LinearProgress variant="determinate" value={progress || 0} />
      </Box>
    </ListItem>
  );
}
