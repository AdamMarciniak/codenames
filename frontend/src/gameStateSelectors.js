export const getPlayer = (gameState, id) => ({
  ...gameState.players[id],
  avatarId: gameState.avatars.find(({ player_id }) => player_id === id).id
});

export const getCurrentPlayer = (gameState) => gameState.players[gameState.currentPlayerId];
export const getTeamPlayers = (gameState, inputTeam) => Object.values(gameState.players).filter(({ team }) => team === inputTeam);
export const getCurrentTurn = (gameState) => {
  if (
    getTeamPlayers(gameState, 'RED').length > 1 &&
    getTeamPlayers(gameState, 'BLUE').length > 1 &&
    Object.values(gameState.players).filter(({ isCluegiver }) => isCluegiver).length === 2
  ) {
    return gameState.currentTurn;
  } else {
    return null;
  }
}

export const getCanSwitchTeams = (gameState) =>{
  const currentPlayer = getCurrentPlayer(gameState);
  if (currentPlayer.isCluegiver) {
    return false;
  } else {
    return !gameState.words.find(({ flipped }) => flipped) || currentPlayer.team === 'OBSERVER';
  }
}
