import React, { useState, useCallback, useEffect } from 'react';
import CardSVG from './CardSVG';
import ReactCardFlip from './ReactCardFlip';

const Card = props => {
  const [color, setColor] = useState('E0D4BE');

  useEffect(() => {
    switch (props.item.color) {
      case 'red':
        setColor('FF7F6D');
        return;
      case 'blue':
        setColor('6DD3FF');
        return;
      case 'black':
        setColor('000000');
        return;
      case 'white':
        setColor('FFFFFF');
        return;
      default:
        setColor('E0D4BE');
        return;
    }
  }, [setColor, props.type]);

  const handleClick = e => {
    e.stopPropagation();
    props.handleCardFlip(props.item);
  };

  return (
    <div className="card" styles={{ margin: '50px' }}>
      <ReactCardFlip isFlipped={props.item.flipped} flipDirection="horizontal">
        <CardSVG
          word={props.item.word}
          width={props.width}
          color={'E0D4BE'}
          handleClick={handleClick}
        />

        <CardSVG
          word={props.item.word}
          width={props.width}
          color={color}
          handleClick={e => {}}
        />
      </ReactCardFlip>
    </div>
  );
};

export default Card;
