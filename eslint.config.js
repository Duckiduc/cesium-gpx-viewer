const js = require('@eslint/js')
const globals = require('globals')
const tseslint = require('typescript-eslint')
const reactHooks = require('eslint-plugin-react-hooks')
const prettierRecommended = require('eslint-plugin-prettier/recommended')

module.exports = tseslint.config(
  { ignores: ['node_modules/**', 'dist/**', 'out/**'] },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node }
    },
    rules: {
      '@typescript-eslint/ban-ts-comment': ['error', { 'ts-ignore': 'allow-with-description' }],
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-empty-function': ['error', { allow: ['arrowFunctions'] }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'off'
    }
  },
  {
    files: ['src/renderer/**/*.{ts,tsx}'],
    extends: [reactHooks.configs.flat.recommended]
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: globals.node
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off'
    }
  },
  prettierRecommended
)
