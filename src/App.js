import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import Card from './game/cards/Card';
import './App.css';
import store from './game/Store/Store';

import {
  addPlayerAction,
  removePlayerAction,
  setPlayerTeamAction,
  setPlayerSpymasterAction,
} from './game/Store/PlayersActions';

import {
  changeWordColorAction,
  removeWordAction,
  addWordAction,
  flipWordAction,
} from './game/Store/WordsActions';

import {
  addPointsAction,
  removePointsAction,
  setCurrentTeamAction,
  toggleCurrentTeamAction,
  setGameOverAction,
  incrementRoundAction,
  decrementRoundAction,
  setWinnerAction,
  setGameIdAction,
  setThisPlayerAction,
} from './game/Store/GameActions';

const generateId = () => {
  return (
    '_' +
    Math.random()
      .toString(36)
      .substr(2, 9)
  );
};

const words = [
  { id: generateId(), word: 'icy', color: 'blue', flipped: false },
  { id: generateId(), word: 'defeated', color: 'blue', flipped: false },
  { id: generateId(), word: 'rare', color: 'red', flipped: false },
  { id: generateId(), word: 'protect', color: 'white', flipped: false },
  { id: generateId(), word: 'detail', color: 'blue', flipped: false },
  { id: generateId(), word: 'arm', color: 'white', flipped: false },
  { id: generateId(), word: 'double', color: 'red', flipped: false },
  { id: generateId(), word: 'decision', color: 'blue', flipped: false },
  { id: generateId(), word: 'agonizing', color: 'red', flipped: false },
  { id: generateId(), word: 'curly', color: 'red', flipped: false },
  { id: generateId(), word: 'drag', color: 'red', flipped: false },
  { id: generateId(), word: 'motion', color: 'red', flipped: false },
  { id: generateId(), word: 'peace', color: 'blue', flipped: false },
  { id: generateId(), word: 'statuesque', color: 'blue', flipped: false },
  { id: generateId(), word: 'overflow', color: 'black', flipped: false },
  { id: generateId(), word: 'brown', color: 'red', flipped: false },
  { id: generateId(), word: 'bright', color: 'red', flipped: false },
  { id: generateId(), word: 'striped', color: 'blue', flipped: false },
  { id: generateId(), word: 'desire', color: 'red', flipped: false },
  { id: generateId(), word: 'boil', color: 'red', flipped: false },
  { id: generateId(), word: 'abandoned', color: 'white', flipped: false },
  { id: generateId(), word: 'well', color: 'blue', flipped: false },
  { id: generateId(), word: 'statuesque', color: 'blue', flipped: false },
  { id: '1234', word: 'peace', color: 'red', flipped: false },
];

const state = {
  id: 'FIXBY',
  round: 0,
  currentTeam: 'red',
  blackCardFlipped: false,

  players: [
    { id: 'hsg261', name: 'Adam', team: 'red', spymaster: true },
    { id: 'hsg111', name: 'Sam', team: 'blue', spymaster: true },
    { id: 'h21ds1', name: 'DatBoy', team: 'red', spymaster: false },
  ],
  redPoints: 0,
  bluePoints: 0,
  words,
};

store.subscribe(() => console.log(store.getState()));
store.dispatch(addPlayerAction('New Player'));
store.dispatch(setThisPlayerAction('hsg261'));

const GameBoard = props => {
  return (
    <>
      <div className="gameBoard">
        {props.gameState.words.map(item => (
          <Card
            item={item}
            key={item.id}
            width={120}
            handleCardFlip={props.handleCardFlip}
          />
        ))}
      </div>
    </>
  );
};

const Players = props => {
  return (
    <ul>
      {props.gameState.players.map(player => (
        <li style={{ background: player.team }} key={player.id}>
          {player.name}
        </li>
      ))}
    </ul>
  );
};

const ScoreBoard = props => {
  const getPoints = team => {
    return props.gameState.words.filter(
      word => word.color === team && word.flipped
    ).length;
  };

  return (
    <div style={{ display: 'flex' }}>
      <div>
        <h2>Red Points</h2>
        <h3>{getPoints('red')}</h3>
      </div>
      <div>
        <h2>Blue Points</h2>
        <h3>{getPoints('blue')}</h3>
      </div>
    </div>
  );
};

const Banner = props => {
  return (
    <span>
      <h1
        style={{
          background:
            props.gameState.game.currentTeam === 'blue' ? 'blue' : 'red',
        }}
      >{`${props.gameState.game.currentTeam}'s Turn`}</h1>
      <h2>{`You Are On Team: ${
        props.gameState.players.filter(player => {
          return props.gameState.game.thisPlayer === player.id;
        })[0].team
      }`}</h2>
    </span>
  );
};

function App() {
  const [gameState, setGameState] = useState(store.getState());

  useEffect(() => {
    return store.subscribe(() => setGameState(store.getState()));
  }, [setGameState]);
  const handleCardFlip = card => {
    if (
      gameState.players
        .filter(player => player.team === gameState.game.currentTeam)
        .filter(player => player.id === gameState.game.thisPlayer).length > 0
    ) {
      store.dispatch(flipWordAction(card.id));
    }
  };

  const handleNextRound = () => {
    store.dispatch(toggleCurrentTeamAction());
  };

  return (
    <>
      <Banner gameState={gameState} />
      <div style={{ display: 'flex' }}>
        <button onClick={handleNextRound}>End Turn</button>
        <ScoreBoard gameState={gameState} />
        <Players gameState={gameState} />
      </div>
      <GameBoard handleCardFlip={handleCardFlip} gameState={gameState} />
    </>
  );
}

export default App;
