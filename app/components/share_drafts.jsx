import React, { Component, PropTypes } from 'react';
import ShareForm from 'containers/share_form';

export default class ShareDrafts extends Component {
	constructor( props ) {
		super( props );

		this.formSubmit = this.formSubmit.bind( this );
	}

	componentDidMount() {
		this.props.getDrafts();
	}

	formSubmit( formData ) {
		const data = {
			...formData[ 'draft-share' ],
			post_id: formData.post_id,
		};

		this.props.shareDraft( data );
	}

	render() {
		return (
			<ShareForm onFormSubmit={ this.formSubmit } drafts={ this.props.drafts } />
		);
	}
}

ShareDrafts.propTypes = {
	drafts: PropTypes.array,
	getDrafts: PropTypes.func,
	shareDraft: PropTypes.func,
};
