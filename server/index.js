const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const io = require('./io');
require('log-timestamp');
const { randomString } = require("./utils");
const onPlayerGameChanged = require('./onPlayerGameChanged');
const { playerIdsBySocketId, registerPlayerSocket, unregisterSocket } = require('./identities');
const db = require("./queries");

const PORT = 8003;

app.use(bodyParser.json())
app.use(cors())

app.use('/static', express.static('/var/www/codenames/frontend/buildProduction/static'))

app.get('/', (req, res) => {
    app.use(express.static('/var/www/codenames/frontend/buildProduction'))
    res.sendFile('/var/www/codenames/frontend/buildProduction/index.html')
})

app.get(
  ['/new', '/join/:code', '/god', '/join', '/game/*', '/gallery'],
  (req, res) => {
      res.sendFile('/var/www/codenames/frontend/buildProduction/index.html')
    }
)

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
  socket.on("identify", async ({ secret, roomCode }, callback) => {
    const playerId = roomCode && await db.getPlayerId(roomCode, secret);

    if (playerId) {
      registerPlayerSocket(playerId, socket);
      onPlayerGameChanged(playerId);
      respondSuccess(callback);
    } else {
      respondError(callback, 404, `Uh oh, we couldn't find the room you're looking for!`);
    }
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected");
    unregisterSocket(socket.id);
  });

  const randomTeam = () => Math.random() > 0.5 ? "RED" : "BLUE";

  socket.on("createRoomAndGame", async ({ name, avatar, secret, word_set = 'DEFAULT' }, callback) => {
    if (!name) {
      return respondError(callback, 400, `The parameter "name" is missing or empty. (Must be string.)`);
    }

    const roomCode = randomString(5);
    const playerSecret = secret || randomString(40);

    const playerId = await db.createRoomAndGame(
      roomCode,
      name,
      avatar,
      playerSecret,
      randomTeam(),
      word_set
    );

    if (!playerId) {
      return respondError(callback, 500, 'Internal Server Error: Couldn\'t create game');
    }

    registerPlayerSocket(playerId, socket);
    onPlayerGameChanged(playerId);
    respondSuccess(callback, { roomCode, playerSecret });
  });


  socket.on("joinGame", async ({ name, roomCode, secret, avatar }, callback) => {
    if (!name) {
      return respondError(callback, 400, `The parameter "name" is missing or empty. (Must be string.)`);
    }

    if (!roomCode) {
      return respondError(callback, 400, `Missing Game Code. Did you mean to start a new game?`);
    }

    if (!await db.isValidroomCode(roomCode)) {
      return respondError(callback, 404, `We couldn't find a game with the code ${roomCode}`)
    }

    const playerSecret = secret || randomString(40);

    const playerId = await db.joinGame(
      roomCode,
      playerSecret,
      name
    );

    await db.insertAvatar(playerId, avatar)

    registerPlayerSocket(playerId, socket);

    onPlayerGameChanged(playerId);
    respondSuccess(callback, { playerSecret });
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
    await db.becomeCluegiver(playerId);
    onPlayerGameChanged(playerId);
    respondSuccess(callback);
  });

  authenticatedEndpoint(socket, "revealWord", async (playerId, { wordId }, callback) => {
    if (!wordId) {
      return respondError(callback, 400, `The parameter "wordId" is missing or empty. (Must be Number.)`);
    }
    await db.addMove(playerId, wordId, isTurnEnd = false);
    onPlayerGameChanged(playerId);
    respondSuccess(callback);
  });

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
    respondSuccess(callback, avatar);
  });

  authenticatedEndpoint(socket, "getLatestPlayerWords", async (playerId, {id}, callback) => {
    if (!playerId) {
      return respondError(callback, 400, `The parameter "playerId" is missing or empty. (Must be Number.)`);
    }
    console.log(playerId);
    console.log(id);
    const words = await db.getLatestPlayerWords(playerId);
    console.log(words);
    respondSuccess(callback, words);
  });

  authenticatedEndpoint(socket, "startNewGame", async (playerId, callback) => {
    await db.createNewGame(playerId, randomTeam(), word_set = 'DEFAULT');
    onPlayerGameChanged(playerId);
    respondSuccess(callback);
  });

  socket.on("getLatestGames", async (limit, callback) => {
    if (limit < 0) {
      respondError(callback, 404, 'Limit cannot be less than 0')
    } else {
      const gamesResult = await db.getLatestGames(limit);
      respondSuccess(callback, gamesResult);
    }
  })

  socket.on("getRooms", async (minPlayerCount, callback) => {
    const rooms = minPlayerCount ? await db.getRooms(minPlayerCount) : await db.getRooms(0) ;
    respondSuccess(callback, rooms);
  })

  socket.on("getLatestRooms", async (limit, callback) => {
    const latestRooms = limit ? await db.getLatestRooms(limit) : await db.getLatestRooms(100) ;
    respondSuccess(callback, latestRooms);
  })

});

app.listen(PORT, () => {
  console.log(`Codenames Server is running on port ${PORT}`)
})
