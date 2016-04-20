import { combineReducers, createStore } from "redux";
import { people } from "./people";
import { bills } from "./bills";

export const rootReducer = combineReducers({
  people,
  bills
});

export const store = createStore(rootReducer);