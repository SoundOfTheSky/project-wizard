const Utils = require('./utils');
const Path = require('path');
const { config } = require('process');
module.exports = async (options, packageJSON) => {
  if (!options.features.includes('eslint')) return;
  if (!packageJSON.scripts) packageJSON.scripts = {};
  const jsResolvables = ['.js', '.jsx'];
  packageJSON.devDependencies['eslint'] = 'latest';
  const eslintConfig = {
    root: true,
    extends: [],
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    rules: {
      'prefer-const': 1,
    },
  };
  const prettierEnabled = options.features.includes('prettier');
  if (prettierEnabled) {
    packageJSON.devDependencies['eslint-plugin-prettier'] = 'latest';
    packageJSON.devDependencies['eslint-config-prettier'] = 'latest';
    eslintConfig.rules['prettier/prettier'] = 1;
  }
  if (options.features.includes('typescript')) {
    packageJSON.devDependencies['@typescript-eslint/parser'] = 'latest';
    packageJSON.devDependencies['@typescript-eslint/eslint-plugin'] = 'latest';
    eslintConfig.parser = '@typescript-eslint/parser';
    eslintConfig.extends.push('plugin:@typescript-eslint/recommended');
    if (prettierEnabled) eslintConfig.extends.push('prettier');
    eslintConfig.rules['@typescript-eslint/explicit-module-boundary-types'] = 0;
    jsResolvables.push('.ts', '.tsx');
  }
  if (options.framework === 'react') {
    packageJSON.devDependencies['eslint-plugin-react'] = 'latest';
    eslintConfig.settings = { react: { version: 'detect' } };
    eslintConfig.parserOptions.ecmaFeatures = { jsx: true };
    eslintConfig.extends.unshift('plugin:react/recommended');
  } else if (options.framework === 'vue') {
    packageJSON.devDependencies['vue-eslint-parser'] = 'latest';
    packageJSON.devDependencies['eslint-plugin-vue'] = 'latest';
    eslintConfig.extends.unshift('plugin:vue/vue3-recommended');
    if (eslintConfig.parser) eslintConfig.parserOptions.parser = eslintConfig.parser;
    eslintConfig.parser = 'vue-eslint-parser';
  }
  if (prettierEnabled) eslintConfig.extends.push('plugin:prettier/recommended');
  const cmd = `eslint "src/**/*{${jsResolvables.join(',')}}"`;
  if (packageJSON.scripts.lint) packageJSON.scripts.lint += ' && ' + cmd;
  else packageJSON.scripts.lint = cmd;
  if (packageJSON.scripts['lint:fix']) packageJSON.scripts['lint:fix'] += ' && ' + cmd + ' --fix';
  else packageJSON.scripts['lint:fix'] = cmd + ' --fix';
  await Utils.createPath(
    Path.join(options.directory, '.eslintrc.js'),
    'module.exports = ' + Utils.prettyJSON(eslintConfig, true),
  );
};
