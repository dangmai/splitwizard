import React from "react";

import { Person } from "../../components/person"

export class People extends React.Component {
  render() {
    return (
      <div>
        {this.props.people.map((person, index) =>
          <Person key={index} />
        )}
      </div>
    )
  }
}