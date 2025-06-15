import { Box, Paper, Typography } from "@mui/material";

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

  return (
    <Paper elevation={1} sx={{ p: 2, opacity: 0.8 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="subtitle1">{name}</Typography>
        <Typography variant="body2">
          {charsTyped}/{totalChars} chars ({progress}%)
        </Typography>
      </Box>
      <Box
        sx={{
          fontFamily: "monospace",
          whiteSpace: "pre-wrap",
          position: "relative",
          fontSize: "1.1rem",
        }}
      >
        <span style={{ backgroundColor: "#4caf50", color: "white" }}>
          {text.slice(0, charsTyped)}
        </span>
        <span style={{ color: "#666" }}>{text.slice(charsTyped)}</span>
      </Box>
    </Paper>
  );
};
