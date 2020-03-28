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

  socket.on("identify", async ({secret}, callback) => {
    if (playerIdsBySecret[secret]) {
      registerPlayerSocket(playerIdsBySecret[secret], socket);
      respondSuccess(callback);
      onPlayerGameChanged(playerId);
    } else {
      respondError(callback, 404, 'Secret not recognized!');
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
      respondError(callback, 500, e.message);
    }
  });


  socket.on("joinGame", async ({ name, gameCode }, callback) => {
    try {
      if (!name) {
        return respondError(callback, 400, `The parameter "name" is missing or empty. (Must be string.)`);
      }

      if (!gameCode) {
        return respondError(callback, 400, `The parameter "gameCode" is missing or empty. (Must be string.)`);
      }

      if (! await db.isValidGameCode(gameCode)) {
        return respondError(callback, 400, `The Game code does not exist.`)
      }

      const playerId = await db.joinGame(
        gameCode,
        name
      );
      registerPlayerSocket(playerId, socket);
      registerPlayerSecret(playerId, randomString(40));

      onPlayerGameChanged(playerId);
      respondSuccess(callback);
    } catch (e) {
      respondError(callback, 500, e.message);
    }
  });

  authenticatedEndpoint(socket, "joinTeam", async (playerId, { team }, callback) => {
    if (!team) {
      return respondError(callback, 400, `The parameter "team" is missing or empty. (Must be string)`);
    }
    if (!(team === 'RED' || team === 'BLUE' || team === 'OBSERVER')){
      return respondError(callback, 400, `The parameter "team" is not valid. Choose "RED", "BLUE", or "OBSERVER"`);
    }

    try {
      await db.joinTeam(playerId, team);
      onPlayerGameChanged(playerId);
      respondSuccess(callback);
    }
    catch (e) {
      respondError(callback, 500, e.message)
    }
  });



  authenticatedEndpoint(socket, "becomeCluegiver", async (playerId, params, callback) => {
    try {
      db.becomeCluegiver(playerId);
      onPlayerGameChanged(playerId);
      respondSuccess(callback);

    } catch (e) {
      respondError(callback, 500, e.message);
    }
  });

  authenticatedEndpoint(socket, "revealWord", async (playerId, { wordId }, callback) => {
    if (!wordId) {
      return respondError(400, `The parameter "wordId" is missing or empty. (Must be Number.)`);
    }

    try {
      db.addMove(playerId, wordId, isTurnEnd = false);
      onPlayerGameChanged(playerId);
      respondSuccess(callback);

    } catch (e) {
      respondError(callback, 500, e.message);
    }
  });

  authenticatedEndpoint(socket, "endTurn", async (playerId, params,callback) => {

    try {
      db.addMove(playerId, wordId = null, isTurnEnd = true);
      onPlayerGameChanged(playerId);
      respondSuccess(callback);

    } catch (e) {
      respondError(callback, 500, e.message);
    }
    respondSuccess(callback);
  });
});
