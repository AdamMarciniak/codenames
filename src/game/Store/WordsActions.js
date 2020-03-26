const FLIP_WORD = "FLIP_WORD";
const ADD_WORD = "ADD_WORD";
const REMOVE_WORD = "REMOVE_WORDS";
const CHANGE_WORD_COLOR = "CHANGE_WORD_COLOR";

const flipWordAction = id => ({
  type: FLIP_WORD,
  id
});

const addWordAction = word => ({
  type: ADD_WORD,
  word
});

const removeWordAction = id => ({
  type: REMOVE_WORD,
  id
});

const changeWordColorAction = (id, color) => ({
  type: CHANGE_WORD_COLOR,
  id,
  color
});

export {
  changeWordColorAction,
  removeWordAction,
  addWordAction,
  flipWordAction,
  FLIP_WORD,
  ADD_WORD,
  REMOVE_WORD,
  CHANGE_WORD_COLOR
};
