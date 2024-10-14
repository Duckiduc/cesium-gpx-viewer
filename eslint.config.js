const tsParser = require('@typescript-eslint/parser')
const tsPlugin = require('@typescript-eslint/eslint-plugin')
const reactPlugin = require('eslint-plugin-react')
const prettierPlugin = require('eslint-plugin-prettier')

module.exports = [
  {
    files: ['src/**/*.{js,ts,jsx,tsx}'],
    ignores: ['node_modules/**', 'dist/**', 'out/**', 'build/**'],
    languageOptions: {
      sourceType: 'module', // `ecmaVersion` is no longer necessary
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        module: 'readonly',
        require: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        Buffer: 'readonly',
        setImmediate: 'readonly',
        clearImmediate: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly'
      },
      parser: tsParser
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      prettier: prettierPlugin
    },
    rules: {
      '@typescript-eslint/ban-ts-comment': ['error', { 'ts-ignore': 'allow-with-description' }],
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-function': ['error', { allow: ['arrowFunctions'] }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      'prettier/prettier': 'error' // Prettier formatting rule
    },
    linterOptions: {
      reportUnusedDisableDirectives: true
    }
  },
  {
    files: ['*.js'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off'
    }
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser
    },
    rules: {
      // TypeScript-specific rules can be added here if needed
    }
  }
]
