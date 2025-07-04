import React from "react";
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    Paper,
    Divider,
    Avatar,
    Button
} from "@mui/material";
import {Ranking} from "@/types/game";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

interface RankingsPageProps {
    rankings: Ranking[];
}

const getRankColor = (index: number): string => {
    switch (index) {
        case 0:
            return '#FFD700'; // Gold
        case 1:
            return '#C0C0C0'; // Silver
        case 2:
            return '#CD7F32'; // Bronze
        default:
            return 'transparent';
    }
};

const RankingsPage: React.FC<RankingsPageProps> = ({rankings}) => {
    return (
        <Box mt={4} maxWidth={600} mx="auto">
            <Paper elevation={3} sx={{p: 3}}>
                <Typography
                    variant="h4"
                    gutterBottom
                    align="center"
                    sx={{
                        mb: 3,
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1
                    }}
                >
                    <EmojiEventsIcon sx={{fontSize: 40}}/>
                    Final Rankings
                </Typography>
                <List>
                    {rankings.map((rank, index) => (
                        <React.Fragment key={rank.playerId}>
                            {index > 0 && <Divider/>}
                            <ListItem
                                sx={{
                                    backgroundColor: getRankColor(index),
                                    borderRadius: 1,
                                    mb: 1,
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'scale(1.02)',
                                    }
                                }}
                            >
                                <Avatar
                                    sx={{
                                        bgcolor: index < 3 ? 'primary.main' : 'grey.500',
                                        mr: 2
                                    }}
                                >
                                    {index + 1}
                                </Avatar>
                                <ListItemText
                                    primary={
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: index < 3 ? 'bold' : 'normal'
                                            }}
                                        >
                                            {rank.playerName}
                                        </Typography>
                                    }
                                    secondary={
                                        <Box display="flex" alignItems="center" gap={1} component="span">
                                            <Typography variant="body2" color="textSecondary" component="span">
                                                Progress: {Math.round((rank.charsTyped / rank.totalChars) * 100)}%
                                            </Typography>
                                            {index === 0 && (
                                                <Typography variant="body2" color="textSecondary" component="span">
                                                    • Time: {(rank.finishTime / 1000).toFixed(2)}s
                                                </Typography>
                                            )}
                                        </Box>
                                    }
                                />
                            </ListItem>
                        </React.Fragment>
                    ))}
                </List>

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        startIcon={<RestartAltIcon />}
                        onClick={() => window.location.reload()}
                        sx={{
                            px: 4,
                            py: 1.5,
                            borderRadius: 2,
                            fontWeight: 'bold',
                            boxShadow: 3,
                            '&:hover': {
                                transform: 'scale(1.05)',
                                transition: 'transform 0.2s'
                            }
                        }}
                    >
                        Play Again
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default RankingsPage;
