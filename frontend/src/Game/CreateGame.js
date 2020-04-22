import React, { useState, useEffect, useMemo } from "react";
import { useApiCall } from "../api";
import DrawBox from "./DrawBox";
import Modal from "../components/Modal";
import cookies from "browser-cookies";

const CreateGame = () => {
  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const secret = useMemo(() => cookies.get('secret'), []);
  const [createRoomAndGame, creatingGame] = useApiCall('createRoomAndGame', { name, avatar, secret }, setError);
  const [hasCreatedGame, setHasCreatedGame] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState("");

  useEffect(() => {
    if (creatingGame) {
      setHasCreatedGame(true);
    } else if (error) {
      setHasCreatedGame(false);
    }
  }, [creatingGame, error]);

  useEffect(() => {
    if (error) {
      setShowModal(true);
      setModalText(error.message);
    } else {
      setShowModal(false);
    }
  }, [error]);

  const handleSubmit = async () => {
    setError(null);
    if (!/\S/.test(name)) {
      setModalText("Please enter a nickname!");
      setShowModal(true);
    } else {
      const {playerSecret, roomCode} = await createRoomAndGame();
      cookies.set('secret', playerSecret, { expires: 365 });
      window.location.href = '/game/' + roomCode;
    }
  };

  return (
    <div className="form-wrap">
      <Modal setShowModal={setShowModal} showModal={showModal} text={modalText} />
      <div className="form">
        <label>
          First - Choose a nickname!
          <input
            value={name}
            placeholder="For example: Baby Yoda"
            onChange={(e) => setName(e.currentTarget.value)}
          />
        </label>
        <p>Draw Yourself!</p>
        <DrawBox setAvatar={setAvatar} />
        <button
          onClick={handleSubmit}
          disabled={creatingGame || hasCreatedGame}
        >
          Create Game
        </button>
      </div>
    </div>
  );
};

export default CreateGame;
