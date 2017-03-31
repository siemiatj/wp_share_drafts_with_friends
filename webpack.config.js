const path = require('path');

const config = {
  devtool: 'source-map',
  name: 'browser',
  entry: {
    app: './app/index',
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$|\.jsx$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react', 'stage-0']
        },
        include: path.join(__dirname, 'app'),
        exclude: path.join(__dirname, '/node_modules/'),
      },
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      'app', 'node_modules'
    ],
  },
};

module.exports = config;
