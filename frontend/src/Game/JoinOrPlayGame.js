import React, { useEffect, useCallback } from "react";
import useGameState from "../useGameState.ts";
import api, { socket } from "../api";
import Game from './Game';
import cookies from 'browser-cookies';
import JoinGame from './JoinGame';

const JoinOrPlayGame = ({ match: { params } }) => {
  const identify = useCallback(() => {
    const secret = cookies.get('secret');
    if (secret && params.code) {
      api('identify', {
        secret,
        roomCode: params.code
      });
    }
  }, [params.code]);

  useEffect(() => {
    identify();

    socket.on('reconnect', identify);

    return () => {
      socket.off('reconnect', identify);
    }
  }, [identify]);


  const [gameState, hasFetched] = useGameState();

  if (!hasFetched) {
    return null;
  } else if (gameState && gameState.roomCode === params.code) {
    return <Game />;
  } else {
    return <JoinGame codeFromURL={params.code} />
  }
};

export default JoinOrPlayGame;
