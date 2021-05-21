module.exports = {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-rational-order",
    "stylelint-prettier/recommended"
  ],
  plugins: [
    "stylelint-order",
    "stylelint-scss",
    "stylelint-prettier"
  ],
  rules: {
    "order/properties-order": [
      [],
      {
        severity: "warning"
      }
    ],
    "prettier/prettier": [
      true,
      {
        severity: "warning"
      }
    ]
  }
}