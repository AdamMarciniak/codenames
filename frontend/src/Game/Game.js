import React, { useState } from "react";
import './Game.css';
import useGameState from '../useGameState.ts';
import cx from 'classnames';
import PlayerSection from "./PlayerSection";
import { getCurrentTurn, getCurrentPlayer } from '../gameStateSelectors';
import BoardSection from "./BoardSection";


const Game = () => {
  const [gameState] = useGameState();
  const [playerSectionMinimized, setPlayerSectionMinimized] = useState(false);
  if (!gameState) {
    return null;
  }
  const currentTurn = getCurrentTurn(gameState);
  return (
    <div className={
      cx(
        'game-view',
        {
          'red-turn': currentTurn === 'RED' && !gameState.winner,
          'blue-turn': currentTurn === 'BLUE' && !gameState.winner,
          'no-turn': !currentTurn || !!gameState.winner,
          'hide-player-section': playerSectionMinimized,
        }
      )
    }>
      <PlayerSection onClick={() => setPlayerSectionMinimized(false)} />
      <BoardSection onClick={() => setPlayerSectionMinimized(true)} />
    </div>
  )
}

export default Game;
