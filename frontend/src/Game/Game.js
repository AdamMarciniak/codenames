import React, { useMemo, useCallback } from "react";
import './Game.css';
import useGameState from '../useGameState';
import cx from 'classnames';
import PlayerSection from "./PlayerSection";
import { getCurrentTurn } from '../gameStateSelectors';
import BoardSection from "./BoardSection";


const Game = () => {
  const gameState = useGameState();
  if (!gameState) {
    return null;
  }
  const currentTurn = getCurrentTurn(gameState);
  return (
    <div className={cx('game-view', { 'red-turn': currentTurn === 'RED', 'blue-turn': currentTurn === 'BLUE', 'no-turn': !currentTurn })}>
      <PlayerSection />
      <BoardSection />
    </div>
  )
}

export default Game;
