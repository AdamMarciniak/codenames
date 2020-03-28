const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "codenames",
  password: "ffffff",
  port: 5432
});

const randomString = (length = 5) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let output = "";
  for (let i = 0; i < length; i += 1) {
    output += chars[Math.floor(Math.random() * chars.length)];
  }
  return output;
};

const createGame = callback => {
  return new Promise((resolve, reject) => {
    if (callback) {
      const gameCode = randomString();
      pool.query(
        `INSERT INTO games (created_at, game_code) VALUES (current_timestamp, '${gameCode}');`,
        (err, result) => {
          if (err) {
            callback(err);
            reject(console.log("Error"));
          }
          callback("ok", result.rows);
          console.log(gameCode);
          resolve(gameCode);
        }
      );
    }
  });
};

const addWords = (gameCode, type, count, callback) => {
  if (gameCode && type && count && callback) {
    pool.query(`INSERT INTO game_words (word_id, game_code, type) 
    (
      SELECT id, '${gameCode}', '${type}'
      FROM words 
      WHERE id NOT IN (
        SELECT word_id 
        FROM game_words 
        WHERE game_code = '${gameCode}'
      ) 
      ORDER BY random() 
      LIMIT ${count}
    )`),
      (err, result) => {
        if (err) {
          callback(err);
          return;
        }
        callback("ok", result.rows);
        return;
      };
  } else {
    callback("failed args null");
  }
};

const addPlayer = (gameCode, name, callback) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO players (game_code, name, team) VALUES ('${gameCode}', '${name}', 'OBSERVER') returning *`,
      (err, result) => {
        if (err) {
          console.log("Error Occured Adding Player");
          console.log(err);
          reject(false);
        } else {
          const playerInfo = result.rows;
          console.log(`Player Added. ${JSON.stringify(playerInfo)} `);
          resolve(true);
        }
      }
    );
  });
};

const gameCodeDoesExist = (gameCode, callback) => {
  return new Promise((resolve, reject) => {
    if (gameCode) {
      pool.query(
        `SELECT * FROM games WHERE game_code = '${gameCode}'`,
        (err, result) => {
          if (err) {
            console.log("Error Occured");
            console.log(err);
            reject(false);
          } else if (result.rows.length === 0) {
            console.log(`ID: ${gameCode} Does not exist`);
            reject(false);
          } else {
            console.log(`ID: ${gameCode} Does exist`);
            resolve(true);
          }
        }
      );
    }
  });
};

const getGameWords = gameCode => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT * FROM game_words WHERE game_code = '${gameCode}'`,
      (err, result) => {
        if (err) {
          console.log("Error Occured Getting Game Words");
          console.log(err);
          reject(false);
        } else {
          console.log(`Received Game Words`);
          resolve(result.rows);
        }
      }
    );
  });
};

const getMoves = gameCode => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT * FROM moves WHERE game_code = '${gameCode}' ORDER BY id`,
      (err, result) => {
        if (err) {
          console.log("Error Occured Getting  Moves");
          console.log(err);
          reject(false);
        } else {
          console.log(`Received  Moves`);
          resolve(result.rows);
        }
      }
    );
  });
};

const addMove = (gameCode, word_id, isTurnEnd) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO moves (game_code, word_id, is_turn_end) VALUES ('${gameCode}', '${word_id}', ${
        isTurnEnd ? "TRUE" : "FALSE"
      })`,
      (err, result) => {
        if (err) {
          console.log("Error Occured Adding  Move");
          console.log(err);
          reject(false);
        } else {
          console.log(`Added  Move`);
          resolve(result.rows);
        }
      }
    );
  });
};

module.exports = {
  addWords,
  createGame,
  addPlayer,
  gameCodeDoesExist,
  getGameWords,
  getMoves,
  addMove
};
