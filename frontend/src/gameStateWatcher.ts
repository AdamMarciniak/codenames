import { socket } from './api'
import type Gamestate from '../types/.d'

const gameStateListeners : any[] = [];

let currentGameState : Gamestate  = null;

const receiveState = (state) => {
  currentGameState = state;
  console.log('received state', currentGameState);
  gameStateListeners.forEach((listener) => listener(currentGameState));
}

let hasForcedState = false;

window['forceState'] = (state) => {
  hasForcedState = true;
  receiveState(state);
}

socket.on('gameState', (newGameState) => {
  if (!hasForcedState) {
    receiveState(newGameState);
  }
});

export const addListener = (listener: (newGameState: Gamestate) => any) => {
  gameStateListeners.push(listener);
}

export const removeListener = (listener: (newGameState: Gamestate) => any) => {
  gameStateListeners.splice(gameStateListeners.indexOf(listener), 1);
}

export const getCurrentGameState = () => currentGameState;
