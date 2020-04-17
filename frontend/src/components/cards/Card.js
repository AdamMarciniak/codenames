import React, { useState, useEffect, useRef, useCallback } from 'react';
import CardSVG from './CardSVG';
import cx from 'classnames';
import './Card.css';

const getRotation = (word) => {
  return (((word.split('').map(c => c.charCodeAt(0)).reduce((a, b) => a + b) % 20) / 20) * 6) - 3;
}

const useHoverGuard = (element, active) => {
  const [canHover, setCanHover] = useState(false);
  const mouseIsOver = useRef(false);

  useEffect(() => {
    if (element) {
      element.addEventListener('mouseover', (e) => {
        mouseIsOver.current = true;
      });
      element.addEventListener('mouseout', (e) => {
        mouseIsOver.current = false;
      });
    }
  }, [element]);

  useEffect(() => {
    if (element && active && !canHover) {
      if (!mouseIsOver.current) {
        setCanHover(true);
      } else {
        const mouseOutHandler = () => {
          setCanHover(true);
          element.removeEventListener('onmouseout', mouseOutHandler);
        }
        element.addEventListener('mouseout', mouseOutHandler);
      }
    }
  }, [element, active, canHover]);

  return canHover;
}

const Card = ({ type, flipped, onClick, word, clickable, showColor }) => {
  const [color, setColor] = useState('#E0D4BE');
  const [wrapper, setWrapper] = useState(null);
  const wrapperRef = useCallback((wrapperElement) => setWrapper(wrapperElement), [setWrapper]);
  const coverRotation = getRotation(word);
  const canHover = useHoverGuard(wrapper, flipped);

  useEffect(() => {
    switch (type) {
      case 'RED':
        setColor('#FF7F6D');
        return;
      case 'BLUE':
        setColor('#6DD3FF');
        return;
      case 'ASSASSIN':
        setColor('#000000');
        return;
      case 'NEUTRAL':
        setColor('#E0D4BE');
        return;
      default:
        setColor('#E0D4BE');
        return;
    }
  }, [setColor, type]);

  return (
    <div className={cx('card', { flipped: flipped, hoverable: canHover })} style={{ cursor: clickable ? 'pointer' : 'default' }} onClick={onClick} ref={wrapperRef}>
      <CardSVG
        word={word}
        outlineColor={showColor && color !== '#E0D4BE' ? color : null}
      />
      <div className="card-cover" style={{
        backgroundColor: color,
        transform: `rotate(${flipped ? coverRotation : -coverRotation}deg) scale(${flipped ? 1 : 10}) translate3d(0,0,0)`,
        border: `4px solid ${color}`
      }} />
    </div>
  );
};

export default Card;
