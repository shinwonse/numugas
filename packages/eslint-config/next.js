/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["@wonse/eslint-config", "eslint-config-turbo", "prettier"],
  ignorePatterns: [".eslintrc"],
  rules: {
    "no-restricted-exports": "off",
    "@typescript-eslint/consistent-type-imports": "error"
  },
  settings: {
    "tailwindcss": {
      "callees": ["cn"]
    }
  }
};
