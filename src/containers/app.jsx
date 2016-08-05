import React from "react";

import { Provider } from "react-redux";
import Form from "./form";
import { store } from "../reducers/index";
import { calculate, clearResults } from "../actions/result";

export const App = () => (
  <Provider store={store}>
    <Form
      onSubmit={values => store.dispatch(calculate(values.bills, values.people))}
      onSubmitFail={() => store.dispatch(clearResults())}
    />
  </Provider>
);
