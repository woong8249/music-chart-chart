import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import globals from "globals";

const filename = fileURLToPath(import.meta.url);
const dirName = dirname(filename);
const compat = new FlatCompat();
const defaultConfig = [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      ts: tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.base.rules,
      ...tsPlugin.configs['eslint-recommended'].rules,
      ...tsPlugin.configs['strict-type-checked'].rules,
    },
    settings: {
      'import/resolver': {
        typescript: true,
      },
    },
  },
];

const customConfig = [
  ...compat.extends(join(dirName, 'importless-airbnb-base.cjs')),
  {
    languageOptions: {
      parserOptions: { // for import.meta.url
      // Eslint doesn't supply ecmaVersion in `parser.js` `context.parserOptions`
      // This is required to avoid ecmaVersion < 2015 error or 'import' / 'export' error
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      'no-shadow': 'off',
      'no-underscore-dangle': ['error', { allow: ['__filename', '__dirname'] }],
      'max-len': ['error', { code: 200 }],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "error",
    },
  },
];

const config = [...defaultConfig, ...customConfig];

export default config;
