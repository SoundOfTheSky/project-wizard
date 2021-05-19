const Utils = require('./utils');
const Path = require('path');
const { config } = require('process');
module.exports = async (options, deps, devDeps, directory) => {
  if (!options.features.includes('eslint')) return;
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
  await Utils.createPath(
    Path.join(options.directory, '.eslintrc.js'),
    'module.exports = ' + Utils.prettyJSON(eslintConfig, true),
  );
};
