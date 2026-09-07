import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';
import { reactRefresh } from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  {
    ignores: ['dist/**', 'node_modules/**', 'public/assets/documents/**'],
  },
  {
    files: ['**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite(),
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.nodeBuiltin,
      },
    },
  },
  {
    files: ['components/Icons.tsx', 'context/LanguageContext.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
);