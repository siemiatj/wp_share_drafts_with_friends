const path = require( 'path' );
const webpack = require( 'webpack' );

const config = {
	devtool: 'source-map',
	name: 'browser',
	entry: {
		app: './app/index',
	},
	output: {
		path: path.join( __dirname, 'build' ),
		filename: 'bundle.js',
	},
	module: {
		loaders: [
			{
				test: /\.js$|\.jsx$/,
				loader: 'babel-loader',
				query: {
					presets: [ 'es2015', 'react', 'stage-0' ],
					plugins: [ 'transform-object-rest-spread' ],
				},
				include: path.join( __dirname, 'app' ),
				exclude: path.join( __dirname, '/node_modules/' ),
			},
			{
				test: /\.css$/,
				loaders: [ 'style-loader', 'css-loader' ]
			},
		]
	},
	resolve: {
		extensions: [ '.js', '.jsx', '.css' ],
		modules: [
			'app', 'node_modules'
		],
	},
	plugins: [
		new webpack.DefinePlugin( {
			__DEV__: process.env.NODE_ENV !== 'production',
		} ),
	],
};

module.exports = config;
