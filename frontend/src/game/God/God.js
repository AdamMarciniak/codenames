import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import io from 'socket.io-client';
const socket = io(window.location.hostname + ':3001');

const api = (endpoint, params) => {
  socket.emit(endpoint, params, (error) => {
    if (error) {
      console.error(error);
    } else {
      console.log('success!');
    }
  });
}

window.api = api;

const useGameState = () => {
  const [gameState, setGameState] = useState(null);
  socket.on('gameState', (newGameState) => {
    setGameState(newGameState);
  });
  return gameState;
}

export default () => {
  const [name, setName] = useState('');
  const createGame = useCallback(
    () => {
      api('createGame', { name });
    },
    [name]
  );

  const gameState = useGameState();

  return (
    <div>
      <h3>Create Game</h3>
      <input onChange={(e) => setName(e.currentTarget.value)} value={name} />
      <button onClick={createGame}>Do it</button>

      <h3>Create Game</h3>
      <input onChange={(e) => setName(e.currentTarget.value)} value={name} />
      <button onClick={createGame}>Do it</button>

      <h3>Current State</h3>
      <pre>
        {JSON.stringify(gameState, null, 2)}
      </pre>
    </div>
  )
}
