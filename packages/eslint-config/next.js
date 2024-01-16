/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["next/core-web-vitals", "@wonse/eslint-config", "eslint-config-turbo", "prettier"],
  ignorePatterns: [".eslintrc"],
  rules: {
    "no-restricted-exports": "off",
    "@typescript-eslint/consistent-type-imports": "error"
  },
  settings: {
    "tailwindcss": {
      "callees": ["cn"]
    },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"]
    },
    "import/resolver": {
      "typescript": {}
    }
  }
};
