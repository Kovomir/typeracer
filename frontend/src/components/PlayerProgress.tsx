import React from "react";
import { ListItem, Box, Typography } from "@mui/material";

interface PlayerProgressProps {
  name: string;
  charsTyped: number;
  totalChars: number;
  text: string;
  isCurrent: boolean;
}

export function PlayerProgress({ name, charsTyped, totalChars, text, isCurrent }: PlayerProgressProps) {
  const progress = (charsTyped / totalChars) * 100;
  
  return (
    <ListItem style={isCurrent ? { background: '#e3f2fd' } : {}}>
      <Box sx={{ width: '100%' }}>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography>{name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {charsTyped}/{totalChars} chars ({progress.toFixed(1)}%)
          </Typography>
        </Box>
        <Box 
          sx={{ 
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            position: 'relative',
            backgroundColor: '#f5f5f5',
            p: 1,
            borderRadius: 1,
            maxHeight: '3.6em',
            overflow: 'hidden'
          }}
        >
          <Box 
            component="span" 
            sx={{ 
              backgroundColor: '#90ee90',
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: `${progress}%`,
              transition: 'width 0.3s ease'
            }} 
          />
          <Box component="span" sx={{ position: 'relative', zIndex: 1 }}>
            {text}
          </Box>
        </Box>
      </Box>
    </ListItem>
  );
}
