import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import prettier from 'eslint-plugin-prettier'

export default [
    {
        ignores: ['dist'],
    },
    {
        files: ['**/*.{ts,tsx,js,jsx}'],
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            prettier,
            '@typescript-eslint': tseslint,
        },
        rules: {
            ...tseslint.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
            quotes: ['error', 'single', { avoidEscape: true }],
            'no-unused-vars': ['error', { args: 'none' }],
            'prettier/prettier': 'error',
        },
    },
    js.configs.recommended,
]