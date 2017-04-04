import React, { Component, PropTypes } from 'react';
import { v4 } from 'node-uuid';
import moment from 'moment';
import classnames from 'classnames';
import ExtendForm from 'containers/extend_form';

export default class SharedGrid extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			formVisible: false,
		};

		this.formSubmit = this.formSubmit.bind( this );
		this.stopSharing = this.stopSharing.bind( this );
		this.toggleFormVisible = this.toggleFormVisible.bind( this );
	}

	componentDidMount() {
		this.props.getSharedDrafts();
	}

	toggleFormVisible( forceState ) {
		let state = ( ! this.state.formVisible );

		if ( forceState ) {
			state = forceState === 'hide' ? false : true;
		}
		this.setState( {
			formVisible: state,
		} );
	}

	formSubmit( formData, postId ) {
		const data = formData[ 'draft-extend' ];
		data.post_id = postId;

		this.props.extendShare( data )
		.then( () => {
			this.toggleFormVisible( 'hide' );
		} );
	}

	stopSharing( postId ) {
		this.props.unShareDraft( postId );
	}

	renderEmptySharedPosts() {
		return (
			<tr>
				<td colSpan="5">{ APP_DATA.translations[ 'shared_grid-nodrafts' ] }</td>
			</tr>
		);
	}

	renderSharedPosts() {
		const { drafts } = this.props;
		const { formVisible } = this.state;
		const result = [];

		drafts.forEach( draft => {
			const shared = draft.shared;
			const shareExpires = shared.expires;
			const shareUrl = shared.url;
			const post = draft.post;

			result.push(
				<tr key={ v4() }>
					<td>{ post.ID }</td>
					<td>{ post.post_title }</td>
					<td>
						<a href=""> { shareUrl }</a>
					</td>
					<td>{ moment( shareExpires ).fromNow() }</td>
					<td colSpan="2" className="actions">
						{ ( ! formVisible ) ?
							<div className="share-actions">
								<button
									type="button"
									onClick={ this.toggleFormVisible }
									className="button"
								>
									{ APP_DATA.translations[ 'shared_grid-extend' ] }
								</button>
								<button
									type="button"
									onClick={ () => this.stopSharing( post.ID ) }
									className={ classnames( 'button button-primary' ) }
								>
									{ APP_DATA.translations[ 'shared_grid-stopsharing' ] }
								</button>
							</div>
							:
							<div className="share-form">
								<ExtendForm
									onFormSubmit={ ( formData ) => this.formSubmit( formData, post.ID ) }
								/>
								<a
									href=""
									className="cancel-share"
									onClick={ this.toggleFormVisible }
								>
									{ APP_DATA.translations[ 'shared_grid-cancel' ] }
								</a>
							</div>
						}
					</td>
				</tr>
			);
		} );

		return result;
	}

	render() {
		return (
			<table className="widefat">
				<thead>
					<tr>
						<th>ID</th>
						<th>{ APP_DATA.translations[ 'shared_grid-title' ] }</th>
						<th>{ APP_DATA.translations[ 'shared_grid-link' ] }</th>
						<th>{ APP_DATA.translations[ 'shared_grid-expires' ] }</th>
						<th colSpan="2">{ APP_DATA.translations[ 'shared_grid-actions' ] }</th>
					</tr>
				</thead>
				<tbody>
					{ ! this.props.drafts.length
						? this.renderEmptySharedPosts()
						: this.renderSharedPosts()
					}
				</tbody>
			</table>
		);
	}
}

SharedGrid.propTypes = {
	drafts: PropTypes.array,
	getSharedDrafts: PropTypes.func,
	unShareDraft: PropTypes.func,
	extendShare: PropTypes.func,
};
