import React, { useState, useCallback, useEffect } from 'react';
import CardSVG from './CardSVG';
import ReactCardFlip from './ReactCardFlip';

const Card = ({ type, flipped, onClick, word, clickable }) => {
  const [color, setColor] = useState('E0D4BE');

  useEffect(() => {
    switch (type) {
      case 'RED':
        setColor('FF7F6D');
        return;
      case 'BLUE':
        setColor('6DD3FF');
        return;
      case 'ASSASSIN':
        setColor('000000');
        return;
      case 'NEUTRAL':
        setColor('E0D4BE');
        return;
      default:
        setColor('E0D4BE');
        return;
    }
  }, [setColor, type]);

  return (
    <div className="card" style={{ cursor: clickable ? 'pointer' : 'default', opacity: flipped ? 0.25 : 1 }}>
      <ReactCardFlip isFlipped={flipped} flipDirection="horizontal">
        <CardSVG
          word={word}
          color={'E0D4BE'}
          outlineColor={color === 'E0D4BE' ? null : color}
          handleClick={onClick}
        />
        <CardSVG
          word={word}
          color={color}
        />
      </ReactCardFlip>
    </div>
  );
};

export default Card;
