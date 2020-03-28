import React from 'react';
import './App.css';
import Game, { JoinGame, CreateGame } from './Game/Game';
import God from './God/God';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/god">
          <God />
        </Route>
        <Route path="/join/:id">
          <JoinGame />
        </Route>
        <Route path="/join">
          <JoinGame />
        </Route>
        <Route path="/new">
          <CreateGame />
        </Route>
        <Route path="/">
          <Game />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
