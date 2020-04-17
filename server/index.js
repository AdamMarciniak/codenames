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
    const callback = params[params.length - 1];
    try {
      const playerId = playerIdsBySocketId[socket.id];
      if (!await db.isPlayerInActiveGame(playerId)) {
        return respondError(callback, 401, `It looks like you haven't joined a game yet.`)
      }
      await handler(playerId, ...params);
    } catch (e) {
      console.error(e);
      respondError(callback, 500, e.message);
    }
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
    console.log("a user disconnected");
    unregisterSocket(socket.id);
  });

  const randomTeam = () => Math.random() > 0.5 ? "RED" : "BLUE";

  socket.on("createRoomAndGame", async ({ name, avatar }, callback) => {
    if (!name) {
      return respondError(callback, 400, `The parameter "name" is missing or empty. (Must be string.)`);
    }

    const playerId = await db.createRoomAndGame(
      randomString(5),
      name,
      avatar,
      randomTeam()
    );

    registerPlayerSocket(playerId, socket);
    registerPlayerSecret(playerId, randomString(40));
    onPlayerGameChanged(playerId);
    respondSuccess(callback);
  });


  socket.on("joinGame", async ({ name, roomCode, avatar }, callback) => {
    if (!name) {
      return respondError(callback, 400, `The parameter "name" is missing or empty. (Must be string.)`);
    }

    if (!roomCode) {
      return respondError(callback, 400, `Missing Game Code. Did you mean to start a new game?`);
    }

    if (! await db.isValidroomCode(roomCode)) {
      return respondError(callback, 404, `We couldn't find a game with the code ${roomCode}`)
    }

    const playerId = await db.joinGame(
      roomCode,
      name
    );
    await db.insertAvatar(playerId, avatar)
    const secret = randomString(40);

    registerPlayerSocket(playerId, socket);
    registerPlayerSecret(playerId, secret);

    onPlayerGameChanged(playerId);
    respondSuccess(callback);
  });

  socket.on("getAllImages", async (params=null, callback) => {
    respondSuccess(callback, await db.getAllImages());
  });

  authenticatedEndpoint(socket, "joinTeam", async (playerId, { team }, callback) => {
    if (!team) {
      return respondError(callback, 400, `The parameter "team" is missing or empty. (Must be string)`);
    }
    if (!(team === 'RED' || team === 'BLUE' || team === 'OBSERVER')){
      return respondError(callback, 400, `The parameter "team" is not valid. Choose "RED", "BLUE", or "OBSERVER"`);
    }

    await db.joinTeam(playerId, team);
    onPlayerGameChanged(playerId);
    respondSuccess(callback);
  });



  authenticatedEndpoint(socket, "becomeCluegiver", async (playerId, params, callback) => {
    db.becomeCluegiver(playerId);
    onPlayerGameChanged(playerId);
    respondSuccess(callback);
  });

  authenticatedEndpoint(socket, "revealWord", async (playerId, { wordId }, callback) => {
    if (!wordId) {
      return respondError(callback, 400, `The parameter "wordId" is missing or empty. (Must be Number.)`);
    }

    db.addMove(playerId, wordId, isTurnEnd = false);
    onPlayerGameChanged(playerId);
    respondSuccess(callback);
  });



//   also add two queries: savePlayerSecret (playerId, secret) and getPlayerForSecret (secret)
// and then replace references to the current secret object with async references to those



  authenticatedEndpoint(socket, "endTurn", async (playerId, params, callback) => {
    await db.addMove(playerId, wordId = null, isTurnEnd = true);
    onPlayerGameChanged(playerId);
    respondSuccess(callback);
  });

  authenticatedEndpoint(socket, "getAvatar", async (playerId, { id }, callback) => {
    if (!id) {
      return respondError(callback, 400, `The parameter "id" is missing or empty. (Must be Number.)`);
    }

    const avatar = await db.getAvatar(id);

    onPlayerGameChanged(playerId);
    respondSuccess(callback, avatar);
  });

  authenticatedEndpoint(socket, "startNewGame", async (playerId, params, callback) => {
    await db.createNewGame(playerId, randomTeam());

    onPlayerGameChanged(playerId);
    respondSuccess(callback);
  });
});
