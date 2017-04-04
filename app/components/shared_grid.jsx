import React, { Component, PropTypes } from 'react';
import { v4 } from 'node-uuid';
import moment from 'moment';
import 'style.css';

export default class SharedGrid extends Component {
	constructor( props ) {
		super( props );

		this.deleteClicked = this.deleteClicked.bind( this );
	}

	componentDidMount() {
		this.props.getSharedDrafts();
	}

	deleteClicked( postId ) {
		this.props.unShareDraft( postId );
	}

	renderEmptySharedPosts() {
		return (
			<tr>
				<td colSpan="5">No shared drafts!</td>
			</tr>
		);
	}

	renderSharedPosts() {
		const { drafts } = this.props;
		const result = [];

		drafts.forEach( draft => {
			const shared = draft.shared;
			const shareExpires = shared.expires;
			const shareKey = shared.key;
			const shareUrl = shared.url;
			const post = draft.post;

			result.push(
				<tr key={ v4() }>
					<td>{ post.ID }</td>
					<td>{ post.post_title }</td>
					<td><a href=""> { shareUrl }</a></td>
					<td>{ moment( shareExpires ).fromNow() }</td>
					<td className="actions">
						<a
							className="draftsforfriends-extend edit"
							id={ `draftsforfriends-extend-link-${ shareKey }` }
							href=""
						>
								Extend
						</a>
						<form
							className="draftsforfriends-extend"
							id={ `draftsforfriends-extend-form-${ shareKey }` }
							action="" method="post"
						>
							<input type="hidden" name="action" value="extend" />
							<input type="hidden" name="key" value={ shareKey } />
							<input
								type="submit"
								className="button"
								name="draftsforfriends_extend_submit" value="Extend"
							/>
							by
							<input name="expires" type="text" value="2" size="4" />
							<select name="measure" defaultValue={ 'minutes' }>
								<option value="s">seconds</option>
								<option value="m">minutes</option>
								<option value="h">hours</option>
								<option value="d">days</option>
							</select>
							<button
								type="button"
								onClick=""
								className="draftsforfriends-extend-cancel"
							>
								Cancel
							</button>
						</form>
					</td>
					<td className="actions">
						<button
							type="button"
							onClick={ () => this.deleteClicked( post.ID ) }
							className="delete"
						>
							Delete
						</button>
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
						<th>Title</th>
						<th>Link</th>
						<th>Expires</th>
						<th colSpan="2" className="actions">Actions</th>
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
};
