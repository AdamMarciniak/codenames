import React, { useState, useEffect } from "react";
import { useApiCall } from "../api";
import DrawBox from "./DrawBox";
import Modal from "../components/Modal";
import cookies from 'browser-cookies';

const JoinGame = ({ codeFromURL }) => {
  const [name, setName] = useState("");
  const [code, setCode] = useState(codeFromURL || "");
  const [avatar, setAvatar] = useState(null);
  const [error, setError] = useState(null);
  const [joinGame, joiningGame] = useApiCall(
    "joinGame",
    { name, roomCode: code.toUpperCase(), avatar: avatar, secret: cookies.get('secret') },
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
    } else if (error) {
      setHasJoinedGame(false);
    }
  }, [joiningGame, error]);

  const handleSubmit = async () => {
    setError(null);
    if (!/\S/.test(name)) {
      setModalText("Please enter a nickname!");
      setShowModal(true);
    } else {
      const { playerSecret } = await joinGame();
      cookies.set('secret', playerSecret, { expires: 365 });
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
        {!codeFromURL && (
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
