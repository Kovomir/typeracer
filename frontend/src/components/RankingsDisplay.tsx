import React from "react";
import { 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Typography,
  Box
} from "@mui/material";

interface PlayerRanking {
  playerId: string;
  playerName: string;
  rank: number;
  charsTyped: number;
  totalChars: number;
  finishTime?: number;
  isFinished: boolean;
}

interface RankingsDisplayProps {
  rankings: PlayerRanking[];
}

export const RankingsDisplay: React.FC<RankingsDisplayProps> = ({ rankings }) => {

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Final Rankings
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>Player</TableCell>
              <TableCell align="right">Progress</TableCell>
              <TableCell align="right">Completion</TableCell>
              <TableCell align="right">Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>            {rankings.map((player) => {
              const progress = (player.charsTyped / player.totalChars) * 100;
              
              return (
                <TableRow 
                  key={player.playerId}
                  sx={{ 
                    backgroundColor: player.isFinished ? '#e8f5e9' : 'inherit',
                    '&:last-child td, &:last-child th': { border: 0 }
                  }}
                >
                  <TableCell>{player.rank}</TableCell>
                  <TableCell>
                    <Typography>
                      {player.playerName}
                      {player.isFinished && 
                        <Typography 
                          component="span" 
                          color="success.main" 
                          sx={{ ml: 1, fontSize: '0.875rem' }}
                        >
                          (Finished)
                        </Typography>
                      }
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    {player.charsTyped} / {player.totalChars}
                  </TableCell>
                  <TableCell align="right">
                    {progress.toFixed(1)}%
                  </TableCell>
                  <TableCell align="right">
                    {player.isFinished && player.finishTime
                      ? `${(player.finishTime / 1000).toFixed(2)}s`
                      : '-'
                    }
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
