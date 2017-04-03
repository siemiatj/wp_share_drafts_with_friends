import React, { Component } from 'react';

export default class ShareDrafts extends Component {
	render() {
		return (
			<form id="draftsforfriends-share" action="">
				<p>
					<select id="draftsforfriends-postid" name="post_id">
						<option value="">Choose a draft</option>
					</select>
				</p>
				<p>
					<input
						type="submit"
						className="button"
						name="draftsforfriends_submit"
						value="Share it"
					/>
					<input name="expires" type="text" value="2" size="4" />
					<select name="measure">
						<option value="s">seconds</option>
						<option value="m">minutes</option>
						<option value="h" selected="selected">hours</option>
						<option value="d">days</option>
					</select>
				</p>
			</form>
		);
	}
}
