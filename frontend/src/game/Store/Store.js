import { createStore } from 'redux';
import { reducer } from './Reducers';
import {
  addPlayerAction,
  removePlayerAction,
  setPlayerTeamAction,
  setPlayerSpymasterAction,
} from './PlayersActions';

import {
  addPointsAction,
  removePointsAction,
  setCurrentTeamAction,
  setGameOverAction,
  incrementRoundAction,
  decrementRoundAction,
  setWinnerAction,
  setGameId,
} from './GameActions';

import generateId from './Utils';

const words = [
  { id: generateId(), word: 'icy', color: 'blue', flipped: false },
  { id: generateId(), word: 'defeated', color: 'blue', flipped: false },
  { id: generateId(), word: 'rare', color: 'red', flipped: false },
  { id: generateId(), word: 'protect', color: 'white', flipped: false },
  { id: generateId(), word: 'detail', color: 'blue', flipped: false },
  { id: generateId(), word: 'arm', color: 'white', flipped: false },
  { id: generateId(), word: 'double', color: 'red', flipped: false },
  { id: generateId(), word: 'decision', color: 'blue', flipped: false },
  { id: generateId(), word: 'agonizing', color: 'red', flipped: false },
  { id: generateId(), word: 'curly', color: 'red', flipped: false },
  { id: generateId(), word: 'drag', color: 'red', flipped: false },
  { id: generateId(), word: 'motion', color: 'red', flipped: false },
  { id: generateId(), word: 'peace', color: 'blue', flipped: false },
  { id: generateId(), word: 'statuesque', color: 'blue', flipped: false },
  { id: generateId(), word: 'overflow', color: 'black', flipped: false },
  { id: generateId(), word: 'brown', color: 'red', flipped: false },
  { id: generateId(), word: 'bright', color: 'red', flipped: false },
  { id: generateId(), word: 'striped', color: 'blue', flipped: false },
  { id: generateId(), word: 'desire', color: 'red', flipped: false },
  { id: generateId(), word: 'boil', color: 'red', flipped: false },
  { id: generateId(), word: 'abandoned', color: 'white', flipped: false },
  { id: generateId(), word: 'well', color: 'blue', flipped: false },
  { id: generateId(), word: 'statuesque', color: 'blue', flipped: false },
  { id: '1234', word: 'peace', color: 'red', flipped: false },
];

const initialState = {
  game: {
    id: 'FIXBY',
    round: 0,
    currentTeam: 'blue',
    gameOver: false,
    winner: null,
    thisPlayer: null,
    points: {
      red: 0,
      blue: 0,
    },
  },

  players: [
    { id: 'hsg261', name: 'Adam', team: 'red', spymaster: true },
    { id: 'hsg111', name: 'Sam', team: 'blue', spymaster: true },
    { id: 'h21ds1', name: 'DatBoy', team: 'red', spymaster: false },
  ],

  words,
};

const store = createStore(reducer, initialState);

export default store;
