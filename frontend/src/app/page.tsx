"use client";
import React from "react";
import {Box, Button, List, TextField, Typography} from "@mui/material";
import {useTyperacerGame} from "@/hooks/useTyperacerGame";
import LobbyPage from "@/components/LobbyPage";
import GamePage from "@/components/GamePage";
import RankingsPage from "@/components/RankingsPage";
import {PlayerInLoby} from "@/components/PlayerInLoby";

export default function TyperacerPage() {
    const {
        gameText,
        input,
        handleInput,
        players,
        playerId,
        gameState,
        rankings,
        inputRef,
        name,
        hasJoined,
        joinWithName,
        isReady,
        sendReady,
    } = useTyperacerGame();

    // Name input form before joining
    const [nameInput, setNameInput] = React.useState("");
    
    const handleJoin = () => {
        if (nameInput.trim().length >= 4) {
            joinWithName(nameInput.trim());
        }
    };

    if (!hasJoined) {
        return (
            <Box p={4} maxWidth={400} mx="auto">
                <Typography variant="h4" gutterBottom>Enter your name</Typography>
                <TextField
                    label="Name"
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    onKeyUp={e => {
                        if (e.key === 'Enter') {
                            handleJoin();
                        }
                    }}
                    fullWidth
                    autoFocus
                    inputProps={{ maxLength: 20 }}
                    helperText="At least 4 characters"
                    disabled={false}
                />
                <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    fullWidth
                    disabled={nameInput.trim().length < 4}
                    onClick={handleJoin}
                >
                    Join Lobby
                </Button>
            </Box>
        );
    }

    // Show lobby when in lobby state
    if (gameState === "lobby") {
        return (
            <LobbyPage
                name={name}
                players={players}
                playerId={playerId}
                isReady={isReady}
                sendReady={sendReady}
            />
        );
    }    // Show game when in active or finished state
    if (gameState === "active") {
        return (
            <GamePage
                gameText={gameText}
                input={input}
                handleInput={handleInput}
                players={players}
                playerId={playerId}
                inputRef={inputRef as React.RefObject<HTMLInputElement>}
                gameState={gameState}
            />
        );
    }   // Show rankings when the game is finished
    if (gameState === "finished") {
        return (
            <RankingsPage rankings={rankings}/>
        );
    }

    // Waiting state
    return (
        <Box p={4} maxWidth={700} mx="auto">
            <Typography variant="h4" gutterBottom>Waiting for Players</Typography>
            <List>
                {players.map(p => (
                    <PlayerInLoby
                        key={p.id}
                        name={p.name}
                        isCurrent={p.id === playerId}
                    />
                ))}
            </List>
        </Box>
    );
}
