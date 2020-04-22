import { useState, useEffect } from "react";
import { addListener, removeListener, getCurrentGameState } from "./gameStateWatcher";

let globalHasFetched = false;

export default () => {
  const [gameState, setGameState] = useState(getCurrentGameState());
  const [hasFetched, setHasFetched] = useState(globalHasFetched);
  useEffect(() => {
    globalHasFetched = true;
    setHasFetched(true);
    setGameState(getCurrentGameState());
    const listener = (newGameState) => {
      setGameState(newGameState);
    };
    addListener(listener);
    return () => {
      removeListener(listener);
    }
  }, [setGameState]);

  return [gameState, hasFetched];
}
