import { gameStates } from './const.js';

export const players = [];
export const gameState = { 
    value: gameStates.WAITING,
    currentText: ''
};
export const connectionMap = new Map();