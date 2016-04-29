"use strict";

require("file?name=robots.txt!../static/robots.txt");
require("file?name=humans.txt!../static/humans.txt");
require("!!file?name=apple-touch-icon.png!../static/apple-touch-icon.png");
require("bootstrap/less/bootstrap.less");
require("./main.css");

import React from "react"
import ReactDOM from "react-dom"

import { Provider } from "react-redux";
import Form, { fields } from "./containers/form";
import { store } from "./reducers/index";
import { calculate, clearResults } from "./actions/result";

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Form
          onSubmit={ values => store.dispatch(calculate(values.bills, values.people)) }
          onSubmitFail={ () => store.dispatch(clearResults()) } />
      </Provider>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById("app")
);