module.exports = {
  extends: ['plugin:prettier/recommended'],
  ignorePatterns: ['files/**/*'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 1,
  },
};
