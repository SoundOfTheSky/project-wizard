module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    parser: '@typescript-eslint/parser',
  },
  rules: {
    'prefer-const': 1,
    'prettier/prettier': 1,
    '@typescript-eslint/explicit-module-boundary-types': 0,
  },
  parser: 'vue-eslint-parser',
  settings: {
    react: {
      version: 'detect',
    },
  },
};
