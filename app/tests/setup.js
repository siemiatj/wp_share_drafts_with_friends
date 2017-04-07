var jsdom = require( 'jsdom' ).jsdom;
var exposedProperties = [ 'window', 'document' ];

global.document = jsdom( '' );
global.window = document.defaultView;
Object.keys( document.defaultView ).forEach( ( property ) => {
	if ( typeof global[ property ] === 'undefined' ) {
		exposedProperties.push( property );
		global[ property ] = document.defaultView[ property ];
	}
} );

global.APP_DATA = {
	nonce: 'test-nonce',
	'ajax_url': 'http://foo_bar.com/api/',
	translations: {
		'share_form-shareit'      : 'Share it for',
		'share_form-chooseadraft' : 'Choose a draft',
		'extend_form-extendfor'   : 'Extend for',
		'shared_grid-nodrafts'    : 'No shared drafts !',
		'shared_grid-extend'      : 'Extend',
		'shared_grid-stopsharing' : 'Stop sharing',
		'shared_grid-cancel'      : 'Cancel',
		'shared_grid-title'       : 'Title',
		'shared_grid-link'        : 'Link',
		'shared_grid-expires'     : 'Expires',
		'shared_grid-actions'     : 'Actions',
		'share_time_fields-s'     : 'seconds',
		'share_time_fields-m'     : 'minutes',
		'share_time_fields-h'     : 'hours',
		'share_time_fields-d'     : 'days',
		'app-currentlyshared'     : 'Currently shared drafts',
		'app-sharedrafts'         : 'Share Drafts'
	}
};
