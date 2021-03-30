module.exports = {
  root: true,
  extends: [
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:prettier/recommended"
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module"
  },
  rules: {
    "prettier/prettier": 1
  },
  parser: "@typescript-eslint/parser"
}