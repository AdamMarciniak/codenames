import {
  FLIP_WORD,
  ADD_WORD,
  REMOVE_WORD,
  CHANGE_WORD_COLOR
} from "./WordsActions";

const wordsReducer = (state, action) => {
  switch (action.type) {
    case FLIP_WORD:
      return state.map(word =>
        word.id === action.id ? { ...word, flipped: !word.flipped } : word
      );

    case ADD_WORD:
      return state.concat({
        id: generateId(),
        word: action.word,
        type: null,
        flipped: false
      });

    case REMOVE_WORD:
      return state.filter(word => word.id !== action.id);

    case CHANGE_WORD_COLOR:
      return state.map(word =>
        word.id === action.id ? { ...word, color: action.color } : word
      );

    default:
      return state;
  }
};

const playersReducer = (state, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export { wordsReducer, playersReducer };
