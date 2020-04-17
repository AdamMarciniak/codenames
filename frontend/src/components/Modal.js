import React from 'react';
import ReactDOM from 'react-dom';

const ModalInner = props => {
  return (
    <div className="modal">
      <div className="modal-inner">
        <div className="text">
          {props.text}
        </div>
        <button onClick={() => props.setShowModal(false)}>OK</button>
      </div>
    </div>
  )
}

const Modal = props => {
  if (props.showModal) {
    return ReactDOM.createPortal(
      <ModalInner
        text={props.text}
        setShowModal={props.setShowModal}
      />, document.getElementById('modal-container'))
  } else {
    return null;
  }
}

export default Modal;
