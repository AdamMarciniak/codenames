const express = require("express");
const cors = require("cors");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get("/", (req, res) => res.send("Hello World!"));

const allGames = [{ id: "123", state: { code: "FIXBY" } }];

const doesCodeExist = requestCode => {
  return allGames.filter(game => game.state.code === requestCode).length > 0
    ? requestCode
    : null;
};

app.post("/codeExist", (req, res) => {
  const reqCode = req.body.code;
  console.log(reqCode);
  if (reqCode) {
    res.send({ code: doesCodeExist(reqCode) });
  } else {
    res.status(404).send("Nothing in req.body.code");
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
