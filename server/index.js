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
  const addMove = await db
    .addMove("HCNQF", gameWords[0].id, false)
    .catch(e => console.log(e));
  const gameMoves = await db.getMoves("HCNQF").catch(e => console.log(e));
  console.log(JSON.stringify(gameMoves));
};

const checkID = async ID => {
  const idExists = await db
    .gameCodeDoesExist(ID, callback)
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
  const result = await db
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
