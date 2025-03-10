import { socket } from './api'

const gameStateListeners = [];

let currentGameState = null;

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

export const addListener = (listener) => {
  gameStateListeners.push(listener);
}

export const removeListener = (listener) => {
  gameStateListeners.splice(gameStateListeners.indexOf(listener), 1);
}

export const getCurrentGameState = () => currentGameState;
