import React from "react";
import {ListItem, Box, Typography} from "@mui/material";

interface PlayerInLobyProps {
    name: string;
    isCurrent: boolean;
}

export function PlayerInLoby({name, isCurrent}: PlayerInLobyProps) {

    return (
        <ListItem style={isCurrent ? {background: '#e3f2fd'} : {}}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>{name}</Typography>
                </Box>
        </ListItem>
    );
}
