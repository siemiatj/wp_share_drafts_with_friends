const webpack = require( 'webpack' );

module.exports = {
	target: 'node',
	devtool: 'eval',
	module: {
		rules: [
			{
				test: /\.js$|\.jsx$/,
				exclude: [
					'.tmp',
					'node_modules',
				],
				loaders: [ {
					loader: 'babel-loader',
					query: {
						compact: false,
						presets: [ 'es2015', 'react', 'stage-0' ],
						plugins: [ 'transform-object-rest-spread' ],
					},
				} ]
			},
			{ test: /\.json$/, loader: 'json-loader' },
			{
				test: /\.(png|jpg|jpeg)$/,
				loader: 'url-loader',
				query: {
					name: '[hash].[ext]',
					limit: 10000,
				}
			},
			{ test: /\.css$/, loader: 'null-loader' },
			{
				test: /sinon\/pkg\/sinon\.js/,
				loader: 'legacy-loader!imports-loader?define=>false,require=>false',
			},
		],
	},
	externals: {
		jsdom: 'window',
		'react/addons': 'react',
		'react/lib/ExecutionEnvironment': 'react',
		'react/lib/ReactContext': 'react',
	},
	resolve: {
		extensions: [ '.js', '.jsx', '.css', '.json' ],
		modules: [
			'app', 'node_modules'
		],
		alias: {
			sinon: 'sinon/pkg/sinon',
		}
	},
	plugins: [
		new webpack.IgnorePlugin( /vertx/ ),
		new webpack.ProvidePlugin( { React: 'react' } ),
	],
};
