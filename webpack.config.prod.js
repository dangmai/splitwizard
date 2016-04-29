const webpack = require("webpack");
const devConfig = require("./webpack.config.js");

devConfig.debug = false;
devConfig.plugins = devConfig.plugins.concat([
  new webpack.DefinePlugin({
    "process.env": {
      NODE_ENV: JSON.stringify("production"),
    },
  }),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: true,
    },
  }),
]);

module.exports = devConfig;
