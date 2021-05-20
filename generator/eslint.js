const Utils = require('./utils');
const Path = require('path');
const { config } = require('process');
module.exports = async (options, deps, devDeps, packageJSON) => {
  if (!options.features.includes('eslint')) return;
  if (!packageJSON.scripts) packageJSON.scripts = {};
  const jsResolvables = ['.js', '.jsx'];
  devDeps.add('eslint');
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
    ['eslint-plugin-prettier', 'eslint-config-prettier'].forEach(el => devDeps.add(el));
    eslintConfig.rules['prettier/prettier'] = 1;
  }
  if (options.features.includes('typescript')) {
    ['@typescript-eslint/parser', '@typescript-eslint/eslint-plugin'].forEach(el => devDeps.add(el));
    eslintConfig.parser = '@typescript-eslint/parser';
    eslintConfig.extends.push('plugin:@typescript-eslint/recommended');
    if (prettierEnabled) eslintConfig.extends.push('prettier');
    eslintConfig.rules['@typescript-eslint/explicit-module-boundary-types'] = 0;
    jsResolvables.push('.ts', '.tsx');
  }
  if (options.framework === 'react') {
    devDeps.add('eslint-plugin-react');
    eslintConfig.settings = { react: { version: 'detect' } };
    eslintConfig.parserOptions.ecmaFeatures = { jsx: true };
    eslintConfig.extends.unshift('plugin:react/recommended');
  } else if (options.framework === 'vue') {
    ['vue-eslint-parser', 'eslint-plugin-vue'].forEach(el => devDeps.add(el));
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
