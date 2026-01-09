// eslint.config.js
// https://docs.expo.dev/guides/using-eslint/

const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  // Expo preset (React / React Native / Expo defaults)
  expoConfig,

  // Ignore generated / build outputs
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
      '**/*.min.js',
      '**/*.generated.*',
    ],
  },

  // Project rules
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      /**
       * iOS-clean guardrails
       */
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
        },
      ],

      /**
       * React hooks
       */
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      /**
       * TypeScript hygiene
       */
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
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
        },
      ],

      /**
       * General quality
       */
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'react/self-closing-comp': 'warn',
      'react/jsx-boolean-value': ['warn', 'never'],
    },
  },

  // Relax rules for tests
  {
    files: ['**/*.{test,spec}.{js,jsx,ts,tsx}', '**/__tests__/**/*.{js,jsx,ts,tsx}'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  // Node-style config files
  {
    files: [
      '**/*.config.{js,cjs,mjs}',
      'babel.config.js',
      'metro.config.js',
      'eslint.config.js',
    ],
    languageOptions: {
      sourceType: 'commonjs',
    },
    rules: {
      'no-console': 'off',
    },
  },
]);
