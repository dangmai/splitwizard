import React from "react";
import ReactDOM from "react-dom";
import { App } from "./containers/app";

require("file?name=robots.txt!../static/robots.txt");
require("file?name=humans.txt!../static/humans.txt");
require("!!file?name=apple-touch-icon.png!../static/apple-touch-icon.png");
require("bootstrap/less/bootstrap.less");
require("./main.css");

ReactDOM.render(
  <App />,
  document.getElementById("app")
);
