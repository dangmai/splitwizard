import { combineReducers, createStore } from "redux";
import {reducer as formReducer} from 'redux-form';

export const rootReducer = combineReducers({
  form: formReducer
});

export const store = createStore(rootReducer);