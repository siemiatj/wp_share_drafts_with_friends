/**
 * @module components/animated_button
 */
import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';

export default class AnimatedButton extends Component {
	render() {
		const { type, text } = this.props;
		return (
			<button type={ type } className="button">
				{ text }
			</button>
		);
	}
}

AnimatedButton.propTypes = {
	type: PropTypes.string,
	text: PropTypes.string,
};
