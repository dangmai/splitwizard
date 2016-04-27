"use strict";

require("bootstrap/less/bootstrap.less");
require("./main.css");

import React from "react"
import ReactDOM from "react-dom"

import { Provider } from "react-redux";
import Form, { fields } from "./containers/form";
import { store } from "./reducers/index";
import { calculate } from "./actions/result";

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Form fields={fields} onSubmit={ values => store.dispatch(calculate(values.bills, values.people)) } />
      </Provider>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById("app")
);