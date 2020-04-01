const playerIdsBySocketId = {};
const socketsByPlayerId = {};

const playerIdsBySecret = {};
const secretsByPlayerId = {};

const registerPlayerSocket = (playerId, socket) => {
  playerIdsBySocketId[socket.id] = playerId;
  socketsByPlayerId[playerId] = socket;
}

const registerPlayerSecret = (playerId, secret) => {
  secretsByPlayerId[playerId] = secret;
  playerIdsBySecret[secret] = playerId;
}

const unregisterSocket = (socketId) => {
  const playerId = playerIdsBySocketId[socketId];
  //delete socketsByPlayerId[playerId];
  //delete playerIdsBySocketId[socketId];
}

module.exports = {
  playerIdsBySocketId,
  socketsByPlayerId,

  playerIdsBySecret,
  secretsByPlayerId,

  registerPlayerSocket,
  registerPlayerSecret,
  unregisterSocket,
}
