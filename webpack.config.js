const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');

module.exports =  {
  entry: path.resolve(__dirname + '/src/plugin.js'),
  output: {
    path: path.resolve(__dirname + '/dist/'),
    filename: 'vuex-undo-redo.min.js',
    libraryTarget: 'window',
    library: 'VuexUndoRedo',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: __dirname,
        exclude: /node_modules/,
        options: {
          presets: ["babel-preset-env"],
          plugins: ["transform-runtime"],
        }
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin( {
      minimize : true,
      sourceMap : false,
      mangle: true,
      compress: {
        warnings: false
      }
    } )
  ]
};
