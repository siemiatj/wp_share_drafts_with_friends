/**
 * @module components/action_indicator
 */
import React from 'react';

/**
 * Component showing spinner when there's a request happening
 *
 * @returns {void}
 */
const ActionIndicator = () => (
  <div className="action-indication">
    <div className="overlay" />
    <i className="fa fa-circle-o-notch" />
  </div>
);

export default ActionIndicator;
