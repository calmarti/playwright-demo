import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['node_modules', 'playwright-report', 'test-results', 'junit-report'],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    rules: {
      'no-console': 'warn',
    },
  },
];