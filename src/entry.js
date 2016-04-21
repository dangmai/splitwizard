"use strict";

// import { validateDate } from "./utils";

// require("../node_modules/bootstrap/dist/css/bootstrap.css");
// require("../node_modules/bootstrap-datepicker/dist/css/bootstrap-datepicker.css");
// require("../node_modules/font-awesome/css/font-awesome.css");
// require("./main.css");

import React from "react"
import ReactDOM from "react-dom"

import { Provider } from "react-redux";
import Form, { fields } from "./containers/form"
import { store } from "./reducers/index"

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Form fields={fields} onSubmit={() => { console.log(store.getState().form.appForm); }} />
      </Provider>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById("app")
);