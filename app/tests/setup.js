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
  'ajax_url': 'http://foo_bar.com/api/'
};
