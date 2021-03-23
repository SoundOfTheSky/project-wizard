const Utils = require('./utils');
module.exports = async (options, deps, devDeps, directory) => {
  if (!options.features.includes('eslint')) return;
  devDeps.add('eslint');
  const eslintConfig = {
    extends: [],
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
  };
  const prettierEnabled = options.features.includes('prettier');
  if (prettierEnabled) {
    ['eslint-plugin-prettier', 'eslint-config-prettier'].forEach(el => devDeps.add(el));
    if (!eslintConfig.rules) eslintConfig.rules = {};
    eslintConfig.rules['prettier/prettier'] = 1;
  }
  if (options.transpilers.includes('typescript')) {
    ['@typescript-eslint/parser', '@typescript-eslint/eslint-plugin'].forEach(el => devDeps.add(el));
    eslintConfig.parser = '@typescript-eslint/parser';
    eslintConfig.extends.push('plugin:@typescript-eslint/recommended');
    if (prettierEnabled) eslintConfig.extends.push('prettier/@typescript-eslint');
  }
  // Not actually sure that using babel parser is good thing
  /*if (options.transpiler.includes('babel')) {
    ['@babel/eslint-parser', '@babel/eslint-plugin'].forEach(el => devDeps.add(el));
    eslintConfig.parser = '@babel/eslint-parser';
    eslintConfig.plugins = ['@babel'];
    eslintConfig.rules = {
      ...eslintConfig.rules,
      '@babel/new-cap': 'error',
      '@babel/no-invalid-this': 'error',
      '@babel/no-unused-expressions': 'error',
      '@babel/object-curly-spacing': 'error',
      '@babel/semi': 'error',
    };
  }*/
  if (options.framework === '💙 React') {
    devDeps.add('eslint-plugin-react');
    eslintConfig.settings = { react: { version: 'detect' } };
    eslintConfig.parserOptions.ecmaFeatures = { jsx: true };
    eslintConfig.extends.unshift('plugin:react/recommended');
  } else if (options.framework === '💚 Vue') {
    ['vue-eslint-parser', 'eslint-plugin-vue'].forEach(el => devDeps.add(el));
    eslintConfig.extends.unshift('plugin:vue/recommended');
    if (eslintConfig.parser) eslintConfig.parserOptions.parser = eslintConfig.parser;
    eslintConfig.parser = 'vue-eslint-parser';
  }
  if (prettierEnabled) eslintConfig.extends.push('plugin:prettier/recommended');
  await Utils.createPath(directory + '.eslintrc.js', 'module.exports = ' + Utils.prettyJSON(eslintConfig, true));
};
