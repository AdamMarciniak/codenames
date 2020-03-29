const { secretsByPlayerId, socketsByPlayerId } = require('./identities');

const db = require("./queries");

const formatGameStateForPlayer = (playerId, rawGameState) => ({
  ...rawGameState,
  currentPlayerId: playerId,
  currentPlayerSecret: secretsByPlayerId[playerId],
  words: rawGameState.players[playerId].isCluegiver ? rawGameState.words : rawGameState.words.map((wordObject) => ({
    ...wordObject,
    type: wordObject.flipped ? wordObject.type : 'UNKNOWN'
  }))
});

const broadcastGameState = (rawGameState) => {
  Object.keys(rawGameState.players).forEach((playerId) => {
    const formattedGameState = formatGameStateForPlayer(playerId, rawGameState);
    try {
      console.log(socketsByPlayerId[playerId], formattedGameState);
      socketsByPlayerId[playerId].emit('gameState', formattedGameState);
    } catch (e) {
      console.error(e);
    }
  });
}

module.exports = async (playerId) => broadcastGameState(await db.getGameStateForPlayer(playerId));
