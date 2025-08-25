// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const perfectionist = require('eslint-plugin-perfectionist');

module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'jet', style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'jet', style: 'kebab-case' },
      ],
      '@angular-eslint/prefer-inject': 'error',
      '@angular-eslint/prefer-on-push-component-change-detection': 'error',
      '@angular-eslint/prefer-signals': 'error',

      '@typescript-eslint/explicit-member-accessibility': 'error',
      '@typescript-eslint/member-ordering': [
        'error',
        {
          classes: [
            'private-instance-field',
            'public-instance-field',
            'constructor',
            'public-instance-method',
            'private-instance-method',
          ],
        },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'default',
          format: ['camelCase'],
          leadingUnderscore: 'forbid',
        },
        {
          selector: 'enumMember',
          format: ['PascalCase'],
          leadingUnderscore: 'forbid',
        },
        {
          selector: 'method',
          modifiers: ['private'],
          format: ['camelCase'],
          leadingUnderscore: 'require',
        },
        {
          selector: 'parameter',
          modifiers: ['unused'],
          format: ['camelCase'],
          leadingUnderscore: 'require',
        },
        {
          selector: 'parameterProperty',
          modifiers: ['private'],
          format: ['camelCase'],
          leadingUnderscore: 'require',
        },
        {
          selector: 'property',
          modifiers: ['private'],
          format: ['camelCase', 'snake_case', 'UPPER_CASE'],
          leadingUnderscore: 'require',
        },
        {
          selector: 'property',
          format: ['camelCase', 'snake_case', 'UPPER_CASE'],
          leadingUnderscore: 'forbid',
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
          leadingUnderscore: 'forbid',
        },
        {
          selector: 'variable',
          modifiers: ['const'],
          types: ['function'],
          format: ['camelCase'],
          leadingUnderscore: 'forbid',
        },
        {
          selector: 'variable',
          modifiers: ['const'],
          format: ['camelCase', 'UPPER_CASE'],
          leadingUnderscore: 'forbid',
        },
      ],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-inferrable-types': 'off',

      'perfectionist/sort-enums': ['error'],
      'perfectionist/sort-interfaces': ['error'],
      'perfectionist/sort-intersection-types': ['error'],
      'perfectionist/sort-objects': ['error'],
      'perfectionist/sort-object-types': ['error'],
      'perfectionist/sort-switch-case': ['error'],
      'perfectionist/sort-union-types': ['error'],

      'no-alert': 'error',
      'no-console': 'error',
      'sort-keys': ['error', 'asc', { caseSensitive: false }],
    },
    languageOptions: { parserOptions: { projectService: true } },
    plugins: { perfectionist },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateAll],
    rules: {
      '@angular-eslint/template/attributes-order': 'off',
      '@angular-eslint/template/cyclomatic-complexity': [
        'error',
        { maxComplexity: 6 },
      ],
      '@angular-eslint/template/i18n': 'off',
      '@angular-eslint/template/no-call-expression': 'off',
      '@angular-eslint/template/no-inline-styles': 'off',
      'no-restricted-syntax': [
        'error',
        { selector: 'BoundAttribute[name="ngClass"]' },
        { selector: 'BoundAttribute[name="ngStyle"]' },
      ],
    },
  },
);
