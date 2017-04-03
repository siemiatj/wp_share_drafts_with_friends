import React, { Component, PropTypes } from 'react';
import 'style.css';

export default class App extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			data: props.data || [],
		};
		this.renderSharedPosts = this.renderSharedPosts.bind( this );
	}

	renderEmptySharedPosts() {
		return (
			<tr>
				<td colspan="5">No shared drafts!</td>
			</tr>
		);
	}

	renderSharedPosts() {
		const result = [];

		this.state.data.forEach( shared => {
			const shareExpires = shared.expires;
			const shareKey = shared.key;
			const shareUrl = shared.url;
			const post = shared.post;

			result.push(
				<tr>
					<td>{ post.id }</td>
					<td>{ post.post_title }</td>
					<td><a href=""> { shareUrl }</a></td>
					<td>{ shareExpires }</td>
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
							<select name="measure">
								<option value="s">seconds</option>
								<option value="m">minutes</option>
								<option value="h" selected="selected">hours</option>
								<option value="d">days</option>
							</select>
							<a
								className="draftsforfriends-extend-cancel"
								href="">
								Cancel
							</a>
						</form>
					</td>
					<td className="actions">
						<a
							className="delete"
							href=""
						>Delete</a>
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
						<th colspan="2" className="actions">Actions</th>
					</tr>
				</thead>
				<tbody>
					{ ! this.state.data.length
						? this.renderEmptySharedPosts()
						: this.renderSharedPosts()
					}
				</tbody>
			</table>
		);
	}
}

App.propTypes = {
	data: PropTypes.array,
};
