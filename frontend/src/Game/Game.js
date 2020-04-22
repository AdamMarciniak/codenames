import React, { useState } from "react";
import './Game.css';
import useGameState from '../useGameState';
import cx from 'classnames';
import PlayerSection from "./PlayerSection";
import { getCurrentTurn } from '../gameStateSelectors';
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
          'red-turn': currentTurn === 'RED',
          'blue-turn': currentTurn === 'BLUE',
          'no-turn': !currentTurn,
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
