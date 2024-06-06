// @ts-check

const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'jet',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'jet',
          style: 'kebab-case',
        },
      ],
      '@typescript-eslint/consistent-generic-constructors': [
        'error',
        'type-annotation',
      ],
      '@typescript-eslint/explicit-member-accessibility': 'error',
      '@typescript-eslint/no-inferrable-types': 'off',
      'sort-keys': 'error',
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  },
);
