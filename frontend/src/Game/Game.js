import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import useGameState from '../useGameState';
import { useApiCall } from '../api';
import Card from '../components/cards/Card';

export const JoinGame = ({ match: { params } }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState(params.code || '');
  const joinGame = useApiCall('joinGame', { name, gameCode: code });
  return (
    <div className="form-wrap">
      <div className="form">
        <label>
          Real quick: what's your name?
          <input value={name} placeholder="Baby Yoda" onChange={e => setName(e.currentTarget.value)} />
        </label>
        {!params.code && (
          <label>
            Game Code
            <input value={code} placeholder="THFRC" onChange={e => setCode(e.currentTarget.value)} />
          </label>
        )}
        <button onClick={joinGame}>Join Game</button>
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

const RoleStatus = () => {
  const gameState = useGameState();
  if (!gameState) {
    return null;
  }
  const currentPlayer = gameState.players[gameState.currentPlayerId];
  const currentTeamCluegiver = Object.values(gameState.players).find(({ team, isCluegiver }) => team === currentPlayer.team && isCluegiver);
  if (currentPlayer.team === 'OBSERVER') {
    return <>You are <strong>Observing</strong>. Join a team to play!</>
  } else {
    let cluegiverLine;
    if (!currentTeamCluegiver) {
      cluegiverLine = <div>Your team doesn't have a cluegiver yet!</div>;
    } else if (currentTeamCluegiver == currentPlayer) {
      cluegiverLine = <div><strong>You are the cluegiver!</strong></div>;
    } else {
      cluegiverLine = <div>Your cluegiver is {currentTeamCluegiver.name}</div>;
    }

    return (
      <>
        <div>You are on team <strong style={{ color: currentPlayer.team.toLowerCase() }}>{currentPlayer.team}</strong>.</div>
        {cluegiverLine}
      </>
    );
  }
}

export default () => {
  const gameState = useGameState();
  const endTurn = useApiCall('endTurn');
  const joinRedTeam = useApiCall('joinTeam', { team: 'RED' });
  const joinBlueTeam = useApiCall('joinTeam', { team: 'BLUE' });
  const becomeCluegiver = useApiCall('becomeCluegiver');
  if (!gameState) {
    return null;
  }
  const currentPlayer = gameState.players[gameState.currentPlayerId];
  const isCurrentPlayerTurn = gameState.currentTurn === currentPlayer.team;
  const teamHasCluegiver = Object.values(gameState.players).find(({ team, isCluegiver }) => team === currentPlayer.team && isCluegiver);
  const canEndTurn = isCurrentPlayerTurn && teamHasCluegiver && !currentPlayer.isCluegiver;

  // you can join a team if you aren't already on one, or if you are but no cards have been flipped yet.
  const canJoinTeam = currentPlayer.team === 'OBSERVER' || (!gameState.words.find(({ flipped }) => flipped) && !currentPlayer.isCluegiver);

  return (
    <div className="game-wrap">
      <div className="card-wrap">
        {gameState.words.map((word) => (
          <Card
            key={word.id}
            word={word.text}
            type={word.type}
            flipped={word.flipped}
            onClick={() => {console.log('arriba!')}}
          />
        ))}
      </div>
      <div className="control-bar">
        <div className="role-status">
          <RoleStatus />
        </div>
        <div className="buttons">
          {canEndTurn && <button onClick={endTurn} style={{ backgroundColor: 'black', color: 'white' }}>End Turn</button>}
          {
            currentPlayer.team !== 'OBSERVER' && !teamHasCluegiver && <button onClick={becomeCluegiver}>Become Cluegiver</button>
          }
          {
            canJoinTeam
              && currentPlayer.team !== 'RED'
              && (
                <button onClick={joinRedTeam} style={{ backgroundColor: '#FF7F6D' }}>
                  {currentPlayer.team === 'OBSERVER' ? 'Join' : 'Switch to'} Red Team
                </button>
              )
          }
          {
            canJoinTeam
              && currentPlayer.team !== 'BLUE'
              && (
                  <button onClick={joinBlueTeam} style={{ backgroundColor: '#6DD3FF' }}>
                  {currentPlayer.team === 'OBSERVER' ? 'Join' : 'Switch to'} Blue Team
                </button>
              )
          }
        </div>
      </div>
      <footer>Invite your friends! <strong>{window.location.protocol}//{window.location.host}/join/{gameState.gameCode}</strong></footer>
    </div>
  )
}
