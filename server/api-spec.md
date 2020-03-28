Requests from Client to Server

  Format:
    ('MessageName', { parameter1: parameter1Type, parameter2: parameter2Type }) => returnType

  The GameState Type: (This is the response for every request)
    GameState = {
      gameCode: String,
      currentPlayerSecret: String,
      currentPlayerId: Number,
      currentTurn: 'RED' | 'BLUE',
      players: {
        [playerId: Number]: { id: Number, name: String, team: 'RED' | 'BLUE', isCluegiver: Boolean }
        ...
      },
      words: [
        {
          id: Number,
          text: String,
          flipped: Boolean,
          type: 'UNKNOWN' | 'RED' | 'BLUE' | 'NEUTRAL' | 'ASSASSIN', // if the current user is not a cluegiver, this will always be UNKNOWN if flipped is false.
        }
        ...
      ]
    }

  Error Types:
    NoActiveGameError = {
      code: 401,
      message: "It looks like you haven't joined a game yet"
    }

    GameNotFoundError = {
      code: 404,
      message: "We couldn't find a game could not be with the code ${gameCode}"
    }

    InvalidInputError = {
      code: 400,
      message: "The following parameters are missing or invalid: ${parameter1} (was empty), ${paremeter2} (expected string)" // etc
    }

    InvalidMoveError = {
      code: 400,
      message: "Word '${text}' with id ${wordId} is not in your current game!"
    }

    ConflictingMoveError = {
      code: 409,
      message: "That move has been made already"
    }

    ForbiddenMoveError = {
      code: 403,
      message: "Cluegivers and Spectators can not reveal cards or end turns"
    }

    ForbiddenJoinError = {
      code: 403,
      message: "Players cannot change teams after a guess has been made"
    }

    ConflictingCluegiverError = {
      code: 403,
      message: "Team ${team} already has a cluegiver"
    }



  // These two requests work if you haven't joined a game yet.

    Create Game: Creates a new game on the backend, and creates a new Spectator player.
      ('createGame', { name: String }) => GameState | InvalidInputError

    Join Game: Creates a new Spectator player.
      ('joinGame', { name: String, gameCode: String }) => GameState | GameNotFoundError | InvalidInputError



  // These requests fail if you haven't joined a game yet.

    Join Team: Assigns a player to a new team. 
      ('joinTeam', { team: 'RED' | 'BLUE' | 'SPECTATOR' }) => GameState | ForbiddenJoinTeamError | InvalidInputError | NoActiveGameError

    Become Cluegiver:
      ('becomeCluegiver' /* no second argument */) => GameState | ConflictingCluegiverError | NoActiveGameError

    RevealWord:
      ('revealWord', { secret: String, wordId: Number }) => GameState | InvalidInputError | InvalidMoveError | NoActiveGameError

    EndTurn:
      ('endTurn' /* no second argument */) => GameState | InvalidMoveError | NoActiveGameError
