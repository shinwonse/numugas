/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@numugas/eslint-config/next.js"],
  rules: { "no-restricted-exports": "off" },
  parser: "@typescript-eslint/parser",
  parserOptions: { project: true }
};
