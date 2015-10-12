var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: {
    app: './examples/counters/src/main.js',
  },
  output: {
    filename: './dist/app.js',
    publicPath: '/',
    path: __dirname
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /build|lib|node_modules/,
      loaders: [ 'babel' ]
    }],
    preLoaders: [
      { test: /\.js$/, loader: 'eslint', exclude: /build|lib|node_modules/ },
    ],
  },
  resolve: {
    alias: {
      react: path.resolve('./node_modules/react')
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ],
  eslint: {
    configFile: '.eslintrc'
  },
};

