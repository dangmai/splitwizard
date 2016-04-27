import React, { Component, PropTypes } from 'react';

import PureInput from "../components/pureInput";
import DateInput from "../components/dateInput";

class People extends Component {
  render() {
    const { people } = this.props;
    return (
      <div className="col-md-6">
        <div className="category-title text-center">Mortal Men</div>
        <div className="people">
          {people.map((person, index) => <div key={index} className="person">
            <div className="row">
              <div className="col-md-12 form-inline">
                <div className="control-group">
                  <label htmlFor={"name" + index} className="col-md-2">Name</label>
                  <div className="controls">
                    <PureInput className="col-md-10 required" id={"name" + index} type="text" field={person.name} />
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 form-inline">
                <div className="control-group">
                  <label htmlFor={"in" + index} className="col-md-4">Move In</label>
                  <div className="controls">
                    <DateInput className="col-md-8" title="Not necessary if outside the billing cycle" id={"in" + index} field={person.moveInDate} />
                  </div>
                </div>
              </div>
              <div className="col-md-6 form-inline">
                <div className="control-group">
                  <label htmlFor={"out" + index} className="col-md-4">Move Out</label>
                  <div className="controls">
                    <DateInput className="col-md-8" title="Not necessary if outside the billing cycle" id={"out" + index} field={person.moveOutDate} />
                  </div>
                </div>
              </div>
            </div>
            {index != 0 && <a className="remove text-center" onClick={(e) => {
              e.preventDefault();
              people.removeField(index);
            }}>Remove</a>}
          </div>
          )}
        </div>
        <a href="#" id="more-people" onClick={(e) => {
          e.preventDefault();
          people.addField();
        }}>
          <i className="icon-plus"></i> Add Another Person
        </a>
      </div>
    );
  }
}

People.propTypes = {
  people: PropTypes.array.isRequired,
}

export default People;