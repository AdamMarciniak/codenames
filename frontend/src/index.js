import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import cookies from 'browser-cookies';

import api from './api';
import { addListener } from './gameStateWatcher';
import { createBrowserHistory } from 'history';
const history = createBrowserHistory();

console.log('Welcome to the game, friends.')

addListener((gameState) => {
  if (gameState && !history.location.pathname.includes('/game')) {
    window.location.href = '/game';
  } else if (!gameState && history.location.pathname.includes('/game')) {
    window.location.href = '/';
  }
});

export const render = () => {
  ReactDOM.render(
    <React.StrictMode>
      <App history={history} />
    </React.StrictMode>,
    document.getElementById('root')
  );
}

const secret = cookies.get('secret');
if (secret) {
  api('identify', { secret }).then(render).catch(() => {
    cookies.erase('secret');
    render();
  });
} else {
  if (history.location.pathname.includes('/game')) {
    window.location.href = '/';
  }
  render();
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
