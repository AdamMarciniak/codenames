const io = require('./io');
require('log-timestamp');
const { randomString } = require("./utils");
const onPlayerGameChanged = require('./onPlayerGameChanged');
const { playerIdsBySecret, playerIdsBySocketId, registerPlayerSocket, unregisterSocket, registerPlayerSecret } = require('./identities');

const db = require("./queries");

const respondSuccess = (callback, result) => callback(null, result);
const respondError = (callback, errorCode, errorMessage) => callback({ code: errorCode, message: errorMessage });

const authenticatedEndpoint = (socket, endpoint, handler) => {
  socket.on(endpoint, async (...params) => {
    const playerId = playerIdsBySocketId[socket.id];
    await handler(playerId, ...params);
  })
};

io.on("connection", socket => {
  console.log("a user connected");
  socket.on("identify", async ({ secret }, callback) => {
    const playerId = playerIdsBySecret[secret]
    if (playerId) {
      registerPlayerSocket(playerId, socket);
      onPlayerGameChanged(playerId);
      respondSuccess(callback);
    } else {
      respondError(callback, 404, `Secret ${secret} not recognized!`);
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    unregisterSocket(socket.id);
  });

  socket.on("getAvatars", async ({playerId}, callback) => {
    try {
      if (!playerId) {
        return respondError(callback, 400, `The parameter "playerId" is missing or empty. (Must be integer.)`);
      }
    } catch (e) {
      respondError(callback, 500, e.message);
    }
  });

  socket.on("createGame", async ({ name, avatar }, callback) => {
    try {
      if (!name) {
        return respondError(callback, 400, `The parameter "name" is missing or empty. (Must be string.)`);
      }

      const firstTeam = Math.random() > 0.5 ? "RED" : "BLUE";

      const playerId = await db.createGame(
        randomString(5),
        name,
        firstTeam
      );

      await db.insertAvatar(playerId, avatar)

      registerPlayerSocket(playerId, socket);
      registerPlayerSecret(playerId, randomString(40));
      onPlayerGameChanged(playerId);
      respondSuccess(callback);
    } catch (e) {
      respondError(callback, 500, e.message);
    }
  });


  socket.on("joinGame", async ({ name, gameCode, avatar }, callback) => {
    try {
      if (!name) {
        return respondError(callback, 400, `The parameter "name" is missing or empty. (Must be string.)`);
      }

      if (!gameCode) {
        return respondError(callback, 400, `The parameter "gameCode" is missing or empty. (Must be string.)`);
      }

      if (! await db.isValidGameCode(gameCode)) {
        return respondError(callback, 404, `We couldn't find a game with the code ${gameCode}`)
      }

      const playerId = await db.joinGame(
        gameCode,
        name
      );
      await db.insertAvatar(playerId, avatar)
      const secret = randomString(40);

      registerPlayerSocket(playerId, socket);
      registerPlayerSecret(playerId, secret);

      onPlayerGameChanged(playerId);
      respondSuccess(callback);
    } catch (e) {
      respondError(callback, 500, e.message);
    }
  });

  socket.on("getAllImages", async (params=null, callback) => {
    try {
      respondSuccess(callback, await db.getAllImages());
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
      if (! await db.isPlayerInActiveGame(playerId)) {
        return respondError(callback, 401, `It looks like you haven't joined a game yet. ` )
      }
      db.becomeCluegiver(playerId);
      onPlayerGameChanged(playerId);
      respondSuccess(callback);

    } catch (e) {
      respondError(callback, 500, e.message);
    }
  });

  authenticatedEndpoint(socket, "revealWord", async (playerId, { wordId }, callback) => {
    if (!wordId) {
      return respondError(callback, 400, `The parameter "wordId" is missing or empty. (Must be Number.)`);
    }

    try {
      if (! await db.isPlayerInActiveGame(playerId)) {
        return respondError(callback, 401, `It looks like you haven't joined a game yet. ` )
      }
      db.addMove(playerId, wordId, isTurnEnd = false);
      onPlayerGameChanged(playerId);
      respondSuccess(callback);

    } catch (e) {
      respondError(callback, 500, e.message);
    }
  });



//   also add two queries: savePlayerSecret (playerId, secret) and getPlayerForSecret (secret)
// and then replace references to the current secret object with async references to those



  authenticatedEndpoint(socket, "endTurn", async (playerId, params,callback) => {

    try {
      if (! await db.isPlayerInActiveGame(playerId)) {
        return respondError(callback, 401, `It looks like you haven't joined a game yet. `)
      }

      await db.addMove(playerId, wordId = null, isTurnEnd = true);
      onPlayerGameChanged(playerId);
      respondSuccess(callback);

    } catch (e) {
      respondError(callback, 500, e.message);
    }
  });

  authenticatedEndpoint(socket, "getAvatar", async (playerId, { id }, callback) => {
    if (!id) {
      return respondError(callback, 400, `The parameter "id" is missing or empty. (Must be Number.)`);
    }

    try {
      if (!await db.isPlayerInActiveGame(playerId)) {
        return respondError(callback, 401, `It looks like you haven't joined a game yet. ` )
      }

      const avatar = await db.getAvatar(id);

      onPlayerGameChanged(playerId);
      respondSuccess(callback, avatar);

    } catch (e) {
      respondError(callback, 500, e.message);
    }
  });
});
