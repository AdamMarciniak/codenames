import { useState, useEffect } from "react";
import { addListener, removeListener, getCurrentGameState } from "./gameStateWatcher";

export default () => {
  const [gameState, setGameState] = useState(getCurrentGameState());
  useEffect(() => {
    setGameState(getCurrentGameState());
    const listener = (newGameState) => {
      setGameState(newGameState);
    };
    addListener(listener);
    return () => {
      removeListener(listener);
    }
  }, [setGameState]);

  return gameState;
}
