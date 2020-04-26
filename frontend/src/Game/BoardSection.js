import React, { useCallback, useEffect, useState } from "react";
import './BoardSection.css';
import useGameState from '../useGameState';
import { getCurrentPlayer, getCurrentTurn } from "../gameStateSelectors";
import Card from '../components/cards/Card';
import api, { useApiCall } from "../api";
import Confetti from 'react-confetti';

const winningPhrases = [
  'You must be so proud to have such a big brain.',
  'If only Einstein were as smart as you.',
  'Time to put this moment into a photo album. Go ahead. The losing team can wait.',
  'Literally nobody ever gets to this stage. You are a god.',
]

const losingPhrases = [
  'Is this what your parents raised you for? To lose?',
  'You poor despicable humans.',
  'Here is a tissue so you can cry into it.',
  'Codenames? More like code LAME. Back me up Sam.',
  'Your cluegiver should be given a stern talking-to.'
]

const phrases = {
  'win': winningPhrases,
  'lose': losingPhrases,
}

const randomPhrase = (winState) => {
    return phrases[winState][Math.floor(Math.random() * phrases[winState].length)];
}

const TEAM_NAMES = {
  RED: 'Red Team',
  BLUE: 'Blue Team'
};

const ProgressReadout = props => {
  const totalCards = props.gameState.points[props.team].total
  const remainingCards = totalCards - props.gameState.points[props.team].points;
  
  return (
    <div className='points-wrapper' style={{ color:props.color, display:'flex', flexDirection:'column', alignItems:'center',justifyContent:'center'}}>
      <div className='points-progress'>{remainingCards}</div>
      <div style={{content:'', background: 'red', width: '100%', height:'2px'}}></div>
      <div className='points-total'>{totalCards}</div>
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
  const [winner, setWinner] = useState(gameState.winner);
  const [startNewGame, startingNewGame] = useApiCall('startNewGame');

  
  useEffect(() => {
    if (gameState.winner === 'NULL' && winner !== 'NULL') {
      setWinner(gameState.winner);
    } else {
        const timer = setTimeout(() => setWinner(gameState.winner), 2000)
        return () => {
          clearTimeout(timer)
    }
    }
   
  },[gameState, winner])



  if (winner !== 'NULL') {
    return (
      <section className="game-board" onClick={onClick}>
      <header className='game-header'>
        {currentPlayer.team !== 'OBSERVER' && <ProgressReadout color='red' team='red'  gameState={gameState}/>}
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        {currentPlayer.team === gameState.winner ?
          <>  
            <Confetti/>
            <h1 style={{fontSize:'2rem', margin:'0', marginTop:'10px'}}>You won!</h1>
            <h2 style={{fontSize:'1rem', textAlign:'center', margin:'0'}}>{randomPhrase('win')}</h2>
          </> :
          <>
          <Confetti numberOfPieces={50}colors={['#6b6b6b']} drawShape={ctx => {
            ctx.font = "40px Fredoka One";
            ctx.fillText("BOO", 10, 50);
          }}/>
          <h1 style={{fontSize:'2rem', margin:'0', marginTop:'10px'}}>You lost</h1>
          <h2 style={{fontSize:'1rem', textAlign:'center', margin:'0'}}>{randomPhrase('lose')}</h2>
          
          </>
          }
      </div>
      {currentPlayer.team !== 'OBSERVER' && <ProgressReadout color='blue' team='blue'  gameState={gameState}/>}
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
      <button onClick={startNewGame} className="game-new-button" disabled={startingNewGame}>New Game</button>
      </footer>
    </section>
    )
  }

  return (
    
    <section className="game-board" onClick={onClick}>
      <header className="game-header">
      {currentPlayer.team !== 'OBSERVER' && <ProgressReadout color='red' team='red'  gameState={gameState}/>}
        {yourTurn && <div className="game-turn-readout your-turn">It's your turn!</div>}
        {currentPlayer.team !== 'OBSERVER' && theirTurn && <div className="game-turn-readout their-turn">Sit tight, <br />it's {TEAM_NAMES[currentTurn]}'s turn!</div>}
        {currentPlayer.team === 'OBSERVER' && !!currentTurn && <div className="game-turn-readout their-turn">It's {TEAM_NAMES[currentTurn]}'s turn!</div>}
        {currentPlayer.team !== 'OBSERVER' && <ProgressReadout color='blue' team='blue'  gameState={gameState}/>}
       
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
