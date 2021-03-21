module.exports = {
  extends: [
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
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
    "prettier/prettier": 1
  },
  parser: "@typescript-eslint/parser",
  settings: {
    react: {
      version: "detect"
    }
  }
}