module.exports = (config) => {
  config.set({
    basePath: 'src',
    singleRun: true,
    frameworks: ['mocha'],
    reporters: ['dots'],
    browsers: ['PhantomJS'],
    files: [
      'tests/**/*.spec.js',
    ],
    preprocessors: {
      'tests/**/*.spec.js': ['webpack'],
    },
    webpack: {
      resolve: {
        extensions: ['', '.js'],
        modulesDirectories: ['node_modules', 'src'],
      },
      module: {
        loaders: [{
          test: /\.js$/,
          loader: 'babel',
          query: {
            "presets": ["es2015", "stage-2"]
          }
        }],
      },
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