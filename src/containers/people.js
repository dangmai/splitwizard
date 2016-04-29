import React, { Component, PropTypes } from 'react';

import DateInputControl from "../components/dateInputControl";
import TextInputControl from "../components/textInputControl";

class People extends Component {
  render() {
    const { people } = this.props;
    return (
      <div className="col-md-6">
        <div className="category-title text-center">Mortal Men</div>
        <div className="people">
          {people.map((person, index) => (
            <div key={index} className="person">
              <div className="form-horizontal">
                <TextInputControl field={person.name} label="Name" uniqueKey={index} controlClassName="col-md-12" labelClassName="col-md-2" inputClassName="col-md-10" showHelpBlock={true} />
                <DateInputControl field={person.moveInDate} label="Move In" uniqueKey={index} controlClassName="col-md-6" labelClassName="col-md-4" inputClassName="col-md-8" showHelpBlock={false} />
                <DateInputControl field={person.moveOutDate} label="Move Out" uniqueKey={index} controlClassName="col-md-6" labelClassName="col-md-4" inputClassName="col-md-8" showHelpBlock={false} />
                {index != 0 && <button className="btn btn-link btn-block btn-remove" onClick={(e) => {
                  e.preventDefault();
                  people.removeField(index);
                }}>Remove</button>}
                <div className="clearfix"></div>
              </div>
            </div>
            ))}

          <button className="btn btn-link btn-block" onClick={(e) => {
            e.preventDefault();
            people.addField();
          }}>
            <span className="glyphicon glyphicon-plus" aria-hidden="true"></span> Add Another Person
          </button>
        </div>
      </div>
    );
  }
}

People.propTypes = {
  people: PropTypes.array.isRequired,
}

export default People;