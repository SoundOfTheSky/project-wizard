/* eslint-disable @typescript-eslint/no-var-requires */
const Webpack = require('webpack');
const webpackConfig = require('./webpack.config')('production');
const compiler = Webpack(webpackConfig);
compiler.run((err, stats) => {
  stats.toJson({ all: false, warnings: true, errors: true }).warnings.forEach(el => {
    console.log(el.message);
  });
});
