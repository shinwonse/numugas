/** @type {import("eslint").Linter.Config} */
module.exports = {
  plugins: ['@wonse'],
  extends: ['next/core-web-vitals', 'plugin:@wonse/auto'],
};
