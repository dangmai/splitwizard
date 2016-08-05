import { combineReducers, createStore } from "redux";
import { reducer as formReducer } from "redux-form";
import result from "./result";

// Super basic reducer, so we just bundle it here
const saveReducer = (state = false, action) => {
  switch (action.type) {
    case "SAVE_COMPLETED":
      return true;
    default:
      return state;
  }
};

export const rootReducer = combineReducers({
  form: formReducer,
  saveCompleted: saveReducer,
  result,
});

export const store = createStore(rootReducer, undefined,
  window.devToolsExtension ? window.devToolsExtension() : undefined
);
