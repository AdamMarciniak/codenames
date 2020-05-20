const Pool = require("pg").Pool;

const pool = new Pool(require('./dbConfigTunnel'));

const query = async (...args) => {
  try {
    const result = await pool.query(...args);
    return result;
  } catch (e) {
    console.log("Error in query", ...args);
    throw e;
  }
}

const getPlayerId = async (roomCode, secret) => {
  const result = await query(
    `
      SELECT id
      FROM players
      WHERE secret = $2
      AND room_id = (
        SELECT id
        FROM rooms
        WHERE code = $1
      )
    `,
    [roomCode, secret]
  );
  if (result && result.rows && result.rows.length >= 1) {
    return result.rows[0].id;
  } else {
    return null;
  }
}

const addGameWords = (gameId, wordType, count, word_set) => query(
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

const createRoomAndGame = async (roomCode, currentPlayerName, avatar, currentPlayerSecret, firstTeam, word_set = 'DEFAULT') => {
  await query('BEGIN');

  const createRoomResult = await query(
    `
      INSERT INTO rooms
        (code)
      VALUES
        ($1)
      RETURNING
        id
    `,
    [roomCode]
  );

  const roomId = createRoomResult.rows[0].id

  await createGame(roomId, firstTeam, word_set);

  const insertPlayerResult = await query(
    `
      INSERT INTO players
        (room_id, name, secret)
      VALUES
        (
          $1,
          $2,
          $3
        )
      RETURNING
        id
    `,
    [roomId, currentPlayerName, currentPlayerSecret]
  );

  const currentPlayerId = insertPlayerResult.rows[0].id;

  await insertAvatar(currentPlayerId, avatar);

  await query('COMMIT');

  return currentPlayerId;
}

const createGame = async (roomId, firstTeam,  word_set =' DEFAULT', withTransaction = false) => {
  const secondTeam = firstTeam === "RED" ? "BLUE" : "RED";
  if (withTransaction) {
    await query('BEGIN');
  }

  const createGameResult = await query(
    `
      INSERT INTO games
        (created_at, room_id)
      VALUES
        (current_timestamp, $1)
      RETURNING
        id
    `,
    [roomId]
  );

  const gameId = createGameResult.rows[0].id;

  await addGameWords(gameId, firstTeam, 9, word_set);
  await addGameWords(gameId, secondTeam, 8, word_set);
  await addGameWords(gameId, 'NEUTRAL', 7, word_set);
  await addGameWords(gameId, 'ASSASSIN', 1, word_set);

  if (withTransaction) {
    await query('COMMIT');
  }
}

const createNewGame = async (playerId, firstTeam, word_set) => {
  await query('BEGIN');
  const roomId = (await query(`SELECT room_id FROM players WHERE id = $1`, [playerId])).rows[0].room_id;
  await query(`
    UPDATE players
    SET
      is_cluegiver = false,
      team = 'OBSERVER'
    WHERE
      room_id = $1;
  `, [roomId]);
  await createGame(roomId, firstTeam, word_set);
  await query('COMMIT');
}

const getGameStateForPlayer = async (playerId) => {
  await query('BEGIN');
  const roomId = (await query('SELECT room_id FROM players WHERE id = $1', [playerId])).rows[0].room_id;
  const roomCode = (await query('SELECT code FROM rooms WHERE id = $1', [roomId])).rows[0].code;
  const gameId = (await query('SELECT id FROM games WHERE room_id = $1 ORDER BY created_at DESC LIMIT 1', [roomId])).rows[0].id;

  const startingTeam = (await query(`
    SELECT DISTINCT
      type, COUNT(id) AS count
    FROM game_words WHERE type in ('RED', 'BLUE') AND game_id = $1 GROUP BY type ORDER BY count DESC LIMIT 1;
  `, [gameId])).rows[0].type

  const numberOfTurnEnds = (await query(`
    SELECT
      COUNT(moves.id) AS count
    FROM moves

    INNER JOIN players
    ON players.id = moves.player_id

    LEFT OUTER JOIN game_words
    ON game_words.word_id = moves.word_id

    WHERE moves.game_id = $1

    AND (
      game_words.game_id = $1
      OR
      game_words.game_id IS NULL
    )

    AND (
      is_turn_end = true
      OR
      (players.team = 'RED' AND game_words.type != 'RED')
      OR
      (players.team = 'BLUE' AND game_words.type != 'BLUE')
    )
  `, [gameId])).rows[0].count;

  let currentTurn;
  if (startingTeam === 'RED') {
    currentTurn = (numberOfTurnEnds % 2) === 0 ? 'RED' : 'BLUE';
  } else {
    currentTurn = (numberOfTurnEnds % 2) === 0 ? 'BLUE' : 'RED';
  }

  const playersResult = (await query(
    `
      SELECT
        id,
        name,
        team,
        is_cluegiver
      FROM
        players
      WHERE
        room_id = $1
    `,
    [roomId]
  )).rows;

  const avatars = (await query(
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
        room_id = $1
    )
    `,
    [roomId]
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

  const words = (await query(`
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
            game_id = $1
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

  const flippedWords = words.filter(({ flipped }) => flipped);
  const redFlippedWords = flippedWords.filter(({ type }) => type === 'RED');
  const blueFlippedWords = flippedWords.filter(({ type }) => type === 'BLUE');

  const assassinFlipperResult = (await query(`
    SELECT team
    FROM players
    WHERE id = (
      SELECT player_id
      FROM moves
      WHERE game_id = $1
      AND word_id = (
        SELECT word_id
        FROM game_words
        WHERE type = 'ASSASSIN'
        AND game_id = $1
      )
    )
  `, [gameId]));

  const assassinFlipper = assassinFlipperResult.rows && assassinFlipperResult.rows[0] && assassinFlipperResult.rows[0].team;

  const redWon = assassinFlipper === 'BLUE' || redFlippedWords.length === (startingTeam === 'RED' ? 9 : 8);
  const blueWon = assassinFlipper === 'RED' || blueFlippedWords.length === (startingTeam === 'BLUE' ? 9 : 8);

  let winner = null;

  if (redWon && !blueWon) {
    winner = 'RED';
  } else if (blueWon && !redWon) {
    winner = 'BLUE';
  }

  // if both teams win, just treat it as an un-won game.
  // if we throw an error here it might cause problems for people returning ot old games.

  await query('COMMIT');

  return {
    winner,
    roomCode,
    currentTurn,
    players,
    words,
    avatars
  };
}

const joinGame = async (roomCode, secret, name) => {
  return (await query(
    `
      INSERT INTO
        players
          (room_id, name, secret)
          (
            SELECT
              id, $2, $3
            FROM
              rooms
            WHERE
              code = $1
          )
      RETURNING id
    `,
    [roomCode, name, secret]
  )).rows[0].id
};

const joinTeam = async (playerId, team) => {
  return (await query(
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
  return (await query(
    `
    UPDATE
      players
    SET
      is_cluegiver = true
    WHERE
      id = $1
    RETURNING id
    `,
    [playerId]
  )).rows[0].id
}


const isValidroomCode = async roomCode => {
  return (await query(
    `
      SELECT
        id
      FROM
        rooms
      WHERE
        code = $1
    `,
    [roomCode]
  )).rows[0]
};

const addMove = async (playerId, wordId, isTurnEnd) => {
  await query(
    `
    INSERT INTO
      moves
        (player_id, word_id, game_id, is_turn_end)
      VALUES
        (
          $1,
          $2,
          (
            SELECT id
            FROM games
            WHERE room_id = (
              SELECT room_id
              FROM players
              WHERE id = $1
            )
            ORDER BY created_at DESC LIMIT 1
          ),
          $3
        )
    `,
    [playerId, wordId, isTurnEnd]
  );
};

const isPlayerInActiveGame = async playerId => {
  return (await query(
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

    await query(
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
  await query(
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
  await query(
    `
      INSERT INTO avatars
        (player_id, image)
      VALUES
        ($1, $2)
    `,
    [playerId, data]
  );
}

const getAvatar = async (id) => {
  return (await query(
    `
      SELECT
      image
      from
      avatars
      WHERE
      id = $1
    `,
    [id]
  )).rows[0].image
}

const getAllImages = async () => {
  return (await query(
    `
      SELECT
        *
      FROM
        avatars
    `
  )).rows
}

const getLatestGames = async (limit) => {
  return (await query(
    `
      SELECT * FROM games ORDER BY created_at DESC LIMIT $1
    `,[limit]
  )).rows
}

const getRoomCount = async (numPlayers) => {
  return (await query(
    `
    SELECT
      count(*)
    FROM 
    (
      SELECT
        room_id,
        count(distinct name)
      FROM players
      GROUP BY room_id
      HAVING count(distinct name) > $1
      ORDER BY count(distinct name) DESC
    ) AS t;
    `,[numPlayers]
  )).rows[0]
}

module.exports = {
  getPlayerId,
  createGame,
  createNewGame,
  createRoomAndGame,
  getGameStateForPlayer,
  joinGame,
  joinTeam,
  isValidroomCode,
  addMove,
  becomeCluegiver,
  isPlayerInActiveGame,
  savePlayerSecret,
  getPlayerForSecret,
  insertAvatar,
  getAvatar,
  getAllImages,
  getLatestGames,
  getRoomCount,
};
