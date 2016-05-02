import React from "react";
import ReactDOM from "react-dom";
import TestUtils from "react-addons-test-utils";
import expect from "expect";

import { App } from "../containers/app";
import Form from "../containers/form";
import People from "../containers/people";

describe("whole app testing", () => {
  beforeEach(() => {
    // this.component = TestUtils.renderIntoDocument(<App />);
    // this.renderedDOM = () => React.findDOMNode(this.component);
  });

  it("should render correctly on to the page", () => {
    // There should be 2 empty people and 1 empty bill on the page initially
    const app = TestUtils.renderIntoDocument(<App />);
    const appNode = ReactDOM.findDOMNode(app);

    expect(TestUtils.scryRenderedComponentsWithType(app, Form).length).toEqual(1);
    // expect(TestUtils.scryRenderedComponentsWithType(app, People).length).toEqual(2);
  });
});
