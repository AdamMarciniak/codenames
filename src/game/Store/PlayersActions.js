const ADD_PLAYER = 'ADD_PLAYER';
const REMOVE_PLAYER = 'REMOVE_PLAYER';
const SET_PLAYER_TEAM = 'SET_PLAYER_TEAM';
const SET_PLAYER_SPYMASTER = 'SET_PLAYER_SPYMASTER';

const addPlayerAction = name => ({
  type: ADD_PLAYER,
  name,
});

const removePlayerAction = id => ({
  type: REMOVE_PLAYER,
  id,
});

const setPlayerTeamAction = (id, team) => ({
  type: SET_PLAYER_TEAM,
  id,
  team,
});

const setPlayerSpymasterAction = (id, spymaster) => ({
  type: SET_PLAYER_SPYMASTER,
  id,
  spymaster,
});

export {
  addPlayerAction,
  removePlayerAction,
  setPlayerTeamAction,
  setPlayerSpymasterAction,
  ADD_PLAYER,
  REMOVE_PLAYER,
  SET_PLAYER_TEAM,
  SET_PLAYER_SPYMASTER,
};
