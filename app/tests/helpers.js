const draftsResponse = [
	[
		'Your Drafts:',
		2,
		[ {
				'ID': '14',
				'post_title': 'Test post 2 aaaa'
			},
			{
				'ID': '11',
				'post_title': 'Test post'
			}
		]
	],
	[
		'Your Scheduled Posts:',
		0,
		[]
	],
	[
		'Pending Review:',
		2,
		[ {
				'ID': 14,
				'post_author': '1',
				'post_date': '2017-04-05 15:55:11',
				'post_date_gmt': '0000-00-00 00:00:00',
				'post_content': 'uoeueou',
				'post_title': 'Test post 2 aaaa',
				'post_excerpt': '',
				'post_status': 'draft',
				'comment_status': 'open',
				'ping_status': 'open',
				'post_password': '',
				'post_name': '',
				'to_ping': '',
				'pinged': '',
				'post_modified': '2017-04-05 15:55:11',
				'post_modified_gmt': '2017-04-05 15:55:11',
				'post_content_filtered': '',
				'post_parent': 0,
				'guid': 'http://vagrant.local/?p=14',
				'menu_order': 0,
				'post_type': 'post',
				'post_mime_type': '',
				'comment_count': '0',
				'filter': 'raw'
			},
			{
				'ID': 11,
				'post_author': '1',
				'post_date': '2017-03-31 00:34:18',
				'post_date_gmt': '0000-00-00 00:00:00',
				'post_content': 'This is a test post for the draft plugin.',
				'post_title': 'Test post',
				'post_excerpt': '',
				'post_status': 'draft',
				'comment_status': 'open',
				'ping_status': 'open',
				'post_password': '',
				'post_name': '',
				'to_ping': '',
				'pinged': '',
				'post_modified': '2017-03-31 00:34:18',
				'post_modified_gmt': '2017-03-31 00:34:18',
				'post_content_filtered': '',
				'post_parent': 0,
				'guid': 'http://vagrant.local/?p=11',
				'menu_order': 0,
				'post_type': 'post',
				'post_mime_type': '',
				'comment_count': '0',
				'filter': 'raw'
			}
		]
	]
];

const sharedDraftsResponse = [ {
	'shared': {
		'key': 'baba_GNQtza7l',
		'expires': 1491518921000,
		'url': 'http://vagrant.local/?p=14&draftsforfriends=baba_GNQtza7l'
	},
	'post': {
		'ID': 14,
		'post_author': '1',
		'post_date': '2017-04-05 15:55:11',
		'post_date_gmt': '0000-00-00 00:00:00',
		'post_content': 'uoeueou',
		'post_title': 'Test post 2 aaaa',
		'post_excerpt': '',
		'post_status': 'draft',
		'comment_status': 'open',
		'ping_status': 'open',
		'post_password': '',
		'post_name': '',
		'to_ping': '',
		'pinged': '',
		'post_modified': '2017-04-05 15:55:11',
		'post_modified_gmt': '2017-04-05 15:55:11',
		'post_content_filtered': '',
		'post_parent': 0,
		'guid': 'http://vagrant.local/?p=14',
		'menu_order': 0,
		'post_type': 'post',
		'post_mime_type': '',
		'comment_count': '0',
		'filter': 'raw'
	}
} ];

const expirationResponse = {
	share_expiration: 1491529721000,
	post_id: 14,
};

export { draftsResponse, sharedDraftsResponse, expirationResponse };
