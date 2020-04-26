const { secretsByPlayerId, socketsByPlayerId } = require('./identities');


const db = require("./queries");

const whoWon = rawGameState => {
  const words = rawGameState.words;
  const redWords = words.filter(word => word.type === 'RED');
  const blueWords = words.filter(word => word.type === 'BLUE');
  const redFlipped = redWords.filter(word => word.flipped === true)
  const blueFlipped = blueWords.filter(word => word.flipped === true)

  if (words.filter(word => word.type === 'ASSASSIN')[0].flipped === true) {
    if (rawGameState.currentTurn === 'RED') {
      return 'BLUE'
    } else {
      return 'RED'
    }
  }

  if (redWords.length === redFlipped.length) {
    return 'RED'
  } else if (blueWords.length === blueFlipped.length) {
    return 'BLUE'
  } else {
    return 'NULL'
  }
}

const formatGameStateForPlayer = (playerId, rawGameState) => ({
  ...rawGameState,
  winner: whoWon(rawGameState),
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


