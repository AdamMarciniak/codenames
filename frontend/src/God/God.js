import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import useGameState from '../useGameState';
import { useApiCall } from '../api';

export default () => {
  const [name, setName] = useState('');
  const [createGame, creatingGame] = useApiCall('createGame', { name });

  const gameState = useGameState();

  return (
    <div>
      <h3>Create Game</h3>
      <input onChange={(e) => setName(e.currentTarget.value)} value={name} />
      <button onClick={createGame} disabled={creatingGame}>Do it</button>

      <h3>Current State</h3>
      <pre>
        {JSON.stringify(gameState, null, 2)}
      </pre>
    </div>
  )
}
