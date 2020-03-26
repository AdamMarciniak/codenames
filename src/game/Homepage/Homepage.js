import React, { useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';

const handleCheckCode = (inputCode, callback) => {
  fetch('http://localhost:3001/codeExist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: inputCode }),
  })
    .then(response => {
      if (response.status !== 200) {
        console.log(
          'Looks like there was a problem. Status Code: ' + response.status
        );
        return;
      }

      // Examine the text in the response
      response.json().then(function(data) {
        console.log(data);
        if (data.code) {
          callback();
        }
        return;
      });
    })
    .catch(function(err) {
      console.log('Fetch Error :-S', err);
    });
};

const showUsernamePage = props => {
  props.history.push('/game');
};

const Homepage = props => {
  const inputRef = useRef(null);

  const handleGameCodeClick = () => {
    const inputCode = inputRef.current.value;

    handleCheckCode(inputCode, () => showUsernamePage(props));
  };

  return (
    <div>
      <button>Create New Game</button>
      <h2>OR</h2>
      <h1>Enter Game Code</h1>
      <input type="text" placeholder="Enter Code Here" ref={inputRef}></input>
      <button onClick={handleGameCodeClick}>Enter Game</button>
    </div>
  );
};

export default withRouter(Homepage);
