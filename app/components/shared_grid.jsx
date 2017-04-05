/**
 * @module components/shared_grid
 */
import React, { Component, PropTypes } from 'react';
import { v4 } from 'node-uuid';
import moment from 'moment';
import classnames from 'classnames';
import ExtendForm from 'containers/extend_form';
import ActionIndicator from 'components/action_indicator';

/**
 * Component rendering the shared drafts grid and handling share extend form submission
 */
export default class SharedGrid extends Component {
	constructor( props ) {
		super( props );

		this.state = {};

		this.formSubmit = this.formSubmit.bind( this );
		this.stopSharing = this.stopSharing.bind( this );
		this.toggleFormVisible = this.toggleFormVisible.bind( this );
	}

	componentDidMount() {
		this.props.getSharedDrafts().
		then( () => {
			const formKeys = [];

			this.props.drafts.forEach( draft => {
				formKeys.push( `form-${ draft.post.ID }-visible` );
			} );
		} );
	}

	toggleFormVisible( e, postId, forceState ) {
		const newState = { ...this.state };
		let visible = ( ! newState[ `form-${ postId }-visible` ] );

		if ( e ) {
			e.preventDefault();
		}

		if ( forceState ) {
			visible = forceState === 'hide' ? false : true;
		}
		newState[ `form-${ postId }-visible` ] = visible;

		this.setState( { ...newState } );
	}

	formSubmit( formData, postId ) {
		const data = formData[ 'draft-extend' ];
		data.post_id = postId;

		this.props.extendShare( data )
		.then( () => {
			this.toggleFormVisible( null, postId, 'hide' );
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
		const { state } = this;
		const result = [];

		drafts.forEach( draft => {
			const shared = draft.shared;
			const shareExpires = shared.expires;
			const shareUrl = shared.url;
			const post = draft.post;
			const formVisible = state[ `form-${ post.ID }-visible` ];

			result.push(
				<tr key={ v4() }>
					<td>{ post.ID }</td>
					<td>{ post.post_title }</td>
					<td>
						<a href=""> { shareUrl }</a>
					</td>
					<td>{ moment( shareExpires ).fromNow() }</td>
					<td className="actions-cell">
						{ ( ! formVisible ) ?
							<div className="share-buttons">
								<button
									type="button"
									onClick={ () => this.toggleFormVisible( null, post.ID ) }
									className="button"
								>
									{ APP_DATA.translations[ 'shared_grid-extend' ] }
								</button>
								<button
									type="button"
									onClick={ () => this.stopSharing( post.ID ) }
									className={ classnames( 'button button-primary button-stop-sharing' ) }
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
									onClick={ ( e ) => this.toggleFormVisible( e, post.ID ) }
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
			<div className="shared-drafts-wrapper">
				<table className={ classnames( 'widefat shared-drafts-table' ) }>
					<thead>
						<tr>
							<th>ID</th>
							<th>{ APP_DATA.translations[ 'shared_grid-title' ] }</th>
							<th>{ APP_DATA.translations[ 'shared_grid-link' ] }</th>
							<th>{ APP_DATA.translations[ 'shared_grid-expires' ] }</th>
							<th className="actions-header">
								{ APP_DATA.translations[ 'shared_grid-actions' ] }
							</th>
						</tr>
					</thead>
					<tbody>
						{ ! this.props.drafts.length
							? this.renderEmptySharedPosts()
							: this.renderSharedPosts()
						}
					</tbody>
				</table>
				{ this.props.xhrRequest &&
					<ActionIndicator />
				}
			</div>
		);
	}
}

/**
 * PropTypes.
 *
 * @property {array} drafts - list of drafts to render in the select dropdown
 * @property {bool} xhrRequest - boolean value controlling if AJAX request is happening
 * @property {func} getSharedDrafts - action creator to get shared drafts
 * @property {func} unShareDraft - action creator to stop sharing a draft
 * @property {func} extendShare - action creator to extend draft sharing time
 */
SharedGrid.propTypes = {
	drafts: PropTypes.array,
	xhrRequest: PropTypes.bool,
	getSharedDrafts: PropTypes.func,
	unShareDraft: PropTypes.func,
	extendShare: PropTypes.func,
};
