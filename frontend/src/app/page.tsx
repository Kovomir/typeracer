"use client";
import React from "react";
import {Box, Typography, TextField, Paper, Button, List} from "@mui/material";
import {PlayerProgress} from "@/components/PlayerProgress";
import {useTyperacerGame} from "@/hooks/useTyperacerGame";

export default function TyperacerPage() {
    const {
        gameText,
        input,
        setInput,
        handleInput,
        players,
        playerId,
        gameState,
        rankings,
        inputRef,
        name,
        setName,
        hasJoined,
        joinWithName,
        isReady,
        sendReady,
    } = useTyperacerGame();

    // Name input form before joining
    const [nameInput, setNameInput] = React.useState("");
    if (!hasJoined) {
        return (
            <Box p={4} maxWidth={400} mx="auto">
                <Typography variant="h4" gutterBottom>Enter your name</Typography>
                <TextField
                    label="Name"
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    fullWidth
                    autoFocus
                    slotProps={{htmlInput: {maxLength: 20}}}
                    helperText="At least 4 characters"
                    disabled={false}
                />
                <Button
                    variant="contained"
                    sx={{mt: 2}}
                    fullWidth
                    disabled={nameInput.trim().length < 4}
                    onClick={() => joinWithName(nameInput.trim())}
                >
                    Join Lobby
                </Button>
            </Box>
        );
    }

    // Lobby with ready button
    if (gameState === "lobby") {
        return (
            <Box p={4} maxWidth={500} mx="auto">
                <Typography variant="h4" gutterBottom>Lobby</Typography>
                <Typography variant="subtitle1" gutterBottom>Welcome, {name}!</Typography>
                <Button
                    variant="contained"
                    color={isReady ? "success" : "primary"}
                    disabled={isReady}
                    onClick={sendReady}
                    sx={{mb: 2}}
                >
                    {isReady ? "Ready! Waiting for others..." : "I'm Ready"}
                </Button>
                <Typography variant="h6">Players</Typography>
                <List>
                    {players.map(p => (
                        <PlayerProgress
                            key={p.id}
                            name={p.name + (p.isReady ? " (Ready)" : "")}
                            progress={0}
                            finished={false}
                            isCurrent={p.id === playerId}
                        />
                    ))}
                </List>
                <Typography variant="body2" color="text.secondary">
                    Waiting for all players to be ready...
                </Typography>
            </Box>
        );
    }

    if (gameState === "finished") {
        return (
            <Box p={4} maxWidth={500} mx="auto">
                <Typography variant="h4" gutterBottom>🏁 Game Finished!</Typography>
                <List>
                    {rankings.map((p, i) => (
                        <PlayerProgress
                            key={p.id}
                            name={`${i + 1}. ${p.name}`}
                            progress={p.progress}
                            finished={!!p.finished}
                            isCurrent={p.id === playerId}
                        />
                    ))}
                </List>
                <Button variant="contained" onClick={() => window.location.reload()}>Play Again</Button>
            </Box>
        );
    }

    return (
        <Box p={4} maxWidth={700} mx="auto">
            <Typography variant="h4" gutterBottom>Typeracer</Typography>
            <Paper elevation={3} sx={{p: 2, mb: 2, fontSize: 20, letterSpacing: 1, wordBreak: "break-word"}}>
                {gameText.split("").map((char, idx) => (
                    <span key={idx} style={{background: idx < input.length ? "#a5d6a7" : undefined}}>{char}</span>
                ))}
            </Paper>
            <TextField
                inputRef={inputRef}
                value={input}
                onChange={handleInput}
                disabled={gameState !== "active"}
                fullWidth
                autoFocus
                placeholder={gameState === "active" ? "Type here..." : "Waiting for game..."}
            />
            <Box mt={3}>
                <Typography variant="h6">Players</Typography>
                <List>
                    {players.map(p => (
                        <PlayerProgress
                            key={p.id}
                            name={p.name}
                            progress={p.progress || 0}
                            finished={!!p.finished}
                            isCurrent={p.id === playerId}
                        />
                    ))}
                </List>
            </Box>
            {gameState === "waiting" && <Typography mt={2}>Waiting for players...</Typography>}
            {gameState === "lobby" && <Typography mt={2}>Get ready! Game starting soon...</Typography>}
        </Box>
    );
}
