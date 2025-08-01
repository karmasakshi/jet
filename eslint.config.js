// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

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
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'class',
          format: ['PascalCase'],
          leadingUnderscore: 'forbid',
        },
        {
          selector: 'enum',
          format: ['PascalCase'],
          leadingUnderscore: 'forbid',
        },
        {
          selector: 'enumMember',
          format: ['PascalCase'],
          leadingUnderscore: 'forbid',
        },
        {
          selector: 'interface',
          format: ['PascalCase'],
          leadingUnderscore: 'forbid',
        },
        {
          selector: 'parameter',
          modifiers: ['unused'],
          format: ['camelCase'],
          leadingUnderscore: 'require',
        },
        {
          selector: 'parameter',
          format: ['camelCase'],
          leadingUnderscore: 'forbid',
        },
        {
          selector: 'typeAlias',
          format: ['PascalCase'],
          leadingUnderscore: 'forbid',
        },
      ],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-inferrable-types': 'off',
      'sort-keys': ['error', 'asc', { caseSensitive: false }],
    },
    languageOptions: { parserOptions: { projectService: true } },
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {
      '@angular-eslint/template/prefer-control-flow': 'error',
      '@angular-eslint/template/prefer-ngsrc': 'error',
      'no-restricted-syntax': [
        'error',
        { selector: 'BoundAttribute[name="ngClass"]' },
        { selector: 'BoundAttribute[name="ngStyle"]' },
      ],
    },
  },
);
