const eslintPluginPrettier = require('eslint-plugin-prettier');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');

module.exports = [
	{
		files: ['frontend/src/**/*.ts',
			'frontend/src/**/*.tsx',
			'backend/src/**/*.ts',
			'shared/**/*.ts',
		],
		ignores: ['**/node_modules', '**/dist', '**/build'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
			 project: ['./frontend/tsconfig.json', './backend/tsconfig.json', '.tsconfig.json'],
			},
		},
		plugins: {
			'@typescript-eslint': tseslint,
			prettier: eslintPluginPrettier,
		},
		rules: {
			'prettier/prettier': 'error',
			quotes: ['error', 'single', { allowTemplateLiterals: true }],
			semi: ['error', 'always'],
			'@typescript-eslint/no-unused-vars': ['warn', { args: 'all', argsIgnorePattern: '^_' }],
		},
	},
];
