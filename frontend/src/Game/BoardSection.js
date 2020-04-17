import React, { useMemo, useCallback } from "react";
import './BoardSection.css';
import useGameState from '../useGameState';
import cx from 'classnames';
import { getCurrentPlayer, getCurrentTurn } from "../gameStateSelectors";
import Card from '../components/cards/Card';
import api from "../api";

const TEAM_NAMES = {
  RED: 'Red Team',
  BLUE: 'Blue Team'
};

const BoardSection = () => {
  const gameState = useGameState();
  const currentPlayer = getCurrentPlayer(gameState);
  const currentTurn = getCurrentTurn(gameState);

  const yourTurn = currentTurn === currentPlayer.team;
  const theirTurn = currentTurn && currentTurn !== currentPlayer.team;
  const canClickCard = window.location.href.includes("god=1") || yourTurn && !currentPlayer.isCluegiver;

  return (
    <section className="game-board">
      {yourTurn && <div className="game-turn-readout your-turn">It's your turn!</div>}
      {theirTurn && <div className="game-turn-readout their-turn">Sit tight, <br />it's {TEAM_NAMES[currentTurn]}'s turn!</div>}
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
      <footer>
        <button className="game-end-turn">End Your Turn</button>
      </footer>
    </section>
  );
}

export default BoardSection;
