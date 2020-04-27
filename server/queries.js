const { randomString } = require('./utils');
const Pool = require("pg").Pool;

const pool = new Pool(require('./dbConfig'));

const addGameWords = (gameId, wordType, count, word_set) => pool.query(
  `
    INSERT INTO game_words (word_id, game_id, type)
    (
      SELECT id, $1, $2
      FROM words
      WHERE id NOT IN (
        SELECT word_id
        FROM game_words
        WHERE game_id = $1
      )
      AND word_set = $4
      ORDER BY random()
      LIMIT $3
    )
  `,
  [gameId, wordType, count, word_set]
);

const createGame = async (gameCode, currentPlayerName, firstTeam) => {
  const secondTeam = firstTeam === "RED" ? "BLUE" : "RED";
  await pool.query('BEGIN');

  const insertGameResult = await pool.query(
    `INSERT INTO games (created_at, game_code) VALUES (current_timestamp, $1) RETURNING id`,
    [gameCode]
  );
  const gameId = insertGameResult.rows[0].id;

  const insertPlayerResult = await pool.query(
    `
      INSERT INTO players
        (game_id, name)
      VALUES
        (
          $1,
          $2
        )
      RETURNING id
    `,
    [gameId, currentPlayerName]
  );
  const currentPlayerId = insertPlayerResult.rows[0].id;

  await addGameWords(gameId, firstTeam, 9, 'DEFAULT');
  await addGameWords(gameId, secondTeam, 8, 'DEFAULT');
  await addGameWords(gameId, 'NEUTRAL', 7, 'DEFAULT');
  await addGameWords(gameId, 'ASSASSIN', 1, 'DEFAULT');

  await pool.query('COMMIT');


  return currentPlayerId;
}


const getGameStateForPlayer = async (playerId) => {
  await pool.query('BEGIN');
  const gameId = (await pool.query('SELECT game_id FROM players WHERE id = $1', [playerId])).rows[0].game_id;
  const gameCode = (await pool.query('SELECT game_code FROM games WHERE id = $1', [gameId])).rows[0].game_code;

  const startingTeam = (await pool.query(`
    SELECT DISTINCT
      type, COUNT(id) AS count
    FROM game_words WHERE type in ('RED', 'BLUE') AND game_id = $1 GROUP BY type ORDER BY count DESC LIMIT 1;
  `, [gameId])).rows[0].type

  const numberOfTurnEnds = (await pool.query(`
    SELECT
      COUNT(id) AS count
    FROM
      moves
    WHERE
      is_turn_end = true
    AND player_id IN (
      SELECT id FROM players WHERE game_id = $1
    )
  `,[gameId])).rows[0].count;

  let currentTurn;
  if (startingTeam === 'RED') {
    currentTurn = (numberOfTurnEnds % 2) === 0 ? 'RED' : 'BLUE';
  } else {
    currentTurn = (numberOfTurnEnds % 2) === 0 ? 'BLUE' : 'RED';
  }

  const playersResult = (await pool.query(
    `
      SELECT
        id,
        name,
        team,
        is_cluegiver
      FROM
        players
      WHERE
        game_id = (
          SELECT
            game_id
          FROM
            players
          WHERE
            id = $1
        )
    `,
    [playerId]
  )).rows;

  const avatars = (await pool.query(
    `
    SELECT
      player_id, id
    FROM
      avatars
    WHERE
      player_id IN (
    SELECT
      id
      FROM
        players
      WHERE
      game_id = (
        SELECT
          game_id
        FROM
          players
        WHERE
          id = $1
      )
    )
    `,
    [playerId]
  )).rows

  const players = {};

  playersResult.forEach(({ id, name, team, is_cluegiver }) => {
    players[id] = {
      id,
      name,
      team,
      isCluegiver: is_cluegiver,
    };
  });


  const words = (await pool.query(`
    SELECT
      words.id AS id,
      words.text AS text,

      CASE
        WHEN words.id IN (
          SELECT
            word_id
          FROM
            moves
          WHERE
            player_id
          IN (
            SELECT
              id
            FROM
              players
            WHERE
              game_id = $1
          )
        ) THEN true
        ELSE false
      END as flipped,

      game_words.type AS type

    FROM
      words
    INNER JOIN
      game_words
    ON
      game_words.word_id = words.id
    WHERE
      game_words.game_id = $1
    ORDER BY
      game_words.sort
    `,
    [gameId]
  )).rows;

  await pool.query('COMMIT');

  return {
    gameCode,
    currentTurn,
    players,
    words,
    avatars
  };
}

const joinGame = async (gameCode, name) => {
  return (await pool.query(
    `
      INSERT INTO
        players
          (game_id, name)
          (
            SELECT
            id, $2
            FROM
              games
            WHERE
              game_code = $1
          )
      RETURNING id
    `,
    [gameCode, name]
  )).rows[0].id
};

const joinTeam = async (playerId, team) => {
  return (await pool.query(
    `
    UPDATE
      players
    SET
      team = $1
    WHERE
      id = $2
    RETURNING id
    `, [team, playerId]
    )).rows[0].id
}

const becomeCluegiver = async (playerId) => {
  return (await pool.query(
    `
    UPDATE
      players
    SET
      is_cluegiver = true
    WHERE
      id = $1
    RETURNING id
    `, [playerId]
    )).rows[0].id
}


const isValidGameCode = async gameCode => {
       return (await pool.query(
        `
          SELECT
            id
          FROM
            games
          WHERE
            game_code = $1
        `,
        [gameCode]
      )).rows[0]
};


const addMove = async (playerId, wordId, isTurnEnd) => {

    await pool.query(
      `
      INSERT INTO
        moves
          (player_id, word_id, is_turn_end)
        VALUES
          ($1, $2, $3)
      `,
      [playerId, wordId, isTurnEnd]
    );

};

const isPlayerInActiveGame = async playerId => {
       return (await pool.query(
        `
          SELECT
            id
          FROM
            players
          WHERE
            id = $1
        `,
        [playerId]
      )).rows[0] ? true : false;
};

const savePlayerSecret = async (playerId, secret) => {

    await pool.query(
      `
      INSERT INTO
        secrets
          (player_id, secret)
        VALUES
          ($1, $2)
      `,
      [playerId, secret]
    );

};

const getPlayerForSecret = async (secret) => {

    await pool.query(
      `
      SELECT
        player_id
        FROM
        secrets
        WHERE
        secret = $1
      `,
      [secret]
    );

};

const insertAvatar = async (playerId, data) => {
  console.log('inserting avatar');
  await pool.query(
    `
    INSERT
    INTO
    avatars
    (player_id, image)
    values
    ($1, $2)`,
    [playerId, data]
  );
}

const getAvatar = async (id) => {
  return (await pool.query(
    `
    SELECT
    image
    from
    avatars
    WHERE
    id = $1`,
    [id]
  )).rows[0].image
}

const getAllImages = async () => {
  return (await pool.query(
    `
    SELECT
    *
    from
    avatars
    `
  )).rows
}


module.exports = {
  createGame,
  getGameStateForPlayer,
  joinGame,
  joinTeam,
  isValidGameCode,
  addMove,
  becomeCluegiver,
  isPlayerInActiveGame,
  savePlayerSecret,
  getPlayerForSecret,
  insertAvatar,
  getAvatar,
  getAllImages,
};
