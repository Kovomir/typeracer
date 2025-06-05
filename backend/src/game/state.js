import { gameStates } from './const.js';

export const players = [];
export const gameState = { value: gameStates.WAITING };
export let currentGameText = '';
export const connectionMap = new Map();