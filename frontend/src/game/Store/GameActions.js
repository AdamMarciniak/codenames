const ADD_POINTS = 'ADD_POINTS';
const REMOVE_POINTS = 'REMOVE_POINTS';
const SET_CURRENT_TEAM = 'SET_CURRENT_TEAM';
const SET_GAME_OVER = 'SET_GAME_OVER';
const INCREMENT_ROUND = 'INCREMENT_ROUND';
const DECREMENT_ROUND = 'DECREMENT_ROUND';
const SET_WINNER = 'SET_WINNER';
const SET_GAME_ID = 'SET_GAME_ID';
const SET_THIS_PLAYER = 'SET_THIS_PLAYER';
const TOGGLE_CURRENT_TEAM = 'TOGGLE_CURRENT_TEAM';

const addPointsAction = (points, team) => ({
  type: ADD_POINTS,
  points,
  team,
});

const removePointsAction = (points, team) => ({
  type: REMOVE_POINTS,
  points,
  team,
});

const setCurrentTeamAction = team => ({
  type: SET_CURRENT_TEAM,
  team,
});

const toggleCurrentTeamAction = () => ({
  type: TOGGLE_CURRENT_TEAM,
});

const setGameOverAction = gameOver => ({
  type: SET_GAME_OVER,
  gameOver,
});

const incrementRoundAction = increment => ({
  type: INCREMENT_ROUND,
  increment,
});

const decrementRoundAction = decrement => ({
  type: DECREMENT_ROUND,
  decrement,
});

const setWinnerAction = team => ({
  type: SET_WINNER,
  team,
});

const setGameIdAction = id => ({
  type: SET_GAME_ID,
  id,
});

const setThisPlayerAction = id => ({
  type: SET_THIS_PLAYER,
  id,
});

export {
  addPointsAction,
  removePointsAction,
  setCurrentTeamAction,
  toggleCurrentTeamAction,
  setGameOverAction,
  incrementRoundAction,
  decrementRoundAction,
  setWinnerAction,
  setGameIdAction,
  setThisPlayerAction,
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
};
