import React, { Component, PropTypes } from "react";

class TextInput extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.field !== nextProps.field;
  }

  render() {
    const { field, ...rest } = this.props;
    return <input {...field} {...rest} />;
  }
}

TextInput.propTypes = {
  field: PropTypes.object.isRequired,
};

export default TextInput;
