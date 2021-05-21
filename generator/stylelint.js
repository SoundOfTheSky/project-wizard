const Utils = require('./utils');
const Path = require('path');
module.exports = async (options, packageJSON) => {
  if (!options.features.includes('stylelint')) return;
  if (!packageJSON.scripts) packageJSON.scripts = {};
  const cssResolvables = ['.css'];
  packageJSON.devDependencies['stylelint'] = 'latest';
  packageJSON.devDependencies['stylelint-config-rational-order'] = 'latest';
  packageJSON.devDependencies['stylelint-config-standard'] = 'latest';
  packageJSON.devDependencies['stylelint-order'] = 'latest';
  const config = {
    extends: ['stylelint-config-standard', 'stylelint-config-rational-order'],
    plugins: ['stylelint-order'],
    rules: {
      'order/properties-order': [
        [],
        {
          severity: 'warning',
        },
      ],
    },
  };
  if (options.features.includes('sass')) {
    packageJSON.devDependencies['stylelint-scss'] = 'latest';
    config.plugins.push('stylelint-scss');
    cssResolvables.push('.scss');
  }
  if (options.features.includes('prettier')) {
    packageJSON.devDependencies['stylelint-prettier'] = 'latest';
    packageJSON.devDependencies['stylelint-config-prettier'] = 'latest';
    config.extends.push('stylelint-prettier/recommended');
    config.plugins.push('stylelint-prettier');
    config.rules['prettier/prettier'] = [
      true,
      {
        severity: 'warning',
      },
    ];
  }
  const cmd =
    cssResolvables.length === 1
      ? `stylelint "src/**/*${cssResolvables[0]}"`
      : `stylelint "src/**/*{${cssResolvables.join(',')}}"`;
  if (packageJSON.scripts.lint) packageJSON.scripts.lint += ' && ' + cmd;
  else packageJSON.scripts.lint = cmd;
  if (packageJSON.scripts['lint:fix']) packageJSON.scripts['lint:fix'] += ' && ' + cmd + ' --fix';
  else packageJSON.scripts['lint:fix'] = cmd + ' --fix';
  await Utils.createPath(
    Path.join(options.directory, '.stylelintrc.js'),
    'module.exports = ' + Utils.prettyJSON(config, true),
  );
};
