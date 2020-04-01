import { socket } from './api'
import cookies from 'browser-cookies';

const gameStateListeners = [];

let currentGameState = null;
let currentAvatarState = null;

socket.on('gameState', (newGameState) => {
  currentGameState = newGameState;
  console.log('received state', newGameState);
  if (newGameState) {
    cookies.set('secret', newGameState.currentPlayerSecret, { expires: 365 });
  }
  gameStateListeners.forEach((listener) => listener(currentGameState));
});

export const addListener = (listener) => {
  gameStateListeners.push(listener);
}

export const removeListener = (listener) => {
  gameStateListeners.splice(gameStateListeners.indexOf(listener), 1);
}

export const getCurrentGameState = () => currentGameState;
