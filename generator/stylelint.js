const Utils = require('./utils');
const Path = require('path');
module.exports = async (options, packageJSON) => {
  if (!options.features.includes('stylelint')) return;
  const extensions = ['.css'];
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
      'prettier/prettier': [
        true,
        {
          severity: 'warning',
        },
      ],
      'selector-pseudo-class-no-unknown': [
        true,
        {
          ignorePseudoClasses: ['global'],
        },
      ],
      'no-descending-specificity': null,
    },
  };
  if (options.features.includes('sass')) {
    packageJSON.devDependencies['stylelint-scss'] = 'latest';
    packageJSON.devDependencies['stylelint-config-recommended-scss'] = 'latest';
    config.plugins.push('stylelint-scss');
    config.extends.push('stylelint-config-recommended-scss');
    extensions.push('.scss');
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
  if (options.framework === 'vue') extensions.push('.vue');
  const cmd = `stylelint "src/**/*${extensions.length > 1 ? `{${extensions.join(',')}}` : extensions[0]}"`;
  if (packageJSON.scripts.lint) packageJSON.scripts.lint += ' && ' + cmd;
  else packageJSON.scripts.lint = cmd;
  if (packageJSON.scripts['lint:fix']) packageJSON.scripts['lint:fix'] += ' && ' + cmd + ' --fix';
  else packageJSON.scripts['lint:fix'] = cmd + ' --fix';
  await Utils.createPath(
    Path.join(options.directory, '.stylelintrc.js'),
    'module.exports = ' + Utils.prettyJSON(config, true),
  );
};
