import typescript from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

const browserGlobals = {
  React: 'readable',
  window: 'readable',
  document: 'readable',
  navigator: 'readable',
  localStorage: 'readable',
  fetch: 'readable',
  RequestInit: 'readable',
  Response: 'readable',
  alert: 'readable',
  confirm: 'readable',
  process: 'readable'
};

export default [
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      globals: browserGlobals
    },
    plugins: {
      '@typescript-eslint': typescript,
    },
    rules: {
      "no-undef": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "warn"
    },
    ignores: ["node_modules/**", "dist/**", "build/**"]
  },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      globals: browserGlobals
    },
    rules: {
      "no-undef": "off",
      "no-unused-vars": "warn"
    }
  }
];