/**
 * @module components/share_drafts
 */
import React, { Component, PropTypes } from 'react';
import ShareForm from 'containers/share_form';

/**
 * Component rendering the draft share form and handling form submission
 */
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

/**
 * PropTypes.
 *
 * @property {array} drafts - list of drafts to render in the select dropdown
 * @property {bool} xhrRequest - boolean value controlling if AJAX request is happening
 * @property {func} getDrafts - action creator to get drafts
 * @property {func} shareDraft - action creator to share a draft
 */
ShareDrafts.propTypes = {
	drafts: PropTypes.array,
	xhrRequest: PropTypes.bool,
	getDrafts: PropTypes.func,
	shareDraft: PropTypes.func,
};
