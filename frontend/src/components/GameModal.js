import React from 'react';
import ReactDOM from 'react-dom';

const ModalInner = props => {
  return (
    <div className="game-modal">
      <div className="game-modal-inner">
        <div className="text">
          {props.text}
        </div>
      </div>
    </div>
  )
}

const GameModal = props => {
  if (props.showModal) {
    return (<ModalInner text={props.text}/>)
  } else {
    return null;
  }
}

export default GameModal;