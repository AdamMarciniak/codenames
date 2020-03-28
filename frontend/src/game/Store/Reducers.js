import {
  FLIP_WORD,
  ADD_WORD,
  REMOVE_WORD,
  CHANGE_WORD_COLOR,
} from './WordsActions';

import {
  ADD_POINTS,
  REMOVE_POINTS,
  SET_CURRENT_TEAM,
  SET_GAME_OVER,
  INCREMENT_ROUND,
  DECREMENT_ROUND,
  SET_WINNER,
  SET_GAME_ID,
  SET_THIS_PLAYER,
  TOGGLE_CURRENT_TEAM,
} from './GameActions';

import {
  ADD_PLAYER,
  REMOVE_PLAYER,
  SET_PLAYER_TEAM,
  SET_PLAYER_SPYMASTER,
} from './PlayersActions';

import generateId from './Utils';
import { combineReducers } from 'redux';

const wordsInitialState = [
  { id: '0', word: 'icy', color: 'blue', flipped: false },
  { id: '1', word: 'defeated', color: 'blue', flipped: false },
  { id: '2', word: 'rare', color: 'red', flipped: false },
  { id: '3', word: 'protect', color: 'white', flipped: false },
];

const words = (state = wordsInitialState, action) => {
  switch (action.type) {
    case FLIP_WORD:
      return state.map(word =>
        word.id === action.id ? { ...word, flipped: !word.flipped } : word
      );

    case ADD_WORD:
      return state.concat({
        id: generateId(),
        word: action.word,
        type: null,
        flipped: false,
      });

    case REMOVE_WORD:
      return state.filter(word => word.id !== action.id);

    case CHANGE_WORD_COLOR:
      return state.map(word =>
        word.id === action.id ? { ...word, color: action.color } : word
      );

    default:
      return state;
  }
};

const gameInitialState = {
  id: 'FIXBY',
  round: 0,
  currentTeam: 'red',
  gameOver: false,
  winner: null,
  thisPlayer: null,
  points: {
    red: 0,
    blue: 0,
  },
};

const game = (state = gameInitialState, action) => {
  switch (action.type) {
    case ADD_POINTS:
      return {
        ...state,
        points: {
          ...state.points,
          [action.team]: state.points[action.team] + action.points,
        },
      };

    case REMOVE_POINTS:
      return {
        ...state,
        points: {
          ...state.points,
          [action.team]: state.points[action.team] - action.points,
        },
      };
    case SET_CURRENT_TEAM:
      return { ...state, currentTeam: action.currentTeam };
    case TOGGLE_CURRENT_TEAM:
      return {
        ...state,
        currentTeam: state.currentTeam === 'red' ? 'blue' : 'red',
      };

    case SET_GAME_OVER:
      return { ...state, gameOver: action.gameOver };

    case INCREMENT_ROUND:
      return { ...state, round: state.round + action.increment };
    case DECREMENT_ROUND:
      return { ...state, round: state.round - action.decrement };
    case SET_WINNER:
      return { ...state, winner: action.winner };
    case SET_GAME_ID:
      return { ...state, id: action.id };
    case SET_THIS_PLAYER:
      return { ...state, thisPlayer: action.id };
    default:
      return state;
  }
};

const playersInitialState = [
  { id: 'hsg261', name: 'Adam', team: 'red', spymaster: true },
  { id: 'hsg111', name: 'Sam', team: 'blue', spymaster: true },
  { id: 'h21ds1', name: 'DatBoy', team: 'red', spymaster: false },
];

const players = (state = playersInitialState, action) => {
  switch (action.type) {
    case ADD_PLAYER:
      return state.concat({
        id: generateId(),
        name: action.name,
        team: null,
        spymaster: false,
      });

    case REMOVE_PLAYER:
      return state.filter(player => player.id !== action.id);

    case SET_PLAYER_TEAM:
      return state.map(player =>
        player.id === action.id ? { ...player, team: action.team } : player
      );

    case SET_PLAYER_SPYMASTER:
      return state.map(player =>
        player.id === action.id
          ? { ...player, spymaster: action.spymaster }
          : player
      );
    default:
      return state;
  }
};

const reducer = combineReducers({
  game,
  players,
  words,
});

export { reducer, words, players, game };
