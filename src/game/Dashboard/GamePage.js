import React, { useState, useEffect } from 'react';

import { Players, ScoreBoard, GameBoard, Banner } from './Dashboard';

import {
  addPlayerAction,
  removePlayerAction,
  setPlayerTeamAction,
  setPlayerSpymasterAction,
} from '../Store/PlayersActions';

import {
  changeWordColorAction,
  removeWordAction,
  addWordAction,
  flipWordAction,
} from '../Store/WordsActions';

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
} from '../Store/GameActions';

const GamePage = props => {
  const [gameState, setGameState] = useState(props.store.getState());

  useEffect(() => {
    return props.store.subscribe(() => setGameState(props.store.getState()));
  }, [setGameState]);

  const handleCardFlip = card => {
    if (
      gameState.players
        .filter(player => player.team === gameState.game.currentTeam)
        .filter(player => player.id === gameState.game.thisPlayer).length > 0
    ) {
      props.store.dispatch(flipWordAction(card.id));
    }
  };

  const handleNextRound = () => {
    props.store.dispatch(toggleCurrentTeamAction());
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
};

export default GamePage;
