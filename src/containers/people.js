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
            <div className="form-group row">
              <label className="col-md-2" htmlFor={"name" + index}>Name</label>
              <div className="col-md-10">
                <PureInput className="form-control" id={"name" + index} type="text" field={person.name} />
              </div>
            </div>
            <div className="form-group row">
              <label className="col-md-2" htmlFor={"in" + index}>Move In</label>
              <div className="col-md-4">
                <DateInput className="form-control" title="Not necessary if outside the billing cycle" id={"in" + index} field={person.moveInDate} />
              </div>
              <label className="col-md-2" htmlFor={"out" + index}>Move Out</label>
              <div className="col-md-4">
                <DateInput className="form-control" title="Not necessary if outside the billing cycle" id={"out" + index} field={person.moveOutDate} />
              </div>
            </div>
            {index != 0 && <button className="btn btn-link btn-block btn-remove" onClick={(e) => {
              e.preventDefault();
              people.removeField(index);
            }}>Remove</button>}
          </div>
          )}
        </div>
        <button className="btn btn-link btn-block" onClick={(e) => {
          e.preventDefault();
          people.addField();
        }}>
          <span className="btn-icon">+</span> Add Another Person
        </button>
      </div>
    );
  }
}

People.propTypes = {
  people: PropTypes.array.isRequired,
}

export default People;