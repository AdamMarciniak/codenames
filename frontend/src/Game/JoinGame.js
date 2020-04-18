import React, { useState, useEffect } from "react";
import useGameState from "../useGameState";
import { useApiCall } from "../api";
import DrawBox from "./DrawBox";
import Modal from "../components/Modal";
import Game from './Game';

const JoinGame = ({ match: { params } }) => {
  const gameState = useGameState();
  const [name, setName] = useState("");
  const [code, setCode] = useState(params.code || "");
  const [avatar, setAvatar] = useState(null);
  const [error, setError] = useState(null);
  const [joinGame, joiningGame] = useApiCall(
    "joinGame",
    { name, roomCode: code.toUpperCase(), avatar: avatar },
    setError
  );
  const [hasJoinedGame, setHasJoinedGame] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState("");

  useEffect(() => {
    if (error) {
      setShowModal(true);
      setModalText(error.message);
    } else {
      setShowModal(false);
    }
  }, [error]);

  useEffect(() => {
    if (joiningGame) {
      setHasJoinedGame(true);
    } else {
      setHasJoinedGame(false);
    }
  }, [joiningGame]);

  if (gameState && gameState.roomCode === params.code) {
    return <Game />;
  }

  const handleSubmit = () => {
    if (!/\S/.test(name)) {
      setModalText("Please enter a nickname!");
      setShowModal(true);
    } else {
      joinGame();
    }
  };

  return (
    <div className="form-wrap">
      <Modal
        setShowModal={setShowModal}
        showModal={showModal}
        text={modalText}
      />
      <div className="form">
        <label>
          Real quick: choose a nickname!
          <input
            value={name}
            placeholder="For Example: Baby Yoda"
            onChange={(e) => setName(e.currentTarget.value)}
          />
        </label>
        {!params.code && (
          <label>
            Game Code
            <input
              value={code}
              placeholder="ABCDE"
              onChange={(e) => setCode(e.currentTarget.value)}
            />
          </label>
        )}
        <p>Draw Yourself!</p>
        <DrawBox setAvatar={setAvatar} />
        <button disabled={joiningGame || hasJoinedGame} onClick={handleSubmit}>
          Join Game
        </button>
      </div>
    </div>
  );
};

export default JoinGame;
