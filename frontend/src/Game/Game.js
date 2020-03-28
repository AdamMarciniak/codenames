import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useGameState from '../useGameState';
import { useApiCall } from '../api';

export const JoinGame = () => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  return (
    <div className="form-wrap">
      <div className="form">
        <label>
          Name
          <input value={name} placeholder="Baby Yoda" onChange={e => setName(e.currentTarget.value)} />
        </label>
        <label>
          Game Code
          <input value={code} placeholder="THFRC" onChange={e => setCode(e.currentTarget.value)} />
        </label>
      </div>
    </div>
  )
}

export const CreateGame = () => {
  const [name, setName] = useState('');
  const createGame = useApiCall('createGame', { name });
  return (
    <div className="form-wrap">
      <div className="form">
        <label>
          First - What's Your Name?
          <input value={name} placeholder="Baby Yoda" onChange={e => setName(e.currentTarget.value)} />
        </label>
        <button onClick={createGame}>Create Game</button>
      </div>
    </div>
  )
}

export const Menu = () => {
  return (
    <div className="form-wrap">
      <div className="form">
        <Link className="button" to='/join'>Join an existing game</Link>
        <Link className="button" to='/new'>Start a new game</Link>
      </div>
    </div>
  )
}

export default () => {
  const gameState = useGameState();
  if (!gameState) {
    return <Menu />
  } else {
    return (<div>Game goes here</div>);
  }
}
