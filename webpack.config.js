const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

/** @type {webpack.Configuration} */
const config = {
  mode: 'development',
  watch: true,
  devtool: 'source-map',
  entry: {
    background: './src/background',
    devtools: './src/devtools',
  },
  output: {
    path: path.resolve('chrome/dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'devtools.html',
      chunks: ['devtools'],
      title: 'DevFox',
    }),
  ],
}

module.exports = config
