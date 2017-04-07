/**
 * @module containers/shared_grid
 */
import React, { Component, PropTypes } from 'react';
import { reduxForm, FormSection } from 'redux-form';
import ShareTimeFields from 'components/share_time_fields';
import AnimatedButton from 'components/animated_button';

/**
 * Form component for extending draft sharing wrapped by redux-form
 */
class ExtendForm extends Component {
	render() {
		const { onFormSubmit, handleSubmit } = this.props;

		return (
			<form className="draft-extend" onSubmit={ handleSubmit( onFormSubmit ) }>
				<AnimatedButton
					type={ 'submit' }
					text={ APP_DATA.translations[ 'extend_form-extendfor' ] }
				/>
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
