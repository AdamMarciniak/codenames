import React, { useCallback, useEffect, useState } from "react";
import './BoardSection.css';
import useGameState from '../useGameState.ts';
import { getCurrentPlayer, getCurrentTurn } from "../gameStateSelectors";
import Card from '../components/cards/Card';
import api, { useApiCall } from "../api";
import Confetti from 'react-confetti';
import {randomPhrase} from './Phrases'

const TEAM_NAMES = {
  RED: 'Red Team',
  BLUE: 'Blue Team'
};

const ProgressReadout = props => {
  const totalCards = props.gameState.points[props.team].total
  const remainingCards = totalCards - props.gameState.points[props.team].points;

  return (
    <div className='points-wrapper' style={{ color:props.color, display:'flex', flexDirection:'column', alignItems:'center',justifyContent:'center'}}>
      <div className='points-progress'>{remainingCards} {props.team} card{remainingCards === 1 ? '' : 's'} left!</div>
    </div>
  )
}

const BoardSection = ({ onClick }) => {
  const [gameState] = useGameState(null);
  const currentPlayer = getCurrentPlayer(gameState);
  const currentTurn = getCurrentTurn(gameState);
  const [endTurn, endingTurn] = useApiCall('endTurn');
  const yourTurn = currentTurn === currentPlayer.team;
  const theirTurn = currentTurn && currentTurn !== currentPlayer.team;
  const canClickCard = window.location.href.includes("god=1") || (yourTurn && !currentPlayer.isCluegiver);
  const [startNewGame, startingNewGame] = useApiCall('startNewGame');

  if (gameState.winner) {
    return (
      <section className="game-board" onClick={onClick}>
        <div className="winner-section" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
          {
            currentPlayer.team === gameState.winner
              ? (
                <>
                  <Confetti/>
                  <h3 className="endgame-text-title">You won!</h3>
                  <h4 className="endgame-text-subtitle">{randomPhrase(gameState, 'win')}</h4>
                </>
              )
              : (
                <>
                  <Confetti numberOfPieces={50} colors={['#6b6b6b']} drawShape={ctx => {
                    ctx.font = "40px Fredoka One";
                    ctx.fillText("BOO", -50, 25);
                  }}/>
                  <h3 className="endgame-text-title">You lost</h3>
                  <h4 className="endgame-text-subtitle">{randomPhrase(gameState, 'lose')}</h4>
                </>
              )
          }
        </div>
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
          <button onClick={startNewGame} className="game-new-button" disabled={startingNewGame}>New Game</button>
        </footer>
      </section>
    )
  }

  return (
    <section className="game-board" onClick={onClick}>
      <header className="game-header">
      {currentPlayer.team !== 'OBSERVER' && <ProgressReadout color='#ff5454' team='red' gameState={gameState}/>}
        {yourTurn && <div className="game-turn-readout your-turn">It's your turn!</div>}
        {currentPlayer.team !== 'OBSERVER' && theirTurn && <div className="game-turn-readout their-turn">Sit tight, <br />it's {TEAM_NAMES[currentTurn]}'s turn!</div>}
        {currentPlayer.team === 'OBSERVER' && !!currentTurn && <div className="game-turn-readout their-turn">It's {TEAM_NAMES[currentTurn]}'s turn!</div>}
        {currentPlayer.team !== 'OBSERVER' && <ProgressReadout color='#0081ff' team='blue' gameState={gameState}/>}

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
