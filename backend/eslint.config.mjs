import { ESLint } from 'eslint';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default [
  {
    files: ['**/*.{js,mjs,ts}'],
    ignores: ['node_modules/**', 'dist/**', '*.d.ts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },
    rules: {
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      // General rules
      'no-console': 'warn',
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',

      // Best practices
      eqeqeq: 'error',
      curly: 'error',
      'no-duplicate-imports': 'error',
      'no-unused-expressions': 'error',
    },
  },
  {
    files: ['**/*.test.{js,mjs,ts}', '**/__tests__/**/*.{js,mjs,ts}'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
