"use strict";

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/entry.js",
  debug: true,
  devtool: "source-map",
  output: {
    path: "dist",
    filename: "bundle.[hash].js"
  },
  plugins: [
    new ExtractTextPlugin("main.[contenthash].css"),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: "body",
      favicon: "./static/favicon.ico"
    }),
    new HtmlWebpackPlugin({
      template: "html!./src/404.html",
      filename: "404.html"
    })
  ],
  module: {
    noParse: [/moment.js/],  // https://github.com/webpack/webpack/issues/198
    loaders: [{
      test: /\.js?$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        "presets": ["es2015", "stage-2", "stage-1", "react"]
      }
    },
    {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract("style-loader", "css-loader?sourceMap")
    },
    {
      test: /\.less$/,
      loader: ExtractTextPlugin.extract("style-loader", "css-loader?sourceMap!less-loader?sourceMap")
    },
    {
      test: /\.png$/,
      loader: "url-loader?limit=10000&minetype=image/png"
    },
    {
      test: /\.jpg$/,
      loader: "file"
    },
    {
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      loader: "file"
    },
    {
      test: /\.(woff|woff2)$/,
      loader:"url?prefix=font/&limit=5000"
    },
    {
      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
      loader: "url?limit=10000&mimetype=application/octet-stream"
    },
    {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      loader: "url?limit=10000&mimetype=image/svg+xml"
    }]
  }
};