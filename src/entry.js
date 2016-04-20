"use strict";

// import { validateDate } from "./utils";

// require("../node_modules/bootstrap/dist/css/bootstrap.css");
// require("../node_modules/bootstrap-datepicker/dist/css/bootstrap-datepicker.css");
// require("../node_modules/font-awesome/css/font-awesome.css");
// require("./main.css");

import React from "react"
import ReactDOM from "react-dom"
import injectTapEventPlugin from "react-tap-event-plugin";
import lightBaseTheme from "material-ui/styles/baseThemes/lightBaseTheme";
import getMuiTheme from "material-ui/styles/getMuiTheme";

import { Provider } from "react-redux";
import { People } from "./containers/People/index"
import { store } from "./reducers/index"

// Needed for onTouchTap 
// http://stackoverflow.com/a/34015469/988941 
injectTapEventPlugin();

class App extends React.Component {
  static childContextTypes = {
    muiTheme: React.PropTypes.object
  };

  getChildContext() {
    return {
      muiTheme: getMuiTheme(lightBaseTheme)
    }
  }

  render() {
    return (
      <Provider store={store}>
        <People people={store.getState().people} />
      </Provider>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById("main-form")
);