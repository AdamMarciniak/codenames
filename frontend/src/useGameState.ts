import { useState, useEffect } from "react";
import { addListener, removeListener, getCurrentGameState } from "./gameStateWatcher";
import type Gamestate from '../types/.d'

let globalHasFetched: boolean = false;

export default () => {
  const [gameState, setGameState] = useState(getCurrentGameState());
  const [hasFetched, setHasFetched] = useState(globalHasFetched);
  useEffect(() => {
    globalHasFetched = true;
    setHasFetched(true);
    setGameState(getCurrentGameState());
    const listener = (newGameState : Gamestate) => {
      setGameState(newGameState);
    };
    addListener(listener);
    return () => {
      removeListener(listener);
    }
  }, [setGameState]);

  return [gameState, hasFetched];
}
