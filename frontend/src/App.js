import React from 'react';
import './App.css';
import Game, { Menu, JoinGame, CreateGame } from './Game/Game';
import God from './God/God';
import Gallery from './components/Gallery'

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App({ history }) {
  return (
    <Router history={history}>
      <Switch>
      <Route path="/gallery">
        <Gallery />
      </Route>
        <Route path="/god">
          <God />
        </Route>
        <Route path="/game/:code" component={JoinGame} />
        <Route path="/join" component={JoinGame} />
        <Route path="/new">
          <CreateGame />
        </Route>
        <Route path="/">
          <Menu />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
