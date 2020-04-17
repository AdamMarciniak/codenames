import React from 'react';
import './App.css';
import Gallery from './components/Gallery'


import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Menu from './Game/Menu';
import CreateGame from './Game/CreateGame';
import JoinGame from './Game/JoinGame';

function App({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/gallery" component={Gallery} />
        <Route path="/game/:code" component={JoinGame} />
        <Route path="/join" component={JoinGame} />
        <Route path="/new" component={CreateGame}
        <Route path="/" component={Menu}
      </Switch>
    </Router>
  );
}

export default App;
