/**
 * @module containers/shared_grid
 */
import React, { Component, PropTypes } from 'react';
import { reduxForm, FormSection } from 'redux-form';
import ShareTimeFields from 'components/share_time_fields';

/**
 * Form component for extending draft sharing wrapped by redux-form
 */
class ExtendForm extends Component {
	render() {
		const { onFormSubmit, handleSubmit } = this.props;

		return (
			<form className="draft-extend" onSubmit={ handleSubmit( onFormSubmit ) }>
				<button type="submit" className="button">
					{ APP_DATA.translations[ 'extend_form-extendfor' ] }
				</button>
				<FormSection name="draft-extend">
					<ShareTimeFields />
				</FormSection>
			</form>
		);
	}
}

export default reduxForm( {
	form: 'extend-form',
} )( ExtendForm );

/**
 * PropTypes.
 *
 * @property {func} onFormSubmit - function called when form is submitted
 * @property {func} handleSubmit - internal redux-form
 */
ExtendForm.propTypes = {
	onFormSubmit: PropTypes.func,
	handleSubmit: PropTypes.func,
};
