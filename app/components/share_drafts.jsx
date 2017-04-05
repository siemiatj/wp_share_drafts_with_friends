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
			<ShareForm
				xhrRequest={ this.props.xhrRequest }
				drafts={ this.props.drafts }
				onFormSubmit={ this.formSubmit }
			/>
		);
	}
}

ShareDrafts.propTypes = {
	drafts: PropTypes.array,
	xhrRequest: PropTypes.bool,
	getDrafts: PropTypes.func,
	shareDraft: PropTypes.func,
};
