// eslint.config.js
// https://docs.expo.dev/guides/using-eslint/

const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');

module.exports = defineConfig([
  // 1) Expo preset
  expoConfig,

  // 2) Ignore
  {
    ignores: [
      'dist/*',
      'build/*',
      '.expo/*',
      '.output/*',
      'coverage/*',
      'node_modules/*',
      'android/*',
      'ios/*',
    ],
  },

  // 3) TypeScript / TSX rules
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@expo/vector-icons',
              message: 'Do not use @expo/vector-icons. Use phosphor-react-native instead.',
            },
            {
              name: 'react-native-paper',
              message: 'Do not use react-native-paper (Material). Keep iOS-clean UI stack.',
            },
          ],
          patterns: [
            {
              group: ['../*'],
              message: 'DETECTED RELATIVE IMPORT: Please use path aliases (e.g. @/components, @/hooks) instead of imports pointing back to parent folders (../).',
            },
          ],
        },
      ],


      // TS rules
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      // '@typescript-eslint/consistent-type-imports': [
      //   'warn',
      //   {
      //     prefer: 'type-imports',
      //     fixStyle: 'separate-type-imports',
      //   },
      // ],
    },
  },

  {
    files: ['**/*.{js,jsx}'],
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
]);