import React from 'react';
import PropTypes from 'prop-types';

export function UnknownTypeModule(props) {
  return <div className="module-error">
    Unknown module type: &ldquo;{props.type}&rdquo;
  </div>;
}

UnknownTypeModule.propTypes = {
  type: PropTypes.string,
};