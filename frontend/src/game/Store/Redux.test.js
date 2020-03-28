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
  TOGGLE_CURRENT_TEAM,
  SET_GAME_OVER,
  INCREMENT_ROUND,
  DECREMENT_ROUND,
  SET_WINNER,
  SET_GAME_ID,
  SET_THIS_PLAYER,
} from './GameActions';

import {
  ADD_PLAYER,
  REMOVE_PLAYER,
  SET_PLAYER_TEAM,
  SET_PLAYER_SPYMASTER,
} from './PlayersActions';

import { words, game, players } from './Reducers';

const wordsInitialState = [
  { id: '0', word: 'icy', color: 'blue', flipped: false },
  { id: '1', word: 'defeated', color: 'blue', flipped: false },
  { id: '2', word: 'rare', color: 'red', flipped: false },
  { id: '3', word: 'protect', color: 'white', flipped: false },
];

describe('words reducer', () => {
  it('should return initial state', () => {
    expect(words(wordsInitialState, {})).toEqual([
      { id: '0', word: 'icy', color: 'blue', flipped: false },
      { id: '1', word: 'defeated', color: 'blue', flipped: false },
      { id: '2', word: 'rare', color: 'red', flipped: false },
      { id: '3', word: 'protect', color: 'white', flipped: false },
    ]);
  });

  // Generate ID may not work here...
  it('should handle FLIP_WORD', () => {
    expect(words(wordsInitialState, { type: FLIP_WORD, id: '0' })).toEqual([
      { id: '0', word: 'icy', color: 'blue', flipped: true },
      { id: '1', word: 'defeated', color: 'blue', flipped: false },
      { id: '2', word: 'rare', color: 'red', flipped: false },
      { id: '3', word: 'protect', color: 'white', flipped: false },
    ]);
  });

  it('should handle REMOVE_WORD', () => {
    expect(words(wordsInitialState, { type: REMOVE_WORD, id: '0' })).toEqual([
      { id: '1', word: 'defeated', color: 'blue', flipped: false },
      { id: '2', word: 'rare', color: 'red', flipped: false },
      { id: '3', word: 'protect', color: 'white', flipped: false },
    ]);
  });

  it('should handle CHANGE_WORD_COLOR', () => {
    expect(
      words(wordsInitialState, {
        type: CHANGE_WORD_COLOR,
        id: '0',
        color: 'red',
      })
    ).toEqual([
      { id: '0', word: 'icy', color: 'red', flipped: false },
      { id: '1', word: 'defeated', color: 'blue', flipped: false },
      { id: '2', word: 'rare', color: 'red', flipped: false },
      { id: '3', word: 'protect', color: 'white', flipped: false },
    ]);
  });
});

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

