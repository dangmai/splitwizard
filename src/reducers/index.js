import { combineReducers, createStore } from "redux";
import { reducer as formReducer } from 'redux-form';
import { result } from "./result";

export const rootReducer = combineReducers({
  form: formReducer,
  result
});

export const store = createStore(rootReducer);