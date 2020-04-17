import React, { useMemo, useCallback } from "react";
import './BoardSection.css';
import useGameState from '../useGameState';
import cx from 'classnames';
import { getCurrentPlayer, getCurrentTurn } from "../gameStateSelectors";
import Card from '../components/cards/Card';
import api, { useApiCall } from "../api";

const TEAM_NAMES = {
  RED: 'Red Team',
  BLUE: 'Blue Team'
};

const BoardSection = () => {
  const gameState = useGameState();
  const currentPlayer = getCurrentPlayer(gameState);
  const currentTurn = getCurrentTurn(gameState);
  const [endTurn, endingTurn] = useApiCall('endTurn');

  const yourTurn = currentTurn === currentPlayer.team;
  const theirTurn = currentTurn && currentTurn !== currentPlayer.team;
  const canClickCard = window.location.href.includes("god=1") || yourTurn && !currentPlayer.isCluegiver;

  return (
    <section className="game-board">
      <header className="game-header">
        {yourTurn && <div className="game-turn-readout your-turn">It's your turn!</div>}
        {currentPlayer.team !== 'OBSERVER' && theirTurn && <div className="game-turn-readout their-turn">Sit tight, <br />it's {TEAM_NAMES[currentTurn]}'s turn!</div>}
        {currentPlayer.team === 'OBSERVER' && !!currentTurn && <div className="game-turn-readout their-turn">It's {TEAM_NAMES[currentTurn]}'s turn!</div>}
      </header>
      <div className="game-card-wrap">
        {gameState.words.map((word) => (
          <Card
            key={word.id}
            word={word.text}
            type={word.type}
            flipped={word.flipped}
            clickable={canClickCard}
            showColor={currentPlayer.isCluegiver}
            onClick={() =>
              canClickCard && api("revealWord", { wordId: word.id })
            }
          />
        ))}
      </div>
      <footer className="game-footer">
        {yourTurn && <button className="game-end-turn" onClick={endTurn} disabled={endingTurn}>End Your Turn</button>}
        {theirTurn && <div className="waiting-readout">Waiting for {TEAM_NAMES[currentTurn]}</div>}
      </footer>
    </section>
  );
}

export default BoardSection;
