const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const debuggerConfig = require('./debugger.html/webpack.config')

// console.log(debuggerConfig)

delete debuggerConfig.entry.debugger

/** @type {webpack.Configuration} */
const config = {
  ...debuggerConfig,
  watch: true,
  entry: {
    ...debuggerConfig.entry,
    background: path.resolve('src/background'),
    devtools: path.resolve('src/devtools'),
  },
  output: {
    path: path.resolve('chrome/dist'),
    filename: '[name].js',
    // publicPath: '/assets/build',
  },
  resolve: {
    alias: {
      'devtools-environment': path.resolve(__dirname, 'src/env.js'),
    },
  },
  plugins: [
    ...debuggerConfig.plugins,
    new HtmlWebpackPlugin({
      filename: 'devtools.html',
      chunks: ['devtools'],
      title: 'DevFox',
    }),
  ],
}

module.exports = config
