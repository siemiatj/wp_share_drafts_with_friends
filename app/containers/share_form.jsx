import React, { Component, PropTypes } from 'react';
import { reduxForm, Field } from 'redux-form';

class ShareForm extends Component {
	renderDraftOptions() {
		const { drafts } = this.props;
		const options = [
			<option value="">Choose a draft</option>
		];

		drafts.forEach( draft => {
			if ( draft[ 1 ] ) {
				options.push(
					<option value="" disabled="disabled" />,
					<option value="" disabled="disabled">{ draft[ 0 ] }</option>
				);

				if ( draft[ 2 ] ) {
					draft[ 2 ].forEach( draftPost => {
						if ( draftPost.post_title ) {
							options.push(
								<option value={ draftPost.ID }>{ draftPost.post_title }</option>
							);
						}
					} );
				}
			}
		} );

		return options;
	}

	renderDraftSelect() {
		return (
			<Field name="post_id" component="select">
				{ this.renderDraftOptions() }
			</Field>
		);
	}

	render() {
		const { onFormSubmit, handleSubmit } = this.props;

		return (
			<form id="draftsforfriends-share" onSubmit={ handleSubmit( onFormSubmit ) }>
				<div>
					{ this.renderDraftSelect() }
				</div>
				<div>
					<div>
						<button type="submit" className="button">Share it</button>
					</div>
					<Field name="expire_time" component="input" type="text" placeholder="2" size="4" />
					<Field name="expire_unit" component="select">
						<option value="s">seconds</option>
						<option value="m">minutes</option>
						<option value="h">hours</option>
						<option value="d">days</option>
					</Field>
				</div>
			</form>
		);
	}
}

export default reduxForm( {
	form: 'share-form',
} )( ShareForm );

ShareForm.propTypes = {
	drafts: PropTypes.array,
	onFormSubmit: PropTypes.func,
	handleSubmit: PropTypes.func,
};
