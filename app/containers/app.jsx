import React, { Component } from 'react';
import 'style.css';

export default class App extends Component {
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
			</table>
		);
	}
}
