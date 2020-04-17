import React from 'react';

const GameModal = props => {
  if (props.showModal) {
    return (
      <div className="game-modal">
        <div className="game-modal-inner">
          <div className="text">
            {props.children}
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
}

export default GameModal;
