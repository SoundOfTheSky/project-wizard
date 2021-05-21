module.exports = {
  root: true,
  extends: [
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:prettier/recommended"
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    "prefer-const": 1,
    "prettier/prettier": 1,
    "@typescript-eslint/explicit-module-boundary-types": 0
  },
  parser: "@typescript-eslint/parser",
  settings: {
    react: {
      version: "detect"
    }
  }
}