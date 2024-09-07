/** @type {import("eslint").Linter.Config} */
module.exports = {
  plugins: ['@wonse'],
  extends: ['next/core-web-vitals', 'plugin:tailwindcss/recommended', 'plugin:@wonse/auto'],
  settings: {
    tailwindcss: {
      callees: ['cn'],
    },
  },
};
