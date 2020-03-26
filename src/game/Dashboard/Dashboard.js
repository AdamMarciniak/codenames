import React, { useState, useEffect } from 'react';
import Card from '../cards/Card';

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

export { Banner, ScoreBoard, Players, GameBoard };
