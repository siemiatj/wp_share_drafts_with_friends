/**
 * @module containers/shared_grid
 */
import React, { Component, PropTypes } from 'react';
import { v4 } from 'node-uuid';
import { reduxForm, Field, FormSection } from 'redux-form';
import ShareTimeFields from 'components/share_time_fields';
import ActionIndicator from 'components/action_indicator';

/**
 * Form component for sharing a draft wrapped by redux-form
 */
class ShareForm extends Component {
	renderDraftOptions() {
		const { drafts } = this.props;
		const options = [
			<option key={ v4() } value="" disabled="disabled">
				{ APP_DATA.translations[ 'share_form-chooseadraft' ] }
			</option>
		];

		drafts.forEach( draft => {
			if ( draft[ 1 ] ) {
				options.push(
					<option key={ v4() } value="" disabled="disabled" />,
					<option key={ v4() } value="" disabled="disabled">{ draft[ 0 ] }</option>
				);

				if ( draft[ 2 ] ) {
					draft[ 2 ].forEach( draftPost => {
						if ( draftPost.post_title ) {
							options.push(
								<option
									key={ v4() }
									value={ draftPost.ID }
								>
									{ draftPost.post_title }
								</option>
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
		const { xhrRequest, onFormSubmit, handleSubmit } = this.props;

		return (
			<form className="draft-share" onSubmit={ handleSubmit( onFormSubmit ) }>
				{ xhrRequest && <ActionIndicator /> }
				<div>
					{ this.renderDraftSelect() }
				</div>
				<div>
					<button type="submit" className="button">
						{ APP_DATA.translations[ 'share_form-shareit' ] }
					</button>
				</div>
				<FormSection name="draft-share">
					<ShareTimeFields />
				</FormSection>
			</form>
		);
	}
}

export default reduxForm( {
	form: 'share-form',
} )( ShareForm );

/**
 * PropTypes.
 *
 * @property {array} drafts - list of drafts to render in the select dropdown
 * @property {bool} xhrRequest - boolean value controlling if AJAX request is happening
 * @property {func} onFormSubmit - function called when form is submitted
 * @property {func} handleSubmit - internal redux-form
 */
ShareForm.propTypes = {
	drafts: PropTypes.array,
	xhrRequest: PropTypes.bool,
	onFormSubmit: PropTypes.func,
	handleSubmit: PropTypes.func,
};
