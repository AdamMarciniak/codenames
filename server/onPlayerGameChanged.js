const { secretsByPlayerId, socketsByPlayerId } = require('./identities');
const db = require("./queries");

const getPoints = rawGameState => {
  const words = rawGameState.words;
  const redWords = words.filter(word => word.type === 'RED');
  const blueWords = words.filter(word => word.type === 'BLUE');
  const redFlippedCount = redWords.filter(word => word.flipped === true).length
  const blueFlippedCount = blueWords.filter(word => word.flipped === true).length

  return {
    'red': {
      'points': redFlippedCount ,
      'total':redWords.length
    },
    'blue': {
      'points': blueFlippedCount,
      'total':blueWords.length
    }
  }
}

const formatGameStateForPlayer = (playerId, rawGameState) => ({
  ...rawGameState,
  points: getPoints(rawGameState),
  currentPlayerId: playerId,
  currentPlayerSecret: secretsByPlayerId[playerId],
  words: rawGameState.players[playerId].isCluegiver ? rawGameState.words : rawGameState.words.map((wordObject) => ({
    ...wordObject,
    type: wordObject.flipped ? wordObject.type : 'UNKNOWN'
  }))
});

const broadcastGameState = (rawGameState) => {
  Object.keys(rawGameState.players).forEach((playerId) => {
    if (socketsByPlayerId[playerId]) {
      const formattedGameState = formatGameStateForPlayer(playerId, rawGameState);
      try {
        socketsByPlayerId[playerId].emit('gameState', formattedGameState);
      } catch (e) {
        console.error(e);
      }
    }
  });
}

module.exports = async (playerId) => {
  try {
    const gameState = await db.getGameStateForPlayer(playerId);
    return broadcastGameState(gameState);
  } catch (e) {
    console.log(`Error getting game state for player ${playerId}`);
    console.trace();
    throw e;
  }
};


