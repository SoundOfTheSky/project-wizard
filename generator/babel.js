const Utils = require('./utils');
const Path = require('path');
module.exports = async (options, deps, devDeps, directory) => {
  if (!options.transpilers.includes('babel')) return;
  const babelConfig = {
    presets: ['@babel/preset-env'],
    plugins: ['@babel/proposal-class-properties', '@babel/proposal-object-rest-spread'],
  };
  [
    '@babel/core',
    '@babel/preset-env',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
  ].forEach(el => devDeps.add(el));
  if (options.transpilers.includes('typescript')) {
    devDeps.add('@babel/preset-typescript');
    babelConfig.presets.push('@babel/preset-typescript');
  }
  if (options.UIFramework === 'react') {
    devDeps.add('@babel/preset-react');
    babelConfig.presets.push('@babel/preset-react');
  }
  return Utils.createPath(
    Path.join(directory, '.babel.config.js'),
    'module.exports = ' + Utils.prettyJSON(babelConfig, true),
  );
};