describe('game reducer', () => {
  it('should return initial state', () => {
    expect(game(gameInitialState, {})).toEqual({
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
    });
  });

  it('should handle ADD_POINTS', () => {
    expect(
      game(gameInitialState, { type: ADD_POINTS, points: 1, team: 'red' })
    ).toEqual({
      id: 'FIXBY',
      round: 0,
      currentTeam: 'red',
      gameOver: false,
      winner: null,
      thisPlayer: null,
      points: {
        red: 1,
        blue: 0,
      },
    });
  });

  it('should handle REMOVE_POINTS', () => {
    expect(
      game(gameInitialState, { type: REMOVE_POINTS, points: 1, team: 'red' })
    ).toEqual({
      id: 'FIXBY',
      round: 0,
      currentTeam: 'red',
      gameOver: false,
      winner: null,
      thisPlayer: null,
      points: {
        red: -1,
        blue: 0,
      },
    });
  });

  it('should handle SET_CURRENT_TEAM', () => {
    expect(
      game(gameInitialState, { type: SET_CURRENT_TEAM, currentTeam: 'blue' })
    ).toEqual({
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
    });
  });

  it('should handles TOGGLE_CURRENT_TEAM', () => {
    expect(game(gameInitialState, { type: TOGGLE_CURRENT_TEAM })).toEqual({
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
    });
  });

  it('should handle SET_GAME_OVER', () => {
    expect(
      game(gameInitialState, { type: SET_GAME_OVER, gameOver: true })
    ).toEqual({
      id: 'FIXBY',
      round: 0,
      currentTeam: 'red',
      gameOver: true,
      winner: null,
      thisPlayer: null,
      points: {
        red: 0,
        blue: 0,
      },
    });
  });

  it('should handle INCREMENT_ROUND', () => {
    expect(
      game(gameInitialState, { type: INCREMENT_ROUND, increment: 1 })
    ).toEqual({
      id: 'FIXBY',
      round: 1,
      currentTeam: 'red',
      gameOver: false,
      winner: null,
      thisPlayer: null,
      points: {
        red: 0,
        blue: 0,
      },
    });
  });

  it('should handle DECREMENT_ROUND', () => {
    expect(
      game(gameInitialState, { type: DECREMENT_ROUND, decrement: 1 })
    ).toEqual({
      id: 'FIXBY',
      round: -1,
      currentTeam: 'red',
      gameOver: false,
      winner: null,
      thisPlayer: null,
      points: {
        red: 0,
        blue: 0,
      },
    });
  });

  it('should handle SET_WINNER', () => {
    expect(game(gameInitialState, { type: SET_WINNER, winner: 'red' })).toEqual(
      {
        id: 'FIXBY',
        round: 0,
        currentTeam: 'red',
        gameOver: false,
        winner: 'red',
        thisPlayer: null,
        points: {
          red: 0,
          blue: 0,
        },
      }
    );
  });

  it('should handle SET_GAME_ID', () => {
    expect(game(gameInitialState, { type: SET_GAME_ID, id: 'TEST' })).toEqual({
      id: 'TEST',
      round: 0,
      currentTeam: 'red',
      gameOver: false,
      winner: null,
      thisPlayer: null,
      points: {
        red: 0,
        blue: 0,
      },
    });
  });

  it('should handle SET_THIS_PLAYER', () => {
    expect(
      game(gameInitialState, { type: SET_THIS_PLAYER, id: '12345abc' })
    ).toEqual({
      id: 'FIXBY',
      round: 0,
      currentTeam: 'red',
      gameOver: false,
      winner: null,
      thisPlayer: '12345abc',
      points: {
        red: 0,
        blue: 0,
      },
    });
  });
});

const playersInitialState = [
  { id: 'hsg261', name: 'Adam', team: 'red', spymaster: true },
  { id: 'hsg111', name: 'Sam', team: 'blue', spymaster: true },
  { id: 'h21ds1', name: 'DatBoy', team: 'red', spymaster: false },
];

describe('players reducer', () => {
  it('should return initial state', () => {
    expect(players(playersInitialState, {})).toEqual([
      { id: 'hsg261', name: 'Adam', team: 'red', spymaster: true },
      { id: 'hsg111', name: 'Sam', team: 'blue', spymaster: true },
      { id: 'h21ds1', name: 'DatBoy', team: 'red', spymaster: false },
    ]);
  });

  it('should handle REMOVE_PLAYER', () => {
    expect(
      players(playersInitialState, { type: REMOVE_PLAYER, id: 'hsg261' })
    ).toEqual([
      { id: 'hsg111', name: 'Sam', team: 'blue', spymaster: true },
      { id: 'h21ds1', name: 'DatBoy', team: 'red', spymaster: false },
    ]);
  });

  it('should handle SET_PLAYER_TEAM', () => {
    expect(
      players(playersInitialState, {
        type: SET_PLAYER_TEAM,
        id: 'hsg261',
        team: 'blue',
      })
    ).toEqual([
      { id: 'hsg261', name: 'Adam', team: 'blue', spymaster: true },
      { id: 'hsg111', name: 'Sam', team: 'blue', spymaster: true },
      { id: 'h21ds1', name: 'DatBoy', team: 'red', spymaster: false },
    ]);
  });

  it('should handle SET_PLAYER_SPYMASTER', () => {
    expect(
      players(playersInitialState, {
        type: SET_PLAYER_SPYMASTER,
        id: 'hsg261',
        spymaster: false,
      })
    ).toEqual([
      { id: 'hsg261', name: 'Adam', team: 'red', spymaster: false },
      { id: 'hsg111', name: 'Sam', team: 'blue', spymaster: true },
      { id: 'h21ds1', name: 'DatBoy', team: 'red', spymaster: false },
    ]);
  });
});
