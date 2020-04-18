import React, { useState, useEffect } from "react";
import { useApiCall } from "../api";
import DrawBox from "./DrawBox";
import Modal from "../components/Modal";

const CreateGame = () => {
  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [createRoomAndGame, creatingGame] = useApiCall('createRoomAndGame', { name, avatar }, setError);
  const [hasCreatedGame, setHasCreatedGame] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState("");

  useEffect(() => {
    if (creatingGame) {
      setHasCreatedGame(true);
    } else {
      setHasCreatedGame(false);
    }
  }, [creatingGame]);

  useEffect(() => {
    if (error) {
      setShowModal(true);
      setModalText(error.message);
    } else {
      setShowModal(false);
    }
  }, [error]);

  const handleSubmit = () => {
    if (!/\S/.test(name)) {
      setModalText("Please enter a nickname!");
      setShowModal(true);
    } else {
      createRoomAndGame();
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
