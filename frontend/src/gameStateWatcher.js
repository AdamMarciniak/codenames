import { socket } from './api'
import cookies from 'browser-cookies';
import TEST_STATE from './testState.js';

const USE_TEST_STATE = window.location.href.includes('//localhost') && true;

const gameStateListeners = [];

let currentGameState = null;

socket.on('gameState', (newGameState) => {
  currentGameState = USE_TEST_STATE ? TEST_STATE : newGameState;
  console.log('received state', currentGameState);
  if (currentGameState) {
    cookies.set('secret', currentGameState.currentPlayerSecret, { expires: 365 });
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
