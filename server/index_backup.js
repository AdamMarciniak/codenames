const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const words = require("./wordList");

const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./queries");

const port = 3001;

console.log(words.words[0]);

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

const callback = res => console.log(res);

const startGame = async () => {
  const firstTeam = Math.random() > 0.5 ? "RED" : "BLUE";
  const secondTeam = firstTeam === "RED" ? "BLUE" : "RED";
  const gameCode = await db.createGame(callback);
  db.addWords(gameCode, firstTeam, 9, callback);
  db.addWords(gameCode, secondTeam, 8, callback);
  db.addWords(gameCode, "WHITE", 7, callback);
  db.addWords(gameCode, "BLACK", 1, callback);
  const gameWords = await db.getGameWords(gameCode).catch(e => console.log(e));
  const gameMoves = await db.getMoves(gameCode).catch(e => console.log(e));
  const players = await db.getPlayers(gameCode).catch(e => console.log(e));
  const state = getGameState(
    gameWords,
    gameMoves,
    players,
    firstTeam,
    gameCode
  );

  console.log(state);
};

const getGameState = (gameWords, gameMoves, players, firstTeam, gameCode) => {
  let currentTeam = firstTeam;
  const wordState = [];

  gameWords.forEach(word => {
    wordState.push({ id: word.word_id, text: word.text, flipped: false });
  });

  gameMoves.forEach(move => {
    if (currentTeam === "RED" && move.is_turn_end) {
      currentTeam = "BLUE";
    } else if (currentTeam === "BLUE" && move.is_turn_end) {
      currentTeam = "RED";
    }

    wordState.forEach(word => {
      if (word.id === move.word_id) {
        word.flipped = true;
      }
    });
  });

  return { words: wordState, players, currentTeam, gameCode };
};

const joinGame = async () => {
  const gameWords = await db.getGameWords(gameCode).catch(e => console.log(e));
  const gameMoves = await db.getMoves(gameCode).catch(e => console.log(e));

  const wordState = gameWords.map(word => ({
    text: word.text,
    id: word.id,
    flipped: false,
    type: null
  }));

  gameMoves.forEach(move => {
    if (move.word_id) {
      wordState.filter();
    }
  });
};

const checkID = async ID => {
  const idExists = await db
    .doesGameCodeExist(ID, callback)
    .catch(e => console.log(e));
  if (idExists) {
    console.log("Game ID exists");
    // Trigger go to next page..
  } else {
    console.log("Game ID does not exist");
  }
};

startGame();

const addPlayer = async (gameCode, name) => {
  return await db
    .addPlayer(gameCode, name, callback)
    .catch(e => console.log(e));
};

app.get("/", (req, res) => res.send("Hello World!"));

io.on("connection", socket => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("use disconnected");
  });

  socket.on("newWord", (word, cb) => {
    console.log(word);
    db.addWord(word, cb);
  });
});

http.listen(port, () => console.log(`Example app listening on port ${port}!`));
