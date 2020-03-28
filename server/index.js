const io = require('./io');
const { randomString } = require("./utils");
const onPlayerGameChanged = require('./onPlayerGameChanged');
const { playerIdsBySecret, playerIdsBySocketId, registerPlayerSocket, unregisterSocket, registerPlayerSecret } = require('./identities');

const db = require("./queries");

const respondSuccess = (callback) => callback();
const respondError = (callback, errorCode, errorMessage) => callback({ code: errorCode, message: errorMessage });

const authenticatedEndpoint = (socket, endpoint, handler) => {
  socket.on(endpoint, async (...params) => {
    const playerId = playerIdsBySocketId[socket.id];
    await handler(playerId, ...params);
    onPlayerGameChanged(playerId);
  })
};





io.on("connection", socket => {
  console.log("a user connected");

  socket.on("identify", (secret) => {
    if (playerIdsBySecret[secret]) {
      registerPlayerSocket(playerIdsBySecret[secret], socket);
      respondSuccess(callback);
      onPlayerGameChanged(playerId);
    } else {
      respondError(404, 'Secret not recognized!');
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    unregisterSocket(socket.id);
  });

  socket.on("createGame", async ({ name }, callback) => {
    try {
      if (!name) {
        return respondError(400, `The parameter "name" is missing or empty. (Must be string.)`);
      }

      const firstTeam = Math.random() > 0.5 ? "RED" : "BLUE";

      const playerId = await db.createGame(
        randomString(5),
        name,
        firstTeam
      );

      registerPlayerSocket(playerId, socket);
      registerPlayerSecret(playerId, randomString(40));

      onPlayerGameChanged(playerId);
      respondSuccess(callback);
    } catch (e) {
      respondError(500, e.message);
    }
  });


  socket.on("joinGame", async ({ name, gameCode }, callback) => {
    try {
      if (!name) {
        return respondError(400, `The parameter "name" is missing or empty. (Must be string.)`);
      }

      if (!gameCode) {
        return respondError(400, `The parameter "gameCode" is missing or empty. (Must be string.)`);
      }

      const playerId = await db.joinGame(
        gameCode,
        currentPlayerName
      );

      registerPlayerSocket(playerId, socket);
      registerPlayerSecret(playerId, randomString(40));

      onPlayerGameChanged(playerId);
      respondSuccess(callback);
    } catch (e) {
      respondError(500, e.message);
    }
  });

  authenticatedEndpoint(socket, "joinTeam", async (playerId, { team }, callback) => {

    respondSuccess(callback);
  });

  authenticatedEndpoint(socket, "becomeCluegiver", async (playerId, { team }, callback) => {

    respondSuccess(callback);
  });

  authenticatedEndpoint(socket, "revealWord", async (playerId, { wordId }, callback) => {

    respondSuccess(callback);
  });

  authenticatedEndpoint(socket, "endTurn", async (playerId, callback) => {

    respondSuccess(callback);
  });
});
