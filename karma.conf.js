module.exports = (config) => {
  config.set({
    basePath: "src/tests",
    singleRun: true,
    frameworks: ["mocha"],
    reporters: ["dots"],
    browsers: ["PhantomJS"],
    files: [
      "**/*.spec.js",
    ],
    preprocessors: {
      "**/*.spec.js": ["webpack", "sourcemap"],
    },
    webpack: {
      resolve: {
        extensions: ["", ".js"],
        modulesDirectories: ["node_modules", "src"],
      },
      module: {
        noParse: [/moment.js/],  // https://github.com/webpack/webpack/issues/198
        loaders: [{
          test: /\.js$/,
          loader: "babel",
          query: {
            presets: ["es2015", "stage-2"],
          },
        }],
      },
      devtool: "inline-source-map",
    },
    webpackMiddleware: {
      stats: {
        color: true,
        chunkModules: false,
        modules: false,
      },
    },
  });
};
