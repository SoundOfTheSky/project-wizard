const Utils = require('./utils');
const Path = require('path');
module.exports = async (options, packageJSON) => {
  if (!options.features.includes('eslint')) return;
  const extensions = ['.js'];
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
  if (['browser', 'electron'].includes(options.environment)) {
    extensions.push('.jsx');
    eslintConfig.parserOptions.ecmaFeatures = { jsx: true };
  }
  const typescript = options.features.includes('typescript');
  if (typescript) {
    packageJSON.devDependencies['@typescript-eslint/parser'] = 'latest';
    packageJSON.devDependencies['@typescript-eslint/eslint-plugin'] = 'latest';
    eslintConfig.parser = '@typescript-eslint/parser';
    eslintConfig.extends.push('plugin:@typescript-eslint/recommended');
    if (prettierEnabled) eslintConfig.extends.push('prettier');
    eslintConfig.rules['@typescript-eslint/explicit-module-boundary-types'] = 0;
    extensions.push('.ts');
    if (extensions.includes('.jsx')) extensions.push('.tsx');
  }
  if (options.framework === 'react') {
    packageJSON.devDependencies['eslint-plugin-react'] = 'latest';
    eslintConfig.settings = { react: { version: 'detect' } };
    eslintConfig.extends.unshift('plugin:react/recommended');
  } else if (options.framework === 'vue') {
    packageJSON.devDependencies['vue-eslint-parser'] = 'latest';
    packageJSON.devDependencies['eslint-plugin-vue'] = 'latest';
    eslintConfig.extends.unshift('plugin:vue/vue3-recommended');
    if (eslintConfig.parser) eslintConfig.parserOptions.parser = eslintConfig.parser;
    eslintConfig.parser = 'vue-eslint-parser';
    extensions.push('.vue');
  }
  if (options.environment === 'node' && !typescript) {
    packageJSON.devDependencies['@babel/eslint-parser'] = 'latest';
    eslintConfig.parser = '@babel/eslint-parser';
  }
  if (prettierEnabled) eslintConfig.extends.push('plugin:prettier/recommended');
  const cmd = `eslint "src/**/*${extensions.length > 1 ? `{${extensions.join(',')}}` : extensions[0]}"`;
  if (packageJSON.scripts.lint) packageJSON.scripts.lint += ' && ' + cmd;
  else packageJSON.scripts.lint = cmd;
  if (packageJSON.scripts['lint:fix']) packageJSON.scripts['lint:fix'] += ' && ' + cmd + ' --fix';
  else packageJSON.scripts['lint:fix'] = cmd + ' --fix';
  await Utils.createPath(
    Path.join(options.directory, '.eslintrc.js'),
    'module.exports = ' + Utils.prettyJSON(eslintConfig, true),
  );
};
