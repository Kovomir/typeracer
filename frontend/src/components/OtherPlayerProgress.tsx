import { Box, Paper, Typography, LinearProgress } from "@mui/material";

interface OtherPlayerProgressProps {
  name: string;
  charsTyped: number;
  totalChars: number;
  text: string;
}

export const OtherPlayerProgress = ({
  name,
  charsTyped,
  totalChars,
  text,
}: OtherPlayerProgressProps) => {
  const progress = Math.round((charsTyped / totalChars) * 100);
  const typedText = text.slice(0, charsTyped);
  const remainingText = text.slice(charsTyped);

  return (
    <Paper elevation={1} sx={{ p: 2, opacity: 0.9 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, alignItems: "center" }}>
        <Typography variant="subtitle1" fontWeight="medium">{name}</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ width: 80, height: 8, borderRadius: 1 }} 
          />
          <Typography variant="body2" color="text.secondary">
            {charsTyped}/{totalChars} ({progress}%)
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          fontFamily: "monospace",
          whiteSpace: "pre-wrap",
          position: "relative",
          fontSize: "1.1rem",
          backgroundColor: "#f5f5f5",
          p: 1.5,
          borderRadius: 1,
          minHeight: "5em",
          maxHeight: "7em",
          overflow: "auto",
          lineHeight: 1.4
        }}
      >
        <Box component="span" sx={{ backgroundColor: "#4caf50", color: "white" }}>
          {typedText}
        </Box>
        <Box component="span" sx={{ color: "#666" }}>
          {remainingText}
        </Box>
      </Box>
    </Paper>
  );
};
