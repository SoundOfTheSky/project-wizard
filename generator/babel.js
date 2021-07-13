const Utils = require('./utils');
const Path = require('path');
// We actually need babel only for decorators in nest. ugh... (and imports lol)
module.exports = async (options, packageJSON) => {
  if (['browser', 'electron'].includes(options.environment) || options.features.includes('typescript')) return;
  packageJSON.devDependencies['@babel/core'] = 'latest';
  packageJSON.devDependencies['@babel/plugin-proposal-decorators'] = 'latest';
  packageJSON.devDependencies['@babel/plugin-transform-runtime'] = 'latest';
  packageJSON.devDependencies['@babel/preset-env'] = 'latest';
  packageJSON.devDependencies['babel-plugin-parameter-decorator'] = 'latest';
  packageJSON.dependencies['@babel/runtime'] = 'latest';
  return Utils.createPath(
    Path.join(options.directory, '.babelrc'),
    Utils.prettyJSON({
      presets: ['@babel/preset-env'],
      plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        '@babel/plugin-transform-runtime',
        'babel-plugin-parameter-decorator',
      ],
    }),
  );
};
