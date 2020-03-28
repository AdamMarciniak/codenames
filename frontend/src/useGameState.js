import { listen } from "./api";
import { useState } from "react";

export default () => {
  const [gameState, setGameState] = useState(null);
  listen('gameState', (newGameState) => {
    console.log("received game state", newGameState);
    setGameState(newGameState);
  });
  return gameState;
}
